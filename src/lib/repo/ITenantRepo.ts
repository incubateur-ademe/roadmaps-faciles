import { type Prisma, type Tenant, type TenantSetting } from "@/prisma/client";

export interface ITenantRepo {
  create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant>;
  findAll(): Promise<Tenant[]>;
  findAllForUser(userId: string): Promise<Tenant[]>;
  findByCustomDomain(customDomain: string): Promise<Tenant | null>;
  findById(id: number): Promise<Tenant | null>;
  findByIdWithSettings(id: number): Promise<(Tenant & { settings: TenantSetting | null }) | null>;
  findBySubdomain(subdomain: string): Promise<Tenant | null>;
  update(id: number, data: Prisma.TenantUncheckedUpdateInput): Promise<Tenant>;
}
