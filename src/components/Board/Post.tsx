import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import { MarkdownHooks } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";

import { type EnrichedPost } from "@/app/[domain]/board/[boardSlug]/actions";

import { LikeButton } from "./LikeButton";
import style from "./Post.module.scss";

export interface BoardPostProps {
  alreadyLiked: boolean;
  post: EnrichedPost;
  userId?: string;
}

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
              <MarkdownHooks
                remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
                unwrapDisallowed
                disallowedElements={["p"]}
                allowElement={elt => elt.tagName !== "p"}
                components={{
                  ["search-mark" as "div"]: ({ children }) => {
                    return <mark>{children}</mark>;
                  },
                }}
              >
                {post.description}
              </MarkdownHooks>
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
