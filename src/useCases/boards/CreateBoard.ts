import { z } from "zod";

import { type IBoardRepo } from "@/lib/repo/IBoardRepo";
import { type Board } from "@/prisma/client";

import { type UseCase } from "../types";

export const CreateBoardInput = z.object({
  tenantId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateBoardInput = z.infer<typeof CreateBoardInput>;
export type CreateBoardOutput = Board;

export class CreateBoard implements UseCase<CreateBoardInput, CreateBoardOutput> {
  constructor(private readonly boardRepo: IBoardRepo) {}

  public async execute(input: CreateBoardInput): Promise<CreateBoardOutput> {
    const boards = await this.boardRepo.findAllForTenant(input.tenantId);
    const maxOrder = boards.reduce((max, b) => Math.max(max, b.order), -1);

    return this.boardRepo.create({
      tenantId: input.tenantId,
      name: input.name,
      description: input.description ?? null,
      order: maxOrder + 1,
    });
  }
}
