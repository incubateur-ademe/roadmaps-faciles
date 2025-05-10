import { prisma } from "@/lib/db/prisma";
import { type Prisma, type Tenant, type TenantSetting } from "@/prisma/client";

import { type ITenantRepo } from "../ITenantRepo";

export class TenantRepoPrisma implements ITenantRepo {
  public findAll(): Promise<Tenant[]> {
    return prisma.tenant.findMany();
  }

  public async findById(id: number): Promise<Tenant | null> {
    const ret = await prisma.tenant.findUnique({
      where: { id },
    });

    return ret;
  }

  public async findByIdWithSettings(id: number): Promise<(Tenant & { settings: TenantSetting | null }) | null> {
    const ret = await prisma.tenant.findUnique({
      where: { id },
      include: {
        settings: true,
      },
    });

    return ret;
  }

  public findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { subdomain } });
  }

  public findByCustomDomain(customDomain: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { customDomain } });
  }

  public create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant> {
    return prisma.tenant.create({ data });
  }

  public async findAllForUser(userId: string): Promise<Tenant[]> {
    const links = await prisma.userOnTenant.findMany({
      where: { userId },
      include: { tenant: true },
    });

    return links.map(link => link.tenant);
  }

  public update(id: number, data: Prisma.TenantUncheckedUpdateInput): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }
}
