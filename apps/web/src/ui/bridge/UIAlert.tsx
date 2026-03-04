"use client";

import DsfrAlert from "@codegouvfr/react-dsfr/Alert";
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@kokatsuna/ui";

import { useUI } from "@/ui";

export type UIAlertProps = {
  className?: string;
  description?: React.ReactNode;
  severity: "error" | "info" | "success" | "warning";
  title?: React.ReactNode;
};

const SEVERITY_TO_VARIANT = {
  info: "default",
  success: "success",
  warning: "warning",
  error: "destructive",
} as const;

export const UIAlert = ({ severity, title, description, className }: UIAlertProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    if (title) {
      return (
        <DsfrAlert
          severity={severity}
          title={title}
          description={description as NonNullable<React.ReactNode>}
          className={className}
        />
      );
    }
    return (
      <DsfrAlert
        severity={severity}
        small
        description={(description ?? "") as NonNullable<React.ReactNode>}
        className={className}
      />
    );
  }

  return (
    <ShadcnAlert variant={SEVERITY_TO_VARIANT[severity]} className={className}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </ShadcnAlert>
  );
};
