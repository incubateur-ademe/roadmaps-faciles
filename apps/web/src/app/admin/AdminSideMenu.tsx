"use client";

import { Database, LayoutDashboard, ScrollText, Shield, ToggleLeft, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { config } from "@/config";
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
        { label: t("auditLog.title"), href: "/admin/audit-log", icon: ScrollText },
      ],
    },
  ];

  return (
    <AdminSidebar
      title="Roadmaps Faciles"
      subtitle="Administration"
      icon={<Image src="/img/roadmaps-faciles.png" alt="" width={20} height={20} className="size-5" />}
      iconBg={false}
      groups={groups}
      backHref="/"
      backLabel={t("backToSite")}
      footer={{ status: t("systemOperational"), version: `v${config.appVersion}` }}
    />
  );
};
