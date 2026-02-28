"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/ui/cn";

export const AdminSideMenu = () => {
  const t = useTranslations("rootAdmin");
  const pathname = usePathname();

  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "tenants";

  const menuItems = [
    { text: t("tenants"), href: "/admin/tenants", isActive: currentPage.startsWith("tenants") },
    { text: t("users"), href: "/admin/users", isActive: currentPage.startsWith("users") },
    { text: t("security.menu"), href: "/admin/security", isActive: currentPage.startsWith("security") },
    { text: t("featureFlags.menu"), href: "/admin/feature-flags", isActive: currentPage.startsWith("feature-flags") },
    { text: t("prismaStudio"), href: "/admin/prisma", isActive: currentPage.startsWith("prisma") },
    { text: t("auditLog"), href: "/admin/audit-log", isActive: currentPage.startsWith("audit-log") },
  ];

  return (
    <nav>
      <ul className="space-y-1">
        {menuItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                item.isActive
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
