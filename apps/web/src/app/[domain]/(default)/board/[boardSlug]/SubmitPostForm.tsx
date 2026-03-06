"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { cn } from "@kokatsuna/ui";
import { useTranslations } from "next-intl";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { MarkdownEditor } from "@/dsfr/base/client/MarkdownEditor";
import { UIAlert, UIButton, UIInput } from "@/ui/bridge";

import { uploadImage } from "../../upload-image";
import { submitPost } from "./actions";

const createFormSchema = (t: ReturnType<typeof useTranslations<"board">>) =>
  z.object({
    title: z.string().min(3, t("titleMinLength")),
    description: z.string().optional(),
  });

type FormType = z.infer<ReturnType<typeof createFormSchema>>;

interface SubmitPostFormProps {
  boardId: number;
}

export const SubmitPostForm = ({ boardId }: SubmitPostFormProps) => {
  const t = useTranslations("board");
  const tc = useTranslations("common");
  const te = useTranslations("errors");

  const formSchema = createFormSchema(t);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [editorKey, setEditorKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleDescriptionChangeAction = useCallback(
    (value: string) => {
      setValue("description", value, { shouldDirty: true });
    },
    [setValue],
  );

  const onSubmit = (data: FormType) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);

      const result = await submitPost({
        title: data.title,
        description: data.description,
        boardId,
      });

      if (!result.ok) {
        setError(result.error);
      } else {
        reset();
        setEditorKey(prev => prev + 1);
        setSuccess(result.data.pending ? t("postSubmittedPending") : t("postSubmitted"));
        setTimeout(() => setSuccess(null), 8000);
      }
    });
  };

  return (
    <form noValidate className={cn("flex flex-col gap-4 py-4")} onSubmit={e => void handleSubmit(onSubmit)(e)}>
      <h3 className="text-lg font-semibold m-0">{t("submitSuggestion")}</h3>
      <UIInput
        label={t("title")}
        nativeInputProps={{ ...register("title") }}
        state={errors.title ? "error" : "default"}
        stateRelatedMessage={errors.title?.message}
      />
      <MarkdownEditor
        key={editorKey}
        label={t("description")}
        onChangeAction={handleDescriptionChangeAction}
        uploadImageAction={uploadImage}
      />
      {error && <UIAlert severity="error" title={te("technicalError")} description={error} />}
      {success && <UIAlert severity="success" title={success} />}
      <UIButton className="place-self-end" type="submit" disabled={isPending}>
        {isPending ? tc("loading") : tc("validate")}
      </UIButton>
    </form>
  );
};
