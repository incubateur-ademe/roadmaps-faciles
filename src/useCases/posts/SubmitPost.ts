import { z } from "zod";

import { Post, type Post as PostModel } from "@/lib/model/Post";
import { type IPostRepo } from "@/lib/repo/IPostRepo";

import { type UseCase } from "../types";

export const SubmitPostInput = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  boardId: z.number(),
  postStatusId: z.number(),
  tenantId: z.number(),
  userId: z.string(),
});

export type SubmitPostInput = z.infer<typeof SubmitPostInput>;
export type SubmitPostOutput = PostModel;

export class SubmitPost implements UseCase<SubmitPostInput, SubmitPostOutput> {
  constructor(private readonly postRepo: IPostRepo) {}

  public async execute(input: SubmitPostInput): Promise<SubmitPostOutput> {
    const post = await this.postRepo.create({
      title: input.title,
      description: input.description ?? null,
      boardId: input.boardId,
      postStatusId: input.postStatusId,
      tenantId: input.tenantId,
      userId: input.userId,
    });

    return Post.parse({
      ...post,
      likesCount: 0,
      commentsCount: 0,
      hotness: 0,
      liked: false,
    });
  }
}
