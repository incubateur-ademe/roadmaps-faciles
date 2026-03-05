"use client";

import { SidebarTrigger } from "@kokatsuna/ui";
import { Database, KeyRound, LayoutDashboard, ScrollText, Shield, ToggleLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminSidebar } from "@/ui/AdminSidebar";

export const AdminSideMenu = () => {
  const t = useTranslations("rootAdmin");

  return (
    <AdminSidebar
      title={t("sideMenu")}
      groups={[
        {
          items: [
            { label: t("tenants"), href: "/admin/tenants", icon: LayoutDashboard },
            { label: t("users"), href: "/admin/users", icon: KeyRound },
            { label: t("security.menu"), href: "/admin/security", icon: Shield },
            { label: t("featureFlags.menu"), href: "/admin/feature-flags", icon: ToggleLeft },
            { label: t("prismaStudio"), href: "/admin/prisma", icon: Database },
            { label: t("auditLog"), href: "/admin/audit-log", icon: ScrollText },
          ],
        },
      ]}
    />
  );
};

export { SidebarTrigger as AdminSidebarTrigger };
