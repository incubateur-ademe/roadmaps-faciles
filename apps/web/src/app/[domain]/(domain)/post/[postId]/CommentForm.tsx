"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";

import { MarkdownEditor, type MarkdownEditorProps } from "@/dsfr/base/client/MarkdownEditor";

import { sendComment } from "./_timeline/actions";

interface CommentFormProps {
  postId: number;
  tenantId: number;
  uploadImageAction: MarkdownEditorProps["uploadImageAction"];
  userId?: string;
}

export const CommentForm = ({ postId, tenantId, userId, uploadImageAction }: CommentFormProps) => {
  const t = useTranslations("post");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const bodyRef = useRef("");
  const [editorKey, setEditorKey] = useState(0);

  const handleChange = useCallback((value: string) => {
    bodyRef.current = value;
  }, []);

  const handleSubmit = () => {
    const body = bodyRef.current.trim();
    if (!body || !userId) return;

    setError(null);
    startTransition(async () => {
      const result = await sendComment({ postId, body, tenantId });
      if (result.ok) {
        bodyRef.current = "";
        setEditorKey(k => k + 1);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  if (!userId) {
    return (
      <div className={fr.cx("fr-mt-2w")}>
        <Alert
          small
          severity="info"
          description={
            <>
              {t.rich("loginToComment", {
                link: chunks => <Link href="/login">{chunks}</Link>,
              })}
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className={fr.cx("fr-mt-2w")}>
      <MarkdownEditor
        key={editorKey}
        label={t("addComment")}
        onChangeAction={handleChange}
        uploadImageAction={uploadImageAction}
        disabled={isPending}
      />
      {error && <Alert small severity="error" description={error} className={fr.cx("fr-mt-1w")} />}
      <div className={cx(fr.cx("fr-mt-1w"), "flex justify-end")}>
        <Button type="button" size="small" iconId="fr-icon-send-plane-fill" disabled={isPending} onClick={handleSubmit}>
          {t("submitComment")}
        </Button>
      </div>
    </div>
  );
};
