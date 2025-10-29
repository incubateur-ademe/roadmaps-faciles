import { type Prisma, type TenantSettings } from "@/prisma/client";

export interface ITenantSettingsRepo {
  create(data: Prisma.TenantSettingsUncheckedCreateInput): Promise<TenantSettings>;
  findAll(): Promise<TenantSettings[]>;
  findById(id: number): Promise<TenantSettings | null>;
  findByTenantId(tenantId: number): Promise<TenantSettings | null>;
  update(id: number, data: Prisma.TenantSettingsUncheckedUpdateInput): Promise<TenantSettings>;
}
