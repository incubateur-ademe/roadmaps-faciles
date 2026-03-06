"use client";

import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@kokatsuna/ui";
import { Button } from "@kokatsuna/ui/components/button";
import { X } from "lucide-react";
import { lazy, Suspense } from "react";

import { useUI } from "@/ui";

const UIAlertDsfr = lazy(() => import("./UIAlertDsfr").then(m => ({ default: m.UIAlertDsfr })));

export type UIAlertProps = {
  className?: string;
  closable?: boolean;
  description?: React.ReactNode;
  onClose?: () => void;
  severity: "error" | "info" | "success" | "warning";
  title?: React.ReactNode;
};

const SEVERITY_TO_VARIANT = {
  info: "default",
  success: "success",
  warning: "warning",
  error: "destructive",
} as const;

export const UIAlert = ({ severity, title, description, className, closable, onClose }: UIAlertProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <Suspense>
        <UIAlertDsfr
          severity={severity}
          title={title}
          description={description}
          className={className}
          closable={closable}
          onClose={onClose}
        />
      </Suspense>
    );
  }

  return (
    <ShadcnAlert variant={SEVERITY_TO_VARIANT[severity]} className={className}>
      <div className="flex items-start justify-between gap-2">
        <div>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
        {closable && onClose && (
          <Button variant="ghost" size="icon" className="size-6 shrink-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        )}
      </div>
    </ShadcnAlert>
  );
};
