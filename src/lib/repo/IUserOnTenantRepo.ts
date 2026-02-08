import { type Prisma, type Tenant, type User, type UserOnTenant } from "@/prisma/client";

export interface UserOnTenantWithTenant extends UserOnTenant {
  tenant: Tenant;
}
export interface UserOnTenantWithUser extends UserOnTenant {
  user: User;
}

export interface IUserOnTenantRepo {
  create(data: Prisma.UserOnTenantUncheckedCreateInput): Promise<UserOnTenant>;
  delete(userId: string, tenantId: number): Promise<void>;
  findByTenantId(tenantId: number): Promise<UserOnTenantWithUser[]>;
  findByUserId(userId: string): Promise<UserOnTenantWithTenant[]>;
  findMembership(userId: string, tenantId: number): Promise<null | UserOnTenant>;
  update(userId: string, tenantId: number, data: Prisma.UserOnTenantUncheckedUpdateInput): Promise<UserOnTenant>;
}
