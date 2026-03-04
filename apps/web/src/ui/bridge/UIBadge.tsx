"use client";

import DsfrBadge from "@codegouvfr/react-dsfr/Badge";
import { Badge as ShadcnBadge } from "@kokatsuna/ui";
import { type ComponentProps } from "react";

import { useUI } from "@/ui";

type ShadcnBadgeProps = ComponentProps<typeof ShadcnBadge>;

const VARIANT_TO_SEVERITY = {
  default: "info",
  secondary: "info",
  destructive: "error",
  outline: "info",
  success: "success",
  warning: "warning",
  ghost: "info",
  link: "info",
} as const;

export type UIBadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ShadcnBadgeProps["variant"];
};

export const UIBadge = ({ variant = "default", children, className }: UIBadgeProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <DsfrBadge severity={VARIANT_TO_SEVERITY[variant ?? "default"]} className={className}>
        {children as NonNullable<React.ReactNode>}
      </DsfrBadge>
    );
  }

  return (
    <ShadcnBadge variant={variant} className={className}>
      {children}
    </ShadcnBadge>
  );
};
