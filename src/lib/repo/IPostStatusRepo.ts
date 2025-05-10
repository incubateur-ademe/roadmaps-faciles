import { type PostStatus, type Prisma } from "@/prisma/client";

export interface IPostStatusRepo {
  create(data: Prisma.PostStatusUncheckedCreateInput): Promise<PostStatus>;
  findAll(): Promise<PostStatus[]>;
  findAllForTenant(tenantId: number): Promise<PostStatus[]>;
  findById(id: number): Promise<PostStatus | null>;
}
