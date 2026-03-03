"use client";

import Button, { type ButtonProps } from "@codegouvfr/react-dsfr/Button";
import * as Sentry from "@sentry/nextjs";
import { type PropsWithChildren, startTransition, useState } from "react";

import { likePost } from "./actions";

interface LikeButtonProps {
  alreadyLiked: boolean;
  postId: number;
  size?: ButtonProps["size"];
  tenantId: number;
  userId?: string;
}

export const LikeButton = ({
  userId,
  postId,
  tenantId,
  alreadyLiked,
  children,
  size = "large",
}: PropsWithChildren<LikeButtonProps>) => {
  const [liked, setLiked] = useState(alreadyLiked);

  const handleLikeToggle = () => {
    // Optimistically update the state
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

        // Rollback the optimistic update if the request fails
        startTransition(() => {
          setLiked(prevLiked => !prevLiked);
        });
      });
  };

  return (
    <Button
      data-testid="like-button"
      title="Vote"
      iconId={liked ? "fr-icon-thumb-up-fill" : "fr-icon-thumb-up-line"}
      priority={liked ? "secondary" : "tertiary no outline"}
      size={size}
      onClick={handleLikeToggle}
    >
      {children}
    </Button>
  );

  //   return <button onClick={handleLikeToggle}>{liked ? "Unlike" : "Like"}</button>;
};
