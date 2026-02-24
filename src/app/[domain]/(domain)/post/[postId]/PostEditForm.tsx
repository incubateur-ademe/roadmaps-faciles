"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { MarkdownEditor } from "@/dsfr/base/client/MarkdownEditor";

import { uploadImage } from "../../upload-image";
import { updatePost } from "./actions";

const editSchema = z.object({
  postId: z.number(),
  title: z.string().min(3),
  description: z.string().optional(),
});

type EditFormType = z.infer<typeof editSchema>;

interface PostEditFormProps {
  description: null | string;
  onCancel: () => void;
  onSuccess: () => void;
  postId: number;
  title: string;
}

export const PostEditForm = ({ postId, title, description, onCancel, onSuccess }: PostEditFormProps) => {
  const [error, setError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const t = useTranslations("post");
  const tc = useTranslations("common");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditFormType>({
    resolver: standardSchemaResolver(editSchema),
    defaultValues: {
      postId,
      title,
      description: description ?? "",
    },
  });

  const handleDescriptionChangeAction = useCallback(
    (value: string) => {
      setValue("description", value, { shouldDirty: true });
    },
    [setValue],
  );

  const onSubmit = async (data: EditFormType) => {
    setError(null);
    setPending(true);
    const response = await updatePost(data);
    if (!response.ok) {
      setError(response.error);
    } else {
      onSuccess();
    }
    setPending(false);
  };

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      <Input
        label={t("editTitle")}
        nativeInputProps={register("title")}
        state={errors.title ? "error" : "default"}
        stateRelatedMessage={errors.title?.message}
      />
      <MarkdownEditor
        label={t("editDescription")}
        defaultValue={description ?? ""}
        onChangeAction={handleDescriptionChangeAction}
        uploadImageAction={uploadImage}
      />
      {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title={tc("error")} description={error} />}
      <span className="flex gap-[1rem]">
        <Button type="submit" disabled={pending || !isDirty}>
          {t("savePost")}
        </Button>
        <Button type="button" priority="secondary" onClick={onCancel} disabled={pending}>
          {tc("cancel")}
        </Button>
      </span>
    </form>
  );
};
