import "server-only";

import {
  type ConnectionTestResult,
  type InboundChange,
  type PostSyncData,
  type RemoteDatabase,
  type RemoteDatabaseSchema,
  type SyncResult,
} from "./types";

export interface IIntegrationProvider {
  /** Build a user-facing URL for a remote resource */
  buildRemoteUrl(remoteId: string): string;

  /** Retrieve the schema (properties) of a remote database */
  getRemoteDatabaseSchema(databaseId: string): Promise<RemoteDatabaseSchema>;

  /** List all databases accessible to the integration */
  listRemoteDatabases(): Promise<RemoteDatabase[]>;

  /** Pull changes from the remote service since a given date */
  syncInbound(since?: Date): Promise<InboundChange[]>;

  /** Push a post to the remote service (create or update) */
  syncOutbound(post: PostSyncData, existingRemoteId?: string): Promise<SyncResult>;

  /** Validate the connection credentials */
  testConnection(): Promise<ConnectionTestResult>;

  /** Update the comments info field on a remote page */
  updateCommentsField(remoteId: string, count: number, tenantUrl: string, postPath: string): Promise<void>;

  /** Update the likes count field on a remote page */
  updateLikesField(remoteId: string, count: number): Promise<void>;
}
