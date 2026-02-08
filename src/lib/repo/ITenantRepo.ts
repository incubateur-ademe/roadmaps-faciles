import { type Prisma, type Tenant, type TenantSettings } from "@/prisma/client";

export interface ITenantRepo {
  create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant>;
  findAll(): Promise<Tenant[]>;
  findAllForUser(userId: string): Promise<Tenant[]>;
  findByCustomDomain(customDomain: string): Promise<null | Tenant>;
  findById(id: number): Promise<null | Tenant>;
  findByIdWithSettings(id: number): Promise<({ settings: null | TenantSettings } & Tenant) | null>;
  findBySubdomain(subdomain: string): Promise<null | Tenant>;
  update<WithSetting extends boolean = false>(
    id: number,
    data: Prisma.TenantUncheckedUpdateInput,
    withSetting?: WithSetting,
  ): Promise<WithSetting extends true ? { settings: null | TenantSettings } & Tenant : Tenant>;
}
