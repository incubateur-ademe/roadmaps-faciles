import { type Prisma, type User } from "@/prisma/client";

export interface IUserRepo {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>;
}
