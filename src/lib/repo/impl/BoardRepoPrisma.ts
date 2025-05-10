import { prisma } from "@/lib/db/prisma";
import { type Board, type Prisma } from "@/prisma/client";

import { type IBoardRepo } from "../IBoardRepo";

export class BoardRepoPrisma implements IBoardRepo {
  public findAll(): Promise<Board[]> {
    return prisma.board.findMany();
  }

  public findById(id: number): Promise<Board | null> {
    return prisma.board.findUnique({ where: { id } });
  }

  public create(data: Prisma.BoardUncheckedCreateInput): Promise<Board> {
    return prisma.board.create({ data });
  }

  public async findSlugById(id: number): Promise<string | null> {
    return prisma.board.findUnique({ where: { id }, select: { slug: true } }).then(board => board?.slug ?? null);
  }
}
