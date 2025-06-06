"use server";

import { prisma } from "@/lib/db/prisma";
import { type Comment, type User } from "@/prisma/client";
import { type ServerActionResponse } from "@/utils/next";

export async function getReplies(commentId: number): Promise<ServerActionResponse<Array<Comment & { user: User }>>> {
  if (isNaN(commentId)) {
    return {
      ok: false,
      error: "Invalid comment ID",
    };
  }

  try {
    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      ok: true,
      data: replies,
    };
  } catch (error) {
    console.error("Error fetching replies:", error);
    return {
      ok: false,
      error: "Failed to fetch replies",
    };
  }
}

export interface SendCommentParams {
  body: string;
  parentId?: number | null;
  postId: number;
  tenantId: number;
  userId: string;
}

export async function sendComment({
  postId,
  body,
  userId,
  parentId,
  tenantId,
}: SendCommentParams): Promise<ServerActionResponse<Comment>> {
  if (isNaN(postId) || !body) {
    return {
      ok: false,
      error: "Invalid input data",
    };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
        parentId: parentId ?? null,
        tenantId: tenantId,
      },
      include: {
        user: true,
      },
    });

    return {
      ok: true,
      data: newComment,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      ok: false,
      error: "Failed to create comment",
    };
  }
}
