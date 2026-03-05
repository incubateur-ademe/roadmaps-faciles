"use client";

import { Button } from "@kokatsuna/ui";
import * as Sentry from "@sentry/nextjs";
import { ThumbsUp } from "lucide-react";
import { type PropsWithChildren, startTransition, useState } from "react";

import { likePost } from "./actions";

interface LikeButtonProps {
  alreadyLiked: boolean;
  postId: number;
  size?: "default" | "icon" | "lg" | "sm";
  tenantId: number;
  userId?: string;
}

export const LikeButton = ({
  userId,
  postId,
  tenantId,
  alreadyLiked,
  children,
  size = "default",
}: PropsWithChildren<LikeButtonProps>) => {
  const [liked, setLiked] = useState(alreadyLiked);

  const handleLikeToggle = () => {
    startTransition(() => {
      setLiked(prevLiked => !prevLiked);
    });

    likePost(
      {
        postId,
        tenantId,
        userId,
      },
      liked,
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.error);
        }
      })
      .catch(error => {
        Sentry.captureException(error);

        startTransition(() => {
          setLiked(prevLiked => !prevLiked);
        });
      });
  };

  return (
    <Button
      data-testid="like-button"
      title="Vote"
      variant={liked ? "secondary" : "ghost"}
      size={size}
      onClick={handleLikeToggle}
    >
      <ThumbsUp className={liked ? "size-4 fill-current" : "size-4"} />
      {children}
    </Button>
  );
};
