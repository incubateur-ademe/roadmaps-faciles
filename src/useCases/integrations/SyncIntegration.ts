import { createIntegrationProvider } from "@/lib/integration-provider";
import { decrypt } from "@/lib/integration-provider/encryption";
import { type IntegrationConfig, type PostSyncData } from "@/lib/integration-provider/types";
import { logger } from "@/lib/logger";
import { type IIntegrationMappingRepo } from "@/lib/repo/IIntegrationMappingRepo";
import { type IIntegrationRepo } from "@/lib/repo/IIntegrationRepo";
import { type IIntegrationSyncLogRepo } from "@/lib/repo/IIntegrationSyncLogRepo";
import { type IPostRepo } from "@/lib/repo/IPostRepo";
import { type Prisma, type TenantIntegration } from "@/prisma/client";
import { IntegrationSyncStatus, SyncDirection, SyncLogStatus } from "@/prisma/enums";

import { type UseCase } from "../types";

export interface SyncIntegrationInput {
  integrationId: number;
  tenantId: number;
  tenantUrl: string;
}

export interface SyncIntegrationOutput {
  conflicts: number;
  errors: number;
  synced: number;
}

export class SyncIntegration implements UseCase<SyncIntegrationInput, SyncIntegrationOutput> {
  constructor(
    private readonly integrationRepo: IIntegrationRepo,
    private readonly integrationMappingRepo: IIntegrationMappingRepo,
    private readonly syncLogRepo: IIntegrationSyncLogRepo,
    private readonly postRepo: IPostRepo,
  ) {}

  public async execute(input: SyncIntegrationInput): Promise<SyncIntegrationOutput> {
    const integration = await this.integrationRepo.findById(input.integrationId);
    if (!integration || integration.tenantId !== input.tenantId) {
      throw new Error("Integration not found");
    }

    if (!integration.enabled) {
      throw new Error("Integration is disabled");
    }

    const rawConfig = integration.config as unknown as IntegrationConfig;
    const decryptedConfig = { ...rawConfig, apiKey: decrypt(rawConfig.apiKey) };
    const provider = createIntegrationProvider(integration.type, decryptedConfig);

    const result: SyncIntegrationOutput = { synced: 0, errors: 0, conflicts: 0 };

    try {
      const direction = decryptedConfig.syncDirection;

      if (direction === "outbound" || direction === "bidirectional") {
        const outResult = await this.syncOutbound(integration, decryptedConfig, provider, input.tenantUrl);
        result.synced += outResult.synced;
        result.errors += outResult.errors;
      }

      if (direction === "inbound" || direction === "bidirectional") {
        const inResult = await this.syncInbound(integration, decryptedConfig, provider);
        result.synced += inResult.synced;
        result.errors += inResult.errors;
      }

      // Update last sync cursor and timestamp
      await this.integrationRepo.update(integration.id, {
        lastSyncAt: new Date(),
        config: {
          ...rawConfig,
          lastSyncCursor: new Date().toISOString(),
        } as unknown as Prisma.InputJsonValue,
      });
    } catch (error) {
      // Batch-level error
      await this.syncLogRepo.create({
        integrationId: integration.id,
        direction: SyncDirection.OUTBOUND,
        status: SyncLogStatus.ERROR,
        message: (error as Error).message,
      });
      result.errors++;
    }

    return result;
  }

  private async syncOutbound(
    integration: TenantIntegration,
    config: IntegrationConfig,
    provider: ReturnType<typeof createIntegrationProvider>,
    tenantUrl: string,
  ): Promise<{ errors: number; synced: number }> {
    let synced = 0;
    let errors = 0;

    // Get all boards mapped for this integration
    const boardMappings = Object.values(config.boardMapping);
    const boardIds = boardMappings.map(m => m.localId);

    // Fetch posts for all mapped boards
    const posts = await this.postRepo.findAllForBoards(boardIds, integration.tenantId);

    for (const post of posts) {
      try {
        const existingMapping = await this.integrationMappingRepo.findByLocalEntity(integration.id, "post", post.id);

        // Skip inbound posts (avoid sync loops)
        if (
          existingMapping?.metadata &&
          (existingMapping.metadata as Record<string, unknown>).direction === "inbound"
        ) {
          continue;
        }

        // Check for conflicts in bidirectional mode
        if (config.syncDirection === "bidirectional" && existingMapping?.lastSyncAt) {
          const lastSync = new Date(existingMapping.lastSyncAt);
          if (post.updatedAt > lastSync) {
            // Post was modified locally since last sync — potential conflict handled below
          }
        }

        const postData: PostSyncData = {
          postId: post.id,
          title: post.title,
          description: post.description,
          boardId: post.boardId,
          postStatusId: post.postStatusId,
          tags: post.tags,
          slug: post.slug,
          commentCount: await this.getCommentCount(post.id),
          likeCount: await this.getLikeCount(post.id),
          tenantUrl,
        };

        const syncResult = await provider.syncOutbound(postData, existingMapping?.remoteId);

        if (syncResult.success) {
          if (existingMapping) {
            await this.integrationMappingRepo.update(existingMapping.id, {
              syncStatus: IntegrationSyncStatus.SYNCED,
              lastSyncAt: new Date(),
              lastError: null,
              remoteUrl: syncResult.remoteUrl,
            });
          } else {
            await this.integrationMappingRepo.create({
              integrationId: integration.id,
              localType: "post",
              localId: post.id,
              remoteId: syncResult.remoteId,
              remoteUrl: syncResult.remoteUrl,
              syncStatus: IntegrationSyncStatus.SYNCED,
              lastSyncAt: new Date(),
              metadata: { direction: "outbound" },
            });
          }

          // Update comments and likes fields
          if (syncResult.remoteId) {
            const boardSlug = post.slug ?? String(post.id);
            await provider
              .updateCommentsField(
                syncResult.remoteId,
                postData.commentCount,
                tenantUrl,
                `/board/${boardSlug}/post/${post.id}`,
              )
              .catch(err => logger.warn({ err }, "Failed to update comments field"));

            await provider
              .updateLikesField(syncResult.remoteId, postData.likeCount)
              .catch(err => logger.warn({ err }, "Failed to update likes field"));
          }

          await this.syncLogRepo.create({
            integrationId: integration.id,
            mappingId: existingMapping?.id,
            direction: SyncDirection.OUTBOUND,
            status: SyncLogStatus.SUCCESS,
          });
          synced++;
        } else {
          if (existingMapping) {
            await this.integrationMappingRepo.update(existingMapping.id, {
              syncStatus: IntegrationSyncStatus.ERROR,
              lastError: syncResult.error,
            });
          }
          await this.syncLogRepo.create({
            integrationId: integration.id,
            mappingId: existingMapping?.id,
            direction: SyncDirection.OUTBOUND,
            status: SyncLogStatus.ERROR,
            message: syncResult.error,
          });
          errors++;
        }
      } catch (error) {
        await this.syncLogRepo.create({
          integrationId: integration.id,
          direction: SyncDirection.OUTBOUND,
          status: SyncLogStatus.ERROR,
          message: (error as Error).message,
          details: { postId: post.id },
        });
        errors++;
      }
    }

    return { synced, errors };
  }

