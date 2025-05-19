"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";

import { BoardPost, type BoardPostType } from "@/components/Board/Post";
import { Loader } from "@/components/utils/Loader";

import { fetchPostsForBoard } from "./actions";
import { type Order } from "./types";

export interface PostListProps {
  anonymousId: string;
  boardId: number;
  initialPosts: BoardPostType[];
  order: Order;
  totalCount: number;
  userId?: string;
}

export const PostList = ({ initialPosts, totalCount, userId, anonymousId, order, boardId }: PostListProps) => {
  const [posts, setPosts] = useState<BoardPostType[]>([]);
  console.log("PostList", initialPosts[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);

  const handleLoadMore = () => {
    setIsLoading(true);
    void fetchPostsForBoard(page, order, boardId).then(newPosts => {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setIsLoading(false);
      setPage(prevPage => prevPage + 1);
    });
  };

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <>
      {posts.map(post => {
        const alreadyLiked = post.likes.some(like => userId === like.userId || like.anonymousId === anonymousId);
        return <BoardPost key={`post_${post.id}`} post={post} alreadyLiked={alreadyLiked} userId={userId} />;
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
