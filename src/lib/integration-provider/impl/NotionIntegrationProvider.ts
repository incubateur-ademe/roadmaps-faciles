import "server-only";
import { Client, isFullDataSource, isFullPage } from "@notionhq/client";
import {
  type BlockObjectRequest,
  type CreatePageParameters,
  type DataSourceObjectResponse,
  type PageObjectResponse,
  type UpdatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";

import { type IIntegrationProvider } from "../IIntegrationProvider";
import {
  type ConnectionTestResult,
  type InboundChange,
  type IntegrationConfig,
  type PostSyncData,
  type RemoteDatabase,
  type RemoteDatabaseSchema,
  type RemoteProperty,
  type RemotePropertyType,
  type SyncResult,
} from "../types";

const NOTION_PROPERTY_TYPES = new Set<RemotePropertyType>([
  "title",
  "rich_text",
  "select",
  "status",
  "multi_select",
  "number",
]);

type NotionPageProperties = NonNullable<UpdatePageParameters["properties"]>;
type DataSourceProperty = DataSourceObjectResponse["properties"][string];

export class NotionIntegrationProvider implements IIntegrationProvider {
  private readonly client: Client;
  private readonly config: IntegrationConfig;

  constructor(integrationConfig: IntegrationConfig) {
    this.config = integrationConfig;
    this.client = new Client({
      auth: integrationConfig.apiKey,
      timeoutMs: 30_000,
    });
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    try {
      const me = await this.client.users.me({});
      return {
        success: true,
        botName: me.name ?? undefined,
        workspaceId: me.id,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  public async listRemoteDatabases(): Promise<RemoteDatabase[]> {
    const databases: RemoteDatabase[] = [];
    const response = await this.client.search({
      filter: { property: "object", value: "data_source" },
    });

    for (const item of response.results) {
      if (isFullDataSource(item)) {
        databases.push({
          id: item.id,
          name: item.title.map(t => t.plain_text).join("") || "Untitled",
          url: item.url,
        });
      }
    }

    return databases;
  }

  public async getRemoteDatabaseSchema(databaseId: string): Promise<RemoteDatabaseSchema> {
    const ds = await this.client.dataSources.retrieve({ data_source_id: databaseId });

    if (!isFullDataSource(ds)) {
      throw new Error("Could not retrieve full data source schema");
    }

    const properties: RemoteProperty[] = [];

    for (const [name, prop] of Object.entries(ds.properties)) {
      if (!NOTION_PROPERTY_TYPES.has(prop.type as RemotePropertyType)) continue;

      const remoteProp: RemoteProperty = {
        id: prop.id,
        name,
        type: prop.type as RemotePropertyType,
      };

      const options = this.extractPropertyOptions(prop);
      if (options) remoteProp.options = options;

      properties.push(remoteProp);
    }

    return {
      id: ds.id,
      name: ds.title.map(t => t.plain_text).join("") || "Untitled",
      properties,
    };
  }

  public async syncOutbound(post: PostSyncData, existingRemoteId?: string): Promise<SyncResult> {
    try {
      const properties = this.buildNotionProperties(post);

      if (existingRemoteId) {
        const page = await this.client.pages.update({
          page_id: existingRemoteId,
          properties,
        });
        return { success: true, remoteId: page.id, remoteUrl: this.buildRemoteUrl(page.id) };
      }

      const children = this.buildPageContent(post);
      const createParams: CreatePageParameters = {
        parent: { type: "database_id", database_id: this.config.databaseId },
        properties,
        children,
      };
      const page = await this.client.pages.create(createParams);
      return { success: true, remoteId: page.id, remoteUrl: this.buildRemoteUrl(page.id) };
    } catch (error) {
      return { success: false, remoteId: existingRemoteId ?? "", error: (error as Error).message };
    }
  }

  public async syncInbound(since?: Date): Promise<InboundChange[]> {
    const changes: InboundChange[] = [];
    const filter = since
      ? { timestamp: "last_edited_time" as const, last_edited_time: { after: since.toISOString() } }
      : undefined;

    const response = await this.client.dataSources.query({
      data_source_id: this.config.databaseId,
      filter,
      sorts: [{ timestamp: "last_edited_time", direction: "ascending" }],
    });

    for (const page of response.results) {
      if (!isFullPage(page)) continue;

      const change = this.extractInboundChange(page);
      if (!change) continue;

      // If description is mapped as page_content, read blocks
      if (this.config.propertyMapping.description?.type === "page_content") {
        change.description = await this.readPageContent(page.id);
      }

      changes.push(change);
    }

    return changes;
  }

  public buildRemoteUrl(remoteId: string): string {
    const cleanId = remoteId.replace(/-/g, "");
    return `https://www.notion.so/${cleanId}`;
  }

  public async updateCommentsField(
    remoteId: string,
    count: number,
    tenantUrl: string,
    postPath: string,
  ): Promise<void> {
    const fieldName = this.config.propertyMapping.commentsInfo;
    if (!fieldName) return;

    const url = `${tenantUrl}${postPath}`;
    const text = count > 0 ? `${count} commentaire${count > 1 ? "s" : ""} — Voir sur ${url}` : `Voir sur ${url}`;

    await this.client.pages.update({
      page_id: remoteId,
      properties: {
        [fieldName]: {
          rich_text: [{ type: "text", text: { content: text, link: { url } } }],
        },
      },
    });
  }

  public async updateLikesField(remoteId: string, count: number): Promise<void> {
    const fieldName = this.config.propertyMapping.likes;
    if (!fieldName) return;

    await this.client.pages.update({
      page_id: remoteId,
      properties: {
        [fieldName]: { number: count },
      },
    });
  }

  // --- Private helpers ---

  private extractPropertyOptions(
    prop: DataSourceProperty,
  ): Array<{ color: string; id: string; name: string }> | undefined {
    if (prop.type === "select") {
      return prop.select.options.map(o => ({ id: o.id, name: o.name, color: o.color }));
    }
    if (prop.type === "status") {
      return prop.status.options.map(o => ({ id: o.id, name: o.name, color: o.color }));
    }
    if (prop.type === "multi_select") {
      return prop.multi_select.options.map(o => ({ id: o.id, name: o.name, color: o.color }));
    }
    return undefined;
  }

  private buildNotionProperties(post: PostSyncData): NotionPageProperties {
    const { propertyMapping, statusMapping } = this.config;
    const properties: NotionPageProperties = {};

    // Title
    properties[propertyMapping.title] = {
      title: [{ type: "text", text: { content: post.title } }],
    };

    // Description (as property if configured)
    if (propertyMapping.description && propertyMapping.description.type === "property" && post.description) {
      properties[propertyMapping.description.name] = {
        rich_text: [{ type: "text", text: { content: post.description.slice(0, 2000) } }],
      };
    }

    // Status
    if (propertyMapping.status && post.postStatusId) {
      const statusEntry = Object.values(statusMapping).find(m => m.localId === post.postStatusId);
      if (statusEntry) {
        properties[propertyMapping.status.name] =
          propertyMapping.status.type === "status"
            ? { status: { name: statusEntry.notionName } }
            : { select: { name: statusEntry.notionName } };
      }
    }

    // Tags
    if (propertyMapping.tags && post.tags.length > 0) {
      properties[propertyMapping.tags] = {
        multi_select: post.tags.map(tag => ({ name: tag })),
      };
    }

    return properties;
  }

  private buildPageContent(post: PostSyncData): BlockObjectRequest[] {
    const { propertyMapping } = this.config;

    // If description is mapped as page content, add it as blocks
    if (propertyMapping.description?.type === "page_content" && post.description) {
      return this.markdownToBlocks(post.description);
    }

    return [];
  }

  private markdownToBlocks(markdown: string): BlockObjectRequest[] {
    const blocks: BlockObjectRequest[] = [];
    const lines = markdown.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Headings
      if (trimmed.startsWith("### ")) {
        blocks.push({
          object: "block",
          type: "heading_3",
          heading_3: { rich_text: [{ type: "text", text: { content: trimmed.slice(4) } }] },
        });
      } else if (trimmed.startsWith("## ")) {
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: { rich_text: [{ type: "text", text: { content: trimmed.slice(3) } }] },
        });
      } else if (trimmed.startsWith("# ")) {
        blocks.push({
          object: "block",
          type: "heading_1",
          heading_1: { rich_text: [{ type: "text", text: { content: trimmed.slice(2) } }] },
        });
      }
      // Bullet list
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: { rich_text: [{ type: "text", text: { content: trimmed.slice(2) } }] },
        });
      }
      // Code block (single backtick line — simplified)
      else if (trimmed.startsWith("```")) {
        // Skip code fence markers — content between fences handled by paragraph fallback
        continue;
      }
      // Paragraph
      else {
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ type: "text", text: { content: trimmed.slice(0, 2000) } }] },
        });
      }
    }

    return blocks;
  }

  private async readPageContent(pageId: string): Promise<string> {
    const response = await this.client.blocks.children.list({ block_id: pageId });
    const lines: string[] = [];

    for (const block of response.results) {
      const b = block as { type: string } & Record<string, unknown>;
      const richText = (b[b.type] as { rich_text?: Array<{ plain_text: string }> } | undefined)?.rich_text;
      const text = richText?.map(t => t.plain_text).join("") ?? "";

      switch (b.type) {
        case "heading_1":
          lines.push(`# ${text}`);
          break;
        case "heading_2":
          lines.push(`## ${text}`);
          break;
        case "heading_3":
          lines.push(`### ${text}`);
          break;
        case "bulleted_list_item":
          lines.push(`- ${text}`);
          break;
        case "numbered_list_item":
          lines.push(`1. ${text}`);
          break;
        case "to_do": {
          const checked = (b[b.type] as { checked?: boolean } | undefined)?.checked;
          lines.push(`- [${checked ? "x" : " "}] ${text}`);
          break;
        }
        case "code": {
          const language = (b[b.type] as { language?: string } | undefined)?.language ?? "";
          lines.push(`\`\`\`${language}`, text, "```");
          break;
        }
        case "divider":
          lines.push("---");
          break;
        case "paragraph":
        default:
          if (text) lines.push(text);
          else lines.push("");
          break;
      }
    }

    return lines.join("\n");
  }

  private extractInboundChange(page: PageObjectResponse): InboundChange | null {
    const { propertyMapping } = this.config;
    const props = page.properties;

    const titleProp = props[propertyMapping.title];
    const title = extractTitle(titleProp);
    if (!title) return null;

    const change: InboundChange = {
      remoteId: page.id,
      remoteUrl: page.url,
      title,
      lastEditedTime: page.last_edited_time,
    };

    // Description from property
    if (propertyMapping.description?.type === "property") {
      const descProp = props[propertyMapping.description.name];
      change.description = extractRichText(descProp);
    }

    // Status
    if (propertyMapping.status) {
      const statusProp = props[propertyMapping.status.name];
      const optionId = extractSelectOptionId(statusProp);
      if (optionId) change.statusNotionOptionId = optionId;
    }

    // Board
    if (propertyMapping.board) {
      const boardProp = props[propertyMapping.board.name];
      const optionId = extractSelectOptionId(boardProp);
      if (optionId) change.boardNotionOptionId = optionId;
    }

    // Tags
    if (propertyMapping.tags) {
      const tagsProp = props[propertyMapping.tags];
      change.tags = extractMultiSelect(tagsProp);
    }

    return change;
  }
}

// --- Notion property value extractors ---

type PageProperty = PageObjectResponse["properties"][string];

function extractTitle(prop: PageProperty | undefined): string | undefined {
  if (!prop || prop.type !== "title") return undefined;
  return prop.title.map(t => t.plain_text).join("");
}

function extractRichText(prop: PageProperty | undefined): string | undefined {
  if (!prop || prop.type !== "rich_text") return undefined;
  return prop.rich_text.map(t => t.plain_text).join("");
}

function extractSelectOptionId(prop: PageProperty | undefined): string | undefined {
  if (!prop) return undefined;
  if (prop.type === "select" && prop.select) return prop.select.id;
  if (prop.type === "status" && prop.status) return prop.status.id;
  return undefined;
}

function extractMultiSelect(prop: PageProperty | undefined): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select.map(o => o.name);
}
