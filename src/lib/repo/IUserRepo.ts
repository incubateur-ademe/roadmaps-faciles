import { type Prisma, type User } from "@/prisma/client";

export type UserWithTenantCount = { _count: { memberships: number } } & User;

export interface IUserRepo {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  findAll(): Promise<User[]>;
  findAllWithTenantCount(): Promise<UserWithTenantCount[]>;
  findByEmail(email: string): Promise<null | User>;
  findById(id: string): Promise<null | User>;
  findByUsername(username: string): Promise<null | User>;
  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>;
}
