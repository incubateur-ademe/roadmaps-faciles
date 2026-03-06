"use client";

import { cn, SidebarTrigger } from "@kokatsuna/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbSegment {
  href: string;
  label: string;
}

interface AdminHeaderProps {
  /** Map of path segments to display labels (e.g. { "general": "Général", "boards": "Boards" }) */
  breadcrumbLabels?: Record<string, string>;
  className?: string;
  /** Right-side slot for user avatar, notifications, etc. */
  rightSlot?: React.ReactNode;
  /** Root breadcrumb label */
  rootLabel?: string;
}

/**
 * Internal admin header — sticky bar with breadcrumb navigation and optional right-side actions.
 * Sits inside SidebarInset, above the page content.
 */
export const AdminHeader = ({
  rootLabel = "Administration",
  breadcrumbLabels = {},
  rightSlot,
  className,
}: AdminHeaderProps) => {
  const pathname = usePathname();

  const segments = useMemo<BreadcrumbSegment[]>(() => {
    // Extract path after /admin/
    const adminPath = pathname.split("/admin/")[1];
    if (!adminPath) return [];

    const parts = adminPath.split("/").filter(Boolean);
    const result: BreadcrumbSegment[] = [];
    let currentPath = "/admin";

    for (const part of parts) {
      currentPath += `/${part}`;
      const label = breadcrumbLabels[part] ?? part.charAt(0).toUpperCase() + part.slice(1);
      result.push({ href: currentPath, label });
    }

    return result;
  }, [pathname, breadcrumbLabels]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-8",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm">
        <SidebarTrigger className="-ml-1 md:hidden" />
        <nav className="flex items-center text-muted-foreground">
          <span className="font-medium text-foreground">{rootLabel}</span>
          {segments.map(segment => (
            <span key={segment.href} className="flex items-center">
              <ChevronRight className="mx-1.5 size-3.5 text-muted-foreground/60" />
              <Link href={segment.href} className="font-medium text-foreground transition-colors hover:text-primary">
                {segment.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {rightSlot && <div className="flex items-center gap-4">{rightSlot}</div>}
    </header>
  );
};
