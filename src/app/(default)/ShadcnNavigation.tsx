"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@/ui/cn";

export const ShadcnNavigation = () => {
  const segment = useSelectedLayoutSegment("default");
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();

  const items = [
    { text: t("home"), href: "/", isActive: !segment },
    { text: t("workspaces"), href: "/tenant", isActive: segment === "tenant" },
    { text: t("roadmap"), href: "/roadmap", isActive: segment === "roadmap" },
    { text: t("doc"), href: "/doc", isActive: false },
    ...(status === "authenticated" && session.user.isSuperAdmin
      ? [{ text: t("admin"), href: "/admin", isActive: segment === "admin" }]
      : []),
  ];

  return (
    <>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            item.isActive ? "text-foreground" : "text-foreground/60",
          )}
        >
          {item.text}
        </Link>
      ))}
    </>
  );
};
