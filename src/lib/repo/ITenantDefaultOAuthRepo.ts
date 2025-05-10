import { type Prisma, type TenantDefaultOAuth } from "@/prisma/client";

export interface ITenantDefaultOAuthRepo {
  create(data: Prisma.TenantDefaultOAuthUncheckedCreateInput): Promise<TenantDefaultOAuth>;
  findAll(): Promise<TenantDefaultOAuth[]>;
  findById(id: number): Promise<TenantDefaultOAuth | null>;
}
