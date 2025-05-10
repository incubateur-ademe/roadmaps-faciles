import { type Prisma, type Tenant, type User, type UserOnTenant } from "@/prisma/client";

export interface UserOnTenantWithTenant extends UserOnTenant {
  tenant: Tenant;
}
export interface UserOnTenantWithUser extends UserOnTenant {
  user: User;
}

export interface IUserOnTenantRepo {
  create(data: Prisma.UserOnTenantUncheckedCreateInput): Promise<UserOnTenant>;
  findByTenantId(tenantId: number): Promise<UserOnTenantWithUser[]>;
  findByUserId(userId: string): Promise<UserOnTenantWithTenant[]>;
  findMembership(userId: string, tenantId: number): Promise<UserOnTenant | null>;
}
