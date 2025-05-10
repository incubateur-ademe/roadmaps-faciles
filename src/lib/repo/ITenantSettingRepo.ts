import { type Prisma, type TenantSetting } from "@/prisma/client";

export interface ITenantSettingRepo {
  create(data: Prisma.TenantSettingUncheckedCreateInput): Promise<TenantSetting>;
  findAll(): Promise<TenantSetting[]>;
  findById(id: number): Promise<TenantSetting | null>;
  findByTenantId(tenantId: number): Promise<TenantSetting | null>;
  update(id: number, data: Prisma.TenantSettingUncheckedUpdateInput): Promise<TenantSetting>;
}
