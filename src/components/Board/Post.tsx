import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import ReactMarkdown from "react-markdown";

import { type Like, type Post, type PostStatus, type Prisma, type User } from "@/prisma/client";

import { LikeButton } from "./LikeButton";
import style from "./Post.module.scss";

export interface BoardPostProps {
  alreadyLiked: boolean;
  post: Post & {
    _count: Prisma.PostCountOutputType;
    likes: Like[];
    postStatus: PostStatus | null;
    user: User;
  };
  userId?: string;
}

export type BoardPostType = BoardPostProps["post"];

export const BoardPost = ({ post, alreadyLiked, userId }: BoardPostProps) => {
  return (
    <Card
      key={`post_${post.id}`}
      classes={
        {
          // title: fr.cx("fr-text--md"),
        }
      }
      title={post.title}
      titleAs="h3"
      endDetail={<span>{post.user.name}</span>}
      detail={
        post.postStatus ? (
          <Badge as="span" className={style[`fr-badge--color-${post.postStatus.color}`]}>
            {post.postStatus.name}
          </Badge>
        ) : (
          <Badge as="span" className={style["fr-badge--color-grey"]}>
            Non classé
          </Badge>
        )
      }
      desc={
        <span className="flex gap-[.5rem] items-center">
          <LikeButton alreadyLiked={alreadyLiked} postId={post.id} tenantId={post.tenantId} userId={userId}>
            {post._count.likes}
          </LikeButton>
          <span className="line-clamp-3">
            {post.description && (
              <ReactMarkdown unwrapDisallowed disallowedElements={["p"]}>
                {post.description}
              </ReactMarkdown>
            )}
          </span>
        </span>
      }
      horizontal
      grey
      size="small"
      shadow
    />
  );
};
