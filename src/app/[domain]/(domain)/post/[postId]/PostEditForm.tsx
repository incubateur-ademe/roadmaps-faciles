"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { updatePost } from "./actions";

const editSchema = z.object({
  postId: z.number(),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditFormType>({
    resolver: standardSchemaResolver(editSchema),
    defaultValues: {
      postId,
      title,
      description: description ?? "",
    },
  });

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
        label="Titre"
        nativeInputProps={register("title")}
        state={errors.title ? "error" : "default"}
        stateRelatedMessage={errors.title?.message}
      />
      <Input
        textArea
        label="Description"
        nativeTextAreaProps={register("description")}
        classes={{ nativeInputOrTextArea: "resize-y" }}
      />
      {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur" description={error} />}
      <span className="flex gap-[1rem]">
        <Button type="submit" disabled={pending || !isDirty}>
          Enregistrer
        </Button>
        <Button type="button" priority="secondary" onClick={onCancel} disabled={pending}>
          Annuler
        </Button>
      </span>
    </form>
  );
};
