"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { SimpleModal, type SimpleModalProps } from "@/dsfr/layout/SimpleModal";

export const PostSimpleModal = (props: SimpleModalProps) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(
    (e: Event) => {
      if (e.target !== dialogRef.current) return;
      e.preventDefault();
      router.back();
    },
    [router],
  );

  useEffect(() => {
    const ref = dialogRef.current;
    ref?.addEventListener("click", handleClose);

    return () => {
      ref?.removeEventListener("click", handleClose);
    };
  }, [dialogRef, handleClose]);

  return (
    <SimpleModal
      {...props}
      ref={dialogRef}
      closeButtonProps={{
        ...props.closeButtonProps,
        nativeButtonProps: {
          ...props.closeButtonProps?.nativeButtonProps,
          onClick(e) {
            props.closeButtonProps?.nativeButtonProps?.onClick?.(e);
            router.back();
          },
        },
      }}
    />
  );
};
