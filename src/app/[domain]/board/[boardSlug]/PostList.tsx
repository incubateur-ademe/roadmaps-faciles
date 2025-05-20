"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";

import { BoardPost } from "@/components/Board/Post";
import { Loader } from "@/components/utils/Loader";

import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import { type Order } from "./types";

const MARKER = "-------";

export interface PostListProps {
  anonymousId: string;
  boardId: number;
  initialPosts: EnrichedPost[];
  order: Order;
  search?: string;
  totalCount: number;
  userId?: string;
}

export const PostList = ({ initialPosts, totalCount, userId, anonymousId, order, boardId, search }: PostListProps) => {
  const [posts, setPosts] = useState<EnrichedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    setIsLoading(true);
    void fetchPostsForBoard(page, order, boardId, search).then(({ posts: newPosts }) => {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setIsLoading(false);
      setPage(prevPage => ++prevPage);
    });
  };

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <>
      {posts.map(post => {
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
            post={{
              ...post,
              title: title as string,
              description: description || null,
            }}
            alreadyLiked={alreadyLiked}
            userId={userId}
          />
        );
      })}
      <div className={fr.cx("fr-hr-or")}>
        {isLoading ? (
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
