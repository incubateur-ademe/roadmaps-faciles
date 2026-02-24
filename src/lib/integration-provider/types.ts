import "server-only";

export type ConnectionTestResult = {
  botName?: string;
  success: boolean;
  workspaceId?: string;
  workspaceName?: string;
} & ({ error: string; success: false } | { success: true });

export interface RemoteDatabase {
  id: string;
  name: string;
  url: string;
}

export type RemotePropertyType = "multi_select" | "number" | "rich_text" | "select" | "status" | "title";

export interface RemotePropertyOption {
  color?: string;
  id: string;
  name: string;
}

export interface RemoteProperty {
  id: string;
  name: string;
  options?: RemotePropertyOption[];
  type: RemotePropertyType;
}

export interface RemoteDatabaseSchema {
  id: string;
  name: string;
  properties: RemoteProperty[];
}

export interface PropertyMappingConfig {
  commentsInfo?: string;
  description?: { name: string; type: "property" } | { type: "page_content" };
  likes?: string;
  status?: string;
  tags?: string;
  title: string;
}

export interface ValueMapping {
  localId: number;
  notionName: string;
}

export interface IntegrationConfig {
  apiKey: string;
  boardMapping: Record<string, ValueMapping>;
  databaseId: string;
  databaseName: string;
  lastSyncCursor?: string;
  propertyMapping: PropertyMappingConfig;
  statusMapping: Record<string, ValueMapping>;
  syncDirection: "bidirectional" | "inbound" | "outbound";
}

export interface SyncResult {
  error?: string;
  remoteId: string;
  remoteUrl?: string;
  success: boolean;
}

export interface InboundChange {
  boardNotionOptionId?: string;
  description?: string;
  lastEditedTime: string;
  remoteId: string;
  remoteUrl: string;
  statusNotionOptionId?: string;
  tags?: string[];
  title: string;
}

export interface PostSyncData {
  boardId: number;
  commentCount: number;
  description: null | string;
  likeCount: number;
  postId: number;
  postStatusId: null | number;
  slug: null | string;
  tags: string[];
  tenantUrl: string;
  title: string;
}

export interface CronExecutionReport {
  errors: Array<{ error: string; integrationId: number }>;
  processed: number;
  skipped: number;
}
