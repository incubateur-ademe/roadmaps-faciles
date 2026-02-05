"use server";

import { prisma } from "@/lib/db/prisma";
import { type Like, type Post, type PostStatus, type PostWithHotness, type Prisma, type User } from "@/prisma/client";

import { type Order } from "./types";

const LOAD_LIMIT = 50;

export type EnrichedPost = {
  _count: Prisma.PostCountOutputType;
  likes: Like[];
  postStatus: null | PostStatus;
  user: User;
} & Post;
const cleanFullTextSearch = (text: string) => {
  if (!text) return text;

  const escapeReg = /(&|\(|\))/gi;
  const cleanText = text
    .trim()
    .replace(escapeReg, " ")
    .split(" ")
    .filter(str => str)
    .join(" ")
    .replaceAll(" ", " & ");
  return cleanText.endsWith("*") ? cleanText : `${cleanText}:*`;
};

export async function fetchPostsForBoard<
  O extends Order,
  R extends O extends "trending" ? Array<{ post: Post } & PostWithHotness> : EnrichedPost[],
>(
  page: number,
  order: O,
  boardId: number,
  rawSearch?: string,
): Promise<{
  filteredCount: number;
  posts: R;
}> {
  const search = rawSearch ? cleanFullTextSearch(rawSearch) : undefined;
  const searchWhere = search
    ? {
        OR: [
          {
            title: {
              search: cleanFullTextSearch(search),
            },
          },
          {
            description: {
              search,
            },
          },
        ],
      }
    : {};
  const [count, posts] = await prisma.$transaction([
    prisma.post.count({
      where: {
        boardId,
        ...searchWhere,
      },
    }),
    order === "trending"
      ? prisma.postWithHotness.findMany({
          where: {
            boardId,
            ...(search
              ? {
                  post: searchWhere,
                }
              : {}),
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
      : prisma.post.findMany({
          where: {
            boardId,
            ...searchWhere,
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
        }),
  ]);

  return {
    posts: (order === "trending"
      ? (posts as Array<{ post: Post } & PostWithHotness>).map(post => post.post)
      : (posts as EnrichedPost[])) as R,
    filteredCount: count,
  };
}
