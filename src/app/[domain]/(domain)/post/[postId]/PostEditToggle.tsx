"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useState, useTransition } from "react";

import { deletePost } from "./actions";
import { PostEditForm } from "./PostEditForm";

interface PostEditToggleProps {
  boardSlug: string;
  canDelete: boolean;
  canEdit: boolean;
  description: null | string;
  isModal?: boolean;
  postId: number;
  title: string;
}

export const PostEditToggle = ({
  canEdit,
  canDelete,
  boardSlug,
  isModal,
  postId,
  title,
  description,
  children,
}: PropsWithChildren<PostEditToggleProps>) => {
  const [editing, setEditing] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("post");
  const tc = useTranslations("common");

  const handleDelete = () => {
    if (!confirm(t("deleteConfirm"))) return;
    startDeleteTransition(async () => {
      const result = await deletePost({ postId });
      if (result.ok) {
        if (isModal) {
          router.back();
        } else {
          router.push(boardSlug ? `/board/${boardSlug}` : "/");
        }
      } else {
        alert(result.error);
      }
    });
  };

  if (editing) {
    return (
      <PostEditForm
        postId={postId}
        title={title}
        description={description}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false);
          router.refresh();
        }}
      />
    );
  }

  return (
    <>
      {children}
      <span className="flex gap-2">
        {canEdit && (
          <Button priority="tertiary" iconId="fr-icon-edit-line" size="small" onClick={() => setEditing(true)}>
            {tc("edit")}
          </Button>
        )}
        {canDelete && (
          <Button
            priority="tertiary"
            iconId="fr-icon-delete-line"
            size="small"
            disabled={deleting}
            onClick={handleDelete}
          >
            {t("deletePost")}
          </Button>
        )}
      </span>
    </>
  );
};
