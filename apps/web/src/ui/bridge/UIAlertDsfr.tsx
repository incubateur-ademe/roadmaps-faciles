"use client";

import DsfrAlert from "@codegouvfr/react-dsfr/Alert";

import { type UIAlertProps } from "./UIAlert";

export const UIAlertDsfr = ({ severity, title, description, className, closable, onClose }: UIAlertProps) => {
  if (title) {
    return (
      <DsfrAlert
        severity={severity}
        title={title}
        description={description as NonNullable<React.ReactNode>}
        className={className}
        closable={closable}
        onClose={onClose}
      />
    );
  }
  return (
    <DsfrAlert
      severity={severity}
      small
      description={(description ?? "") as NonNullable<React.ReactNode>}
      className={className}
      closable={closable}
      onClose={onClose}
    />
  );
};
