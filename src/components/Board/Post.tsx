import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { MarkdownHooks } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";

import { type EnrichedPost } from "@/app/[domain]/(domain)/board/[boardSlug]/actions";

import { LikeButton } from "./LikeButton";

export interface BoardPostProps {
  allowAnonymousVoting?: boolean;
  allowVoting?: boolean;
  alreadyLiked: boolean;
  boardSlug: string;
  dirtyDomainFixer: (pathname: string) => string;
  first?: boolean;
  post: EnrichedPost;
  userId?: string;
}

export const BoardPost = ({
  post,
  alreadyLiked,
  allowAnonymousVoting = true,
  allowVoting = true,
  userId,
  first,
  dirtyDomainFixer,
}: BoardPostProps) => {
  const { isDark } = useIsDark();
  return (
    <Card
      key={`post_${post.id}`}
      className={cx(!first && "snap-start scroll-mt-38")}
      title={post.title}
      linkProps={{
        href: dirtyDomainFixer(`/post/${post.id}`),
      }}
      titleAs="h3"
      endDetail={
        <span className="flex justify-between items-center w-full">
          <span>
            {post.user?.name ?? "Anonyme"}
            {post.editedAt && <span className="fr-text--xs fr-text--light ml-1">(modifié)</span>}
          </span>
          {post._count.comments > 0 && (
            <Tag
              className="cursor-pointer"
              as="span"
              iconId="fr-icon-discuss-line"
              small
              nativeSpanProps={{
                onClick: () => {
                  location.href = dirtyDomainFixer(`/post/${post.id}`);
                },
              }}
            >
              <b>{post._count.comments}</b>&nbsp;commentaire{post._count.comments > 1 ? "s" : ""}
            </Tag>
          )}
        </span>
      }
      detail={
        <span className="flex gap-[.5rem] items-center">
          {post.postStatus ? (
            <Badge as="span" className={`fr-badge--color-${post.postStatus.color}`}>
              {post.postStatus.name}
            </Badge>
          ) : (
            <Badge as="span" className={"fr-badge--color-grey"}>
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
          {allowVoting && (allowAnonymousVoting || userId) && (
            <LikeButton alreadyLiked={alreadyLiked} postId={post.id} tenantId={post.tenantId} userId={userId}>
              {post._count.likes}
            </LikeButton>
          )}
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
      size="small"
      shadow={isDark}
    />
  );
};
