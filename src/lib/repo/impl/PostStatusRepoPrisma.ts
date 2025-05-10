import { prisma } from "@/lib/db/prisma";
import { type PostStatus, type Prisma } from "@/prisma/client";

import { type IPostStatusRepo } from "../IPostStatusRepo";

export class PostStatusRepoPrisma implements IPostStatusRepo {
  public findAll(): Promise<PostStatus[]> {
    return prisma.postStatus.findMany();
  }

  public findById(id: number): Promise<PostStatus | null> {
    return prisma.postStatus.findUnique({ where: { id } });
  }

  public create(data: Prisma.PostStatusUncheckedCreateInput): Promise<PostStatus> {
    return prisma.postStatus.create({ data });
  }

  public findAllForTenant(tenantId: number): Promise<PostStatus[]> {
    return prisma.postStatus.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
    });
  }
}
