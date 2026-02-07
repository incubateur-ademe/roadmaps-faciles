"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useState } from "react";

import { PostEditForm } from "./PostEditForm";

interface PostEditToggleProps {
  canEdit: boolean;
  description: null | string;
  postId: number;
  title: string;
}

export const PostEditToggle = ({
  canEdit,
  postId,
  title,
  description,
  children,
}: PropsWithChildren<PostEditToggleProps>) => {
  const [editing, setEditing] = useState(false);
  const router = useRouter();

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
      {canEdit && (
        <Button priority="tertiary" iconId="fr-icon-edit-line" size="small" onClick={() => setEditing(true)}>
          Modifier
        </Button>
      )}
    </>
  );
};
