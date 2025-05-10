import { z } from "zod";

import { type Post as PostModel } from "@/lib/model/Post";
import { type IPostRepo } from "@/lib/repo/IPostRepo";
import { notImplemented } from "@/utils/error";

import { type UseCase } from "../types";

export const UpdatePostContentInput = z.object({
  postId: z.number(),
  title: z.string().min(3),
  description: z.string().optional(),
});

export type UpdatePostContentInput = z.infer<typeof UpdatePostContentInput>;
export type UpdatePostContentOutput = PostModel;

export class UpdatePostContent implements UseCase<UpdatePostContentInput, UpdatePostContentOutput> {
  constructor(private readonly postRepo: IPostRepo) {}

  public execute(input: UpdatePostContentInput): Promise<UpdatePostContentOutput> {
    return notImplemented();
    // const post = await this.postRepo.update(input.postId, {
    //   title: input.title,
    //   description: input.description ?? null,
    // });

    // return Post.parse({
    //   ...post,
    //   likesCount: post.likesCount,
    //   commentsCount: post.commentsCount,
    //   hotness: 0, // à recalculer si tu veux
    //   liked: false,
    // });
  }
}
