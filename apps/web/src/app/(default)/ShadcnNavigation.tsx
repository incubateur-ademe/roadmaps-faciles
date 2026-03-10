"use client";

import { cn } from "@kokatsuna/ui";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ShadcnNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();

  const items = [
    { text: t("home"), href: "/", isActive: pathname === "/" },
    { text: t("workspaces"), href: "/tenant", isActive: pathname.startsWith("/tenant") },
    { text: t("roadmap"), href: "/roadmap", isActive: pathname.startsWith("/roadmap") },
    { text: t("doc"), href: "/doc", isActive: pathname.startsWith("/doc") },
    ...(status === "authenticated" && session.user.isSuperAdmin
      ? [{ text: t("admin"), href: "/admin", isActive: pathname.startsWith("/admin") }]
      : []),
  ];

  return (
    <>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-primary",
            item.isActive ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {item.text}
        </Link>
      ))}
    </>
  );
};
