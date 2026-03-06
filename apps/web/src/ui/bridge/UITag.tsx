"use client";

import type DsfrTag from "@codegouvfr/react-dsfr/Tag";

import { Badge as ShadcnBadge, cn } from "@kokatsuna/ui";
import { type ComponentProps, lazy, Suspense } from "react";

import { useUI } from "@/ui";

const UITagDsfr = lazy(() => import("./UITagDsfr").then(m => ({ default: m.UITagDsfr })));

type DsfrTagProps = ComponentProps<typeof DsfrTag>;

export type UITagProps = {
  as?: "span";
  children: React.ReactNode;
  className?: string;
  iconId?: DsfrTagProps["iconId"];
  onClick?: () => void;
  small?: boolean;
};

export const UITag = ({ children, className, small, iconId, onClick, as }: UITagProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <Suspense>
        <UITagDsfr className={className} small={small} iconId={iconId} onClick={onClick} as={as}>
          {children}
        </UITagDsfr>
      </Suspense>
    );
  }

  const Comp = as === "span" ? "span" : "div";

  return (
    <ShadcnBadge
      variant="outline"
      className={cn(small && "text-xs py-0", onClick && "cursor-pointer", className)}
      onClick={onClick}
      asChild
    >
      <Comp>{children}</Comp>
    </ShadcnBadge>
  );
};
