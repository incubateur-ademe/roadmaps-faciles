import { prisma } from "@/lib/db/prisma";
import { type Prisma, type TenantDefaultOAuth } from "@/prisma/client";

import { type ITenantDefaultOAuthRepo } from "../ITenantDefaultOAuthRepo";

export class TenantDefaultOAuthRepoPrisma implements ITenantDefaultOAuthRepo {
  public findAll(): Promise<TenantDefaultOAuth[]> {
    return prisma.tenantDefaultOAuth.findMany();
  }

  public findById(id: number): Promise<TenantDefaultOAuth | null> {
    return prisma.tenantDefaultOAuth.findUnique({ where: { id } });
  }

  public create(data: Prisma.TenantDefaultOAuthUncheckedCreateInput): Promise<TenantDefaultOAuth> {
    return prisma.tenantDefaultOAuth.create({ data });
  }
}
