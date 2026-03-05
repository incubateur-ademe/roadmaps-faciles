"use client";

import { Database, LayoutDashboard, ScrollText, Shield, ToggleLeft, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminSidebar, type NavGroup } from "@/ui/AdminSidebar";

export const AdminSideMenu = () => {
  const t = useTranslations("rootAdmin");

  const groups: NavGroup[] = [
    {
      label: t("groups.management"),
      items: [
        { label: t("tenants"), href: "/admin/tenants", icon: LayoutDashboard },
        { label: t("users"), href: "/admin/users", icon: Users },
      ],
    },
    {
      label: t("groups.security"),
      items: [
        { label: t("security.menu"), href: "/admin/security", icon: Shield },
        { label: t("featureFlags.menu"), href: "/admin/feature-flags", icon: ToggleLeft },
      ],
    },
    {
      label: t("groups.developers"),
      items: [
        { label: t("prismaStudio"), href: "/admin/prisma", icon: Database },
        { label: t("auditLog"), href: "/admin/audit-log", icon: ScrollText },
      ],
    },
  ];

  return <AdminSidebar title={t("sideMenu")} subtitle="Administration" groups={groups} />;
};
