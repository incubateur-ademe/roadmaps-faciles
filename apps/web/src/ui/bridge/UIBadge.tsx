"use client";

import { Badge as ShadcnBadge } from "@kokatsuna/ui";
import { type ComponentProps, lazy, Suspense } from "react";

import { useUI } from "@/ui";

const UIBadgeDsfr = lazy(() => import("./UIBadgeDsfr").then(m => ({ default: m.UIBadgeDsfr })));

type ShadcnBadgeProps = ComponentProps<typeof ShadcnBadge>;

export type UIBadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ShadcnBadgeProps["variant"];
};

export const UIBadge = ({ variant = "default", children, className }: UIBadgeProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <Suspense>
        <UIBadgeDsfr variant={variant} className={className}>
          {children}
        </UIBadgeDsfr>
      </Suspense>
    );
  }

  return (
    <ShadcnBadge variant={variant} className={className}>
      {children}
    </ShadcnBadge>
  );
};
