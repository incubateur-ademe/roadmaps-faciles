"use client";

import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import { MarkdownHooks } from "react-markdown";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type Board, type Post, type User } from "@/prisma/client";
import { formatDateHour } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { approvePost, deletePost, rejectPost } from "./actions";

const descriptionModal = createModal({
  id: "moderation-description-modal",
  isOpenedByDefault: false,
});

type ModerationPost = { board: Board; user: null | User } & Post;

interface ModerationPostListProps {
  emptyMessage: string;
  posts: ModerationPost[];
  variant: "pending" | "rejected";
}

export const ModerationPostList = ({ posts, emptyMessage, variant }: ModerationPostListProps) => {
  const t = useTranslations("moderation");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [selectedPost, setSelectedPost] = useState<ModerationPost | null>(null);

  const handleApprove = (postId: number) => {
    startTransition(async () => {
      await approvePost({ postId });
    });
  };

  const handleReject = (postId: number) => {
    startTransition(async () => {
      await rejectPost({ postId });
    });
  };

  const handleDelete = (postId: number) => {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deletePost({ postId });
    });
  };

  const openDescription = (post: ModerationPost) => {
    setSelectedPost(post);
    descriptionModal.open();
  };

  if (posts.length === 0) {
    return <p className={fr.cx("fr-text--lg")}>{emptyMessage}</p>;
  }

  return (
    <>
      <TableCustom
        header={[
          { children: t("postTitle") },
          { children: t("description") },
          { children: t("board") },
          { children: t("author") },
          { children: t("date") },
          { children: t("actions") },
        ]}
        body={posts.map(post => [
          { children: post.title },
          {
            children: post.description ? (
              <Link
                className={cx(
                  fr.cx("fr-text--sm", "fr-icon--xs", "fr-link--icon-left", "fr-icon-search-line", "fr-mb-0"),
                  "line-clamp-2",
                  "!bg-none",
                  "rounded",
                  "outline-offset-8",
                  "outline-(--border-action-high-blue-france)",
                  "hover:outline-1",
                )}
                onClick={e => {
                  e.preventDefault();
                  openDescription(post);
                }}
                href="#"
              >
                <MarkdownHooks {...reactMarkdownConfig}>{post.description}</MarkdownHooks>
              </Link>
            ) : (
              <span className={fr.cx("fr-text--sm", "fr-text--light")}>{t("noDescription")}</span>
            ),
          },
          { children: post.board.name },
          { children: post.user?.name ?? post.sourceLabel ?? t("anonymous") },
          { children: formatDateHour(post.createdAt, locale) },
          {
            children:
              variant === "pending" ? (
                <ButtonsGroup
                  inlineLayoutWhen="always"
                  buttons={[
                    {
                      children: t("approve"),
                      priority: "secondary",
                      size: "small",
                      onClick: () => handleApprove(post.id),
                      disabled: isPending,
                    },
                    {
                      children: t("reject"),
                      priority: "tertiary",
                      size: "small",
                      onClick: () => handleReject(post.id),
                      disabled: isPending,
                    },
                    {
                      children: t("delete"),
                      priority: "tertiary",
                      size: "small",
                      iconId: "fr-icon-delete-line",
                      onClick: () => handleDelete(post.id),
                      disabled: isPending,
                    },
                  ]}
                />
              ) : (
                <ButtonsGroup
                  inlineLayoutWhen="always"
                  buttons={[
                    {
                      children: t("delete"),
                      priority: "tertiary",
                      size: "small",
                      iconId: "fr-icon-delete-line",
                      onClick: () => handleDelete(post.id),
                      disabled: isPending,
                    },
                  ]}
                />
              ),
          },
        ])}
      />

      <descriptionModal.Component title={selectedPost?.title}>
        {selectedPost?.description && (
          <MarkdownHooks {...reactMarkdownConfig}>{selectedPost.description}</MarkdownHooks>
        )}
      </descriptionModal.Component>
    </>
  );
};
