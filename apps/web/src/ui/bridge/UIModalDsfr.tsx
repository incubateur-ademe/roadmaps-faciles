"use client";

import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useEffect, useRef, useState } from "react";

import type { UIModalProps } from "./UIModal";

let counter = 0;

export const UIModalDsfr = ({ open, onClose, title, children, footer }: UIModalProps) => {
  const [id] = useState(() => `ui-modal-bridge-${++counter}`);
  const modalRef = useRef<ReturnType<typeof createModal> | null>(null);

  if (!modalRef.current) {
    modalRef.current = createModal({ id, isOpenedByDefault: false });
  }

  const modal = modalRef.current;

  // Sync open prop → DSFR modal (disclose / conceal)
  useEffect(() => {
    if (open) {
      modal.open();
    } else {
      modal.close();
    }
  }, [open, modal]);

  // Sync DSFR close (user clicks X / backdrop / Escape) → onClose callback
  useEffect(() => {
    if (!onClose) return;
    const el = document.getElementById(id);
    if (!el) return;

    const handler = () => onClose();
    el.addEventListener("dsfr.conceal", handler);
    return () => el.removeEventListener("dsfr.conceal", handler);
  }, [id, onClose]);

  return (
    <modal.Component title={title}>
      {children}
      {footer}
    </modal.Component>
  );
};
