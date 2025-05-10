import { prisma } from "@/lib/db/prisma";
import { type Prisma, type TenantSetting } from "@/prisma/client";

import { type ITenantSettingRepo } from "../ITenantSettingRepo";

export class TenantSettingRepoPrisma implements ITenantSettingRepo {
  public findAll(): Promise<TenantSetting[]> {
    return prisma.tenantSetting.findMany();
  }

  public findById(id: number): Promise<TenantSetting | null> {
    return prisma.tenantSetting.findUnique({ where: { id } });
  }

  public findByTenantId(tenantId: number): Promise<TenantSetting | null> {
    return prisma.tenantSetting.findFirst({ where: { tenantId } });
  }

  public create(data: Prisma.TenantSettingUncheckedCreateInput): Promise<TenantSetting> {
    return prisma.tenantSetting.create({ data });
  }

  public update(id: number, data: Prisma.TenantSettingUncheckedUpdateInput): Promise<TenantSetting> {
    return prisma.tenantSetting.update({ where: { id }, data });
  }
}
