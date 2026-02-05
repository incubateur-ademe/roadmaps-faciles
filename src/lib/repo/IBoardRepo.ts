import { type Board, type Prisma } from "@/prisma/client";

export interface IBoardRepo {
  create(data: Prisma.BoardUncheckedCreateInput): Promise<Board>;
  findAll(): Promise<Board[]>;
  findById(id: number): Promise<Board | null>;
  findSlugById(id: number): Promise<null | string>;
}
