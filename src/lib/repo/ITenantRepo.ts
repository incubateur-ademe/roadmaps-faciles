import { type Prisma, type Tenant, type TenantSettings } from "@/prisma/client";

export interface ITenantRepo {
  create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant>;
  findAll(): Promise<Tenant[]>;
  findAllForUser(userId: string): Promise<Tenant[]>;
  findByCustomDomain(customDomain: string): Promise<Tenant | null>;
  findById(id: number): Promise<Tenant | null>;
  findByIdWithSettings(id: number): Promise<(Tenant & { settings: TenantSettings | null }) | null>;
  findBySubdomain(subdomain: string): Promise<Tenant | null>;
  update<WithSetting extends boolean = false>(
    id: number,
    data: Prisma.TenantUncheckedUpdateInput,
    withSetting?: WithSetting,
  ): Promise<WithSetting extends true ? Tenant & { settings: TenantSettings | null } : Tenant>;
}