  private async syncInbound(
    integration: TenantIntegration,
    config: IntegrationConfig,
    provider: ReturnType<typeof createIntegrationProvider>,
  ): Promise<{ errors: number; synced: number }> {
    let synced = 0;
    let errors = 0;

    const since = config.lastSyncCursor ? new Date(config.lastSyncCursor) : undefined;
    const changes = await provider.syncInbound(since);

    for (const change of changes) {
      try {
        const existingMapping = await this.integrationMappingRepo.findByRemoteId(integration.id, change.remoteId);

        // Resolve board from the mapping config
        let boardId: number | undefined;
        if (change.boardNotionOptionId && config.boardMapping[change.boardNotionOptionId]) {
          boardId = config.boardMapping[change.boardNotionOptionId].localId;
        } else {
          // Default to first mapped board
          const firstBoard = Object.values(config.boardMapping)[0];
          boardId = firstBoard?.localId;
        }

        if (!boardId) {
          await this.syncLogRepo.create({
            integrationId: integration.id,
            direction: SyncDirection.INBOUND,
            status: SyncLogStatus.SKIPPED,
            message: `No board mapping found for remote page ${change.remoteId}`,
          });
          errors++;
          continue;
        }

        // Resolve status
        let postStatusId: null | number = null;
        if (change.statusNotionOptionId && config.statusMapping[change.statusNotionOptionId]) {
          postStatusId = config.statusMapping[change.statusNotionOptionId].localId;
        }

        if (existingMapping) {
          // Check for conflict in bidirectional mode
          if (config.syncDirection === "bidirectional" && existingMapping.lastSyncAt) {
            const post = await this.postRepo.findById(existingMapping.localId);
            if (post && post.updatedAt > existingMapping.lastSyncAt) {
              // Both sides modified — mark as conflict
              await this.integrationMappingRepo.update(existingMapping.id, {
                syncStatus: IntegrationSyncStatus.CONFLICT,
                lastError: "Both local and remote were modified since last sync",
              });
              await this.syncLogRepo.create({
                integrationId: integration.id,
                mappingId: existingMapping.id,
                direction: SyncDirection.INBOUND,
                status: SyncLogStatus.CONFLICT,
                message: `Conflict detected for post ${existingMapping.localId}`,
              });
              continue;
            }
          }

          // Update existing post
          await this.postRepo.update(existingMapping.localId, {
            title: change.title,
            description: change.description ?? null,
            postStatusId,
            tags: change.tags ?? [],
          });
          await this.integrationMappingRepo.update(existingMapping.id, {
            syncStatus: IntegrationSyncStatus.SYNCED,
            lastSyncAt: new Date(),
            lastError: null,
          });
        } else {
          // Create new post from inbound data
          const newPost = await this.postRepo.create({
            title: change.title,
            description: change.description ?? null,
            boardId,
            postStatusId,
            tenantId: integration.tenantId,
            tags: change.tags ?? [],
            approvalStatus: "APPROVED", // Inbound posts skip moderation
          });

          await this.integrationMappingRepo.create({
            integrationId: integration.id,
            localType: "post",
            localId: newPost.id,
            remoteId: change.remoteId,
            remoteUrl: change.remoteUrl,
            syncStatus: IntegrationSyncStatus.SYNCED,
            lastSyncAt: new Date(),
            metadata: { direction: "inbound" },
          });
        }

        await this.syncLogRepo.create({
          integrationId: integration.id,
          mappingId: existingMapping?.id,
          direction: SyncDirection.INBOUND,
          status: SyncLogStatus.SUCCESS,
        });
        synced++;
      } catch (error) {
        await this.syncLogRepo.create({
          integrationId: integration.id,
          direction: SyncDirection.INBOUND,
          status: SyncLogStatus.ERROR,
          message: (error as Error).message,
          details: { remoteId: change.remoteId },
        });
        errors++;
      }
    }

    return { synced, errors };
  }

  private async getCommentCount(postId: number): Promise<number> {
    const counts = await this.postRepo.getPostCounts(postId);
    return counts.comments;
  }

  private async getLikeCount(postId: number): Promise<number> {
    const counts = await this.postRepo.getPostCounts(postId);
    return counts.likes;
  }
}
