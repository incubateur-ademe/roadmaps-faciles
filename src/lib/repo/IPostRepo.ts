import { type Post, type Prisma } from "@/prisma/client";

export interface IPostRepo {
  create(data: Prisma.PostUncheckedCreateInput): Promise<Post>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  update(id: number, data: Prisma.PostUncheckedUpdateInput): Promise<Post>;
}
