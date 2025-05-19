"use server";

import { prisma } from "@/lib/db/prisma";

import { type Order } from "./types";

const LOAD_LIMIT = 50;

export async function fetchPostsForBoard(page: number, order: Order, boardId: number) {
  return order === "trending"
    ? (
        await prisma.postWithHotness.findMany({
          where: {
            boardId,
          },
          orderBy: {
            hotness: "desc",
          },
          take: LOAD_LIMIT,
          skip: (page - 1) * LOAD_LIMIT,
          include: {
            post: {
              include: {
                postStatus: true,
                user: true,
                likes: true,
                _count: {
                  select: {
                    comments: true,
                    follows: true,
                    likes: true,
                  },
                },
              },
            },
          },
        })
      ).map(postWithHotness => postWithHotness.post)
    : await prisma.post.findMany({
        where: {
          boardId,
        },
        take: LOAD_LIMIT,
        skip: (page - 1) * LOAD_LIMIT,
        orderBy: {
          ...(order === "top"
            ? {
                likes: {
                  _count: "desc",
                },
              }
            : { createdAt: "desc" }),
        },
        include: {
          postStatus: true,
          user: true,
          likes: true,
          _count: {
            select: {
              comments: true,
              follows: true,
              likes: true,
            },
          },
        },
      });
}
