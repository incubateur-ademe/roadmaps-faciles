"use client";

import { useUI } from "@/ui";
import { cn } from "@/ui/cn";

import { Skeleton as ShadcnSkeleton } from "../shadcn/skeleton";

export type UISkeletonProps = {
  className?: string;
};

export const UISkeleton = ({ className }: UISkeletonProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return <div className={cn("animate-pulse rounded bg-[var(--background-contrast-grey)]", className)} />;
  }

  return <ShadcnSkeleton className={className} />;
};
