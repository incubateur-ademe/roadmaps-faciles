"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { LikeButton } from "@/components/Board/LikeButton";
import { Loader } from "@/components/utils/Loader";
import { Icon } from "@/dsfr";
import { formatRelativeDate } from "@/utils/date";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import style from "./Board.module.scss";
import { type Order } from "./types";

const MARKER = "-------";

export interface PostListCompactProps {
  allowAnonymousVoting?: boolean;
  allowVoting?: boolean;
  anonymousId: string;
  boardId: number;
  initialPosts: EnrichedPost[];
  order: Order;
  search?: string;
  totalCount: number;
  userId?: string;
}

export const PostListCompact = ({
  allowAnonymousVoting,
  allowVoting,
  initialPosts,
  totalCount,
  userId,
  anonymousId,
  order,
  boardId,
  search,
}: PostListCompactProps) => {
  const [posts, setPosts] = useState<EnrichedPost[]>([]);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  const dirtyDomainFixer = dirtySafePathname(pathname);
  const t = useTranslations();
  const locale = useLocale();

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const { posts: newPosts } = await fetchPostsForBoard(nextPage, order, boardId, search);
      setPosts(prevPosts => [...prevPosts, ...(newPosts as EnrichedPost[])]);
      setPage(nextPage);
    });
  };

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const highlightTitle = (title: string) => {
    if (!search) return title;
    return title
      .replace(new RegExp(search, "gi"), match => `${MARKER}${match}${MARKER}`)
      .split(MARKER)
      .filter(Boolean)
      .filter(item => item !== MARKER)
      .map((item, index) => {
        const isMatch = item.toLocaleLowerCase() === search.toLocaleLowerCase();
        return isMatch ? <mark key={index}>{item}</mark> : item;
      });
  };

  return (
    <>
      <ul className={style.compactList}>
        {posts.map(post => {
          const alreadyLiked = post.likes.some(like => userId === like.userId || like.anonymousId === anonymousId);

          return (
            <li key={`post_compact_${post.id}`} className={style.compactItem}>
              <div className="flex items-center gap-[.75rem] min-w-0">
                {allowVoting && (allowAnonymousVoting || userId) && (
                  <div className="shrink-0">
                    <LikeButton
                      alreadyLiked={alreadyLiked}
                      postId={post.id}
                      tenantId={post.tenantId}
                      userId={userId}
                      size="small"
                    >
                      {post._count.likes}
                    </LikeButton>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-[.5rem] flex-wrap">
                    {post.postStatus ? (
                      <Badge as="span" small className={`fr-badge--color-${post.postStatus.color}`}>
                        {post.postStatus.name}
                      </Badge>
                    ) : (
                      <Badge as="span" small className="fr-badge--color-grey">
                        {t("post.unclassified")}
                      </Badge>
                    )}
                    <Link href={dirtyDomainFixer(`/post/${post.id}`)} className={cx(fr.cx("fr-link"), "truncate")}>
                      {highlightTitle(post.title)}
                    </Link>
                  </div>
                  <div
                    className={cx(
                      fr.cx("fr-text--xs", "fr-mt-1v"),
                      "flex items-center gap-[.5rem] flex-wrap text-[var(--text-mention-grey)]",
                    )}
                  >
                    <span>{post.user?.name ?? t("board.anonymous")}</span>
                    <span>·</span>
                    <span>{formatRelativeDate(new Date(post.createdAt), locale)}</span>
                    {post.editedAt && (
                      <>
                        <span>·</span>
                        <span>{t("board.edited")}</span>
                      </>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span>·</span>
                        {post.tags.map(tag => (
                          <Tag as="span" key={tag} small iconId="fr-icon-bookmark-line">
                            {tag}
                          </Tag>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-[.75rem] text-[var(--text-mention-grey)]">
                  {post._count.comments > 0 && (
                    <span className={cx(fr.cx("fr-text--sm"), "flex items-center gap-[.25rem]")}>
                      <Icon icon="fr-icon-discuss-line" size="sm" />
                      {post._count.comments}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
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
            {t("common.more")}
          </Button>
        )}
      </div>
    </>
  );
};
