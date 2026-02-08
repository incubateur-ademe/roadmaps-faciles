import { z } from "zod";

import { Post, type Post as PostModel } from "@/lib/model/Post";
import { type IPostRepo } from "@/lib/repo/IPostRepo";

import { type UseCase } from "../types";

export const UpdatePostContentInput = z.object({
  postId: z.number(),
  title: z.string().min(3),
  description: z.string().optional(),
  tags: z.string().array().optional(),
});

export type UpdatePostContentInput = z.infer<typeof UpdatePostContentInput>;
export type UpdatePostContentOutput = PostModel;

export class UpdatePostContent implements UseCase<UpdatePostContentInput, UpdatePostContentOutput> {
  constructor(private readonly postRepo: IPostRepo) {}

  public async execute(input: UpdatePostContentInput): Promise<UpdatePostContentOutput> {
    const post = await this.postRepo.update(input.postId, {
      title: input.title,
      description: input.description ?? null,
      ...(input.tags !== undefined && { tags: input.tags }),
    });

    return Post.parse(post);
  }
}
