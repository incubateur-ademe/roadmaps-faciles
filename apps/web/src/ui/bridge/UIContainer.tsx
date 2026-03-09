"use client";

import { cn } from "@kokatsuna/ui";
import { type PropsWithChildren } from "react";

import { useUI } from "@/ui";

export type UIContainerProps = PropsWithChildren<{
  className?: string;
  fluid?: boolean;
  size?: "lg" | "md" | "sm" | "xl";
}>;

export const UIContainer = ({ children, className, fluid, size }: UIContainerProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    const base = size ? `fr-container-${size}` : "fr-container";
    return <div className={cn(base, fluid && "fr-container--fluid", className)}>{children}</div>;
  }

  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
};
