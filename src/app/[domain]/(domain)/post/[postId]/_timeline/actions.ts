"use server";

import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { type Comment, type User } from "@/prisma/client";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { type ServerActionResponse } from "@/utils/next";

export async function getReplies(commentId: number): Promise<ServerActionResponse<Array<{ user: User } & Comment>>> {
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
    logger.error({ err: error }, "Error fetching replies");
    return {
      ok: false,
      error: "Failed to fetch replies",
    };
  }
}

export interface SendCommentParams {
  body: string;
  parentId?: null | number;
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
  const reqCtx = await getRequestContext();

  if (isNaN(postId) || !body) {
    return {
      ok: false,
      error: "Invalid input data",
    };
  }

  const settings = await prisma.tenantSettings.findUnique({
    where: { tenantId },
    select: { allowComments: true },
  });

  if (!settings?.allowComments) {
    const t = await getTranslations("serverErrors");
    return { ok: false, error: t("commentsDisabled") };
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

    audit(
      {
        action: AuditAction.COMMENT_CREATE,
        userId,
        tenantId,
        targetType: "Comment",
        targetId: String(newComment.id),
        metadata: { postId, parentId },
      },
      reqCtx,
    );
    return {
      ok: true,
      data: newComment,
    };
  } catch (error) {
    logger.error({ err: error }, "Error creating comment");
    audit(
      {
        action: AuditAction.COMMENT_CREATE,
        success: false,
        error: (error as Error).message,
        userId,
        tenantId,
        metadata: { postId },
      },
      reqCtx,
    );
    return {
      ok: false,
      error: "Failed to create comment",
    };
  }
}
