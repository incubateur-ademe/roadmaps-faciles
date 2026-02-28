"use client";

import DsfrAlert from "@codegouvfr/react-dsfr/Alert";

import { useUI } from "@/ui";

import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "../shadcn/alert";

export type UIAlertProps = {
  className?: string;
  description?: React.ReactNode;
  severity: "error" | "info" | "success" | "warning";
  title?: React.ReactNode;
};

const SEVERITY_TO_VARIANT = {
  info: "default",
  success: "default",
  warning: "default",
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
