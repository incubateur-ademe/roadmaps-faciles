import { z } from "zod";

import { type IPostRepo } from "@/lib/repo/IPostRepo";

import { type UseCase } from "../types";

export const DeletePostInput = z.object({
  postId: z.number(),
});

export type DeletePostInput = z.infer<typeof DeletePostInput>;
export type DeletePostOutput = void;

export class DeletePost implements UseCase<DeletePostInput, DeletePostOutput> {
  constructor(private readonly postRepo: IPostRepo) {}

  public async execute(input: DeletePostInput): Promise<DeletePostOutput> {
    await this.postRepo.delete(input.postId);
  }
}
