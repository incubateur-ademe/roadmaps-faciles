"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { likeRepo } from "@/lib/repo";
import { LikePost, LikePostInput, type LikePostOutput } from "@/useCases/likes/LikePost";
import { UnlikePost, type UnlikePostOutput } from "@/useCases/likes/UnlikePost";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { type ServerActionResponse } from "@/utils/next";

type LikePostResponse = ServerActionResponse<LikePostOutput | UnlikePostOutput>;

export async function likePost(input: Partial<LikePostInput>, unlike?: boolean): Promise<LikePostResponse> {
  const inputValidated = LikePostInput.omit({
    anonymousId: true,
  }).safeParse(input);

  if (!inputValidated.success) {
    return {
      ok: false,
      error: z.prettifyError(inputValidated.error),
    };
  }

  try {
    let ret: LikePostOutput | UnlikePostOutput;
    const input: LikePostInput = {
      postId: inputValidated.data.postId,
      tenantId: inputValidated.data.tenantId,
      ...(inputValidated.data.userId
        ? { userId: inputValidated.data.userId }
        : {
            anonymousId: await getAnonymousId(),
          }),
    };
    if (unlike) {
      const useCase = new UnlikePost(likeRepo);
      ret = await useCase.execute(input);
    } else {
      const useCase = new LikePost(likeRepo);
      ret = await useCase.execute(input);
    }

    revalidatePath(`/tenant/${input.tenantId}`);
    if (ret) {
      return {
        ok: true,
        data: ret,
      };
    }
    return {
      ok: true,
    };
  } catch (error) {
    console.error("Error liking post", error);
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
}
