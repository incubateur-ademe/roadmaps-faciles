import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
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
      endDetail={
        <span className="flex justify-between items-center w-full">
          <span className="">{post.user.name}</span>
          {post._count.comments > 0 && (
            <Tag as="span" iconId="fr-icon-discuss-line" small>
              <b>{post._count.comments}</b>&nbsp;commentaire{post._count.comments > 1 ? "s" : ""}
            </Tag>
          )}
        </span>
      }
      detail={
        <span className="flex gap-[.5rem] items-center">
          {post.postStatus ? (
            <Badge as="span" className={style[`fr-badge--color-${post.postStatus.color}`]}>
              {post.postStatus.name}
            </Badge>
          ) : (
            <Badge as="span" className={style["fr-badge--color-grey"]}>
              Non classé
            </Badge>
          )}
          {post.tags?.map(tag => (
            <Tag as="span" key={tag} small iconId="fr-icon-bookmark-line">
              {tag}
            </Tag>
          ))}
        </span>
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
