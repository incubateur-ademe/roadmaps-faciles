"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BoardPost } from "@/components/Board/Post";
import { Loader } from "@/components/utils/Loader";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import { type Order } from "./types";

const MARKER = "-------";

export interface PostListProps {
  allowAnonymousVoting?: boolean;
  allowVoting?: boolean;
  anonymousId: string;
  boardId: number;
  boardSlug: string;
  initialPosts: EnrichedPost[];
  order: Order;
  search?: string;
  totalCount: number;
  userId?: string;
}

export const PostList = ({
  allowAnonymousVoting,
  allowVoting,
  initialPosts,
  totalCount,
  userId,
  anonymousId,
  order,
  boardId,
  search,
  boardSlug,
}: PostListProps) => {
  const [posts, setPosts] = useState<EnrichedPost[]>([]);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  const dirtyDomainFixer = dirtySafePathname(pathname);

  const handleLoadMore = () => {
    startTransition(async () => {
      const { posts: newPosts } = await fetchPostsForBoard(page, order, boardId, search);
      setPosts(prevPosts => [...prevPosts, ...(newPosts as EnrichedPost[])]);
      setPage(prevPage => prevPage + 1);
    });
  };

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <>
      {posts.map((post, index) => {
        const alreadyLiked = post.likes.some(like => userId === like.userId || like.anonymousId === anonymousId);
        const title = search
          ? post.title
              .replace(new RegExp(search, "gi"), match => `${MARKER}${match}${MARKER}`)
              .split(MARKER)
              .filter(Boolean)
              .filter(item => item !== MARKER)
              .map((item, index) => {
                const isMatch = item.toLocaleLowerCase() === search?.toLocaleLowerCase();
                return isMatch ? <mark key={index}>{item}</mark> : item;
              })
          : post.title;
        const description = search
          ? post.description?.replace(new RegExp(search, "gi"), match => `\n::search-mark[${match}]{}\n`)
          : post.description;
        return (
          <BoardPost
            key={`post_${post.id}`}
            first={index === 0}
            post={{
              ...post,
              title: title as string,
              description: description || null,
            }}
            alreadyLiked={alreadyLiked}
            allowAnonymousVoting={allowAnonymousVoting}
            allowVoting={allowVoting}
            userId={userId}
            boardSlug={boardSlug}
            dirtyDomainFixer={dirtyDomainFixer}
          />
        );
      })}
      <div className={fr.cx("fr-hr-or")}>
        {isPending ? (
          <Loader loading />
        ) : (
          <Button
            priority="tertiary no outline"
            type="button"
            onClick={handleLoadMore}
            disabled={totalCount === posts.length}
          >
            Plus
          </Button>
        )}
      </div>
    </>
  );
};
