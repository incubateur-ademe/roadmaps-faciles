"use client";

import { Columns3, KeyRound, Map, Plug, ScrollText, Settings, Shield, Tag, Users, Webhook } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useFeatureFlag } from "@/lib/feature-flags/client";
import { AdminSidebar, type NavGroup } from "@/ui/AdminSidebar";

/** [sectionId, i18nKey] — sectionId used for IntersectionObserver + URL hash, i18nKey for translation */
const GENERAL_SECTIONS = [
  ["privacy", "privacy"],
  ["localization", "localization"],
  ["moderation", "moderation"],
  ["header", "headerSection"],
  ["visibility", "visibility"],
  ["embedding", "embedding"],
] as const;

const GENERAL_SECTION_IDS = GENERAL_SECTIONS.map(([id]) => id);

export const AdminSideMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<null | string>(null);
  const visibleSections = useRef(new Set<string>());
  const t = useTranslations("domainAdmin.sideMenu");
  const integrationsEnabled = useFeatureFlag("integrations");

  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "general";

  // Track visible sections with IntersectionObserver for general page quick-nav
  useEffect(() => {
    if (currentPage !== "general") return;

    const elements = GENERAL_SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    visibleSections.current.clear();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.current.add(entry.target.id);
          } else {
            visibleSections.current.delete(entry.target.id);
          }
        }
        const topmost = GENERAL_SECTION_IDS.find(id => visibleSections.current.has(id));
        setActiveSection(topmost ?? null);
      },
      { rootMargin: "-10% 0px -60% 0px" },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [currentPage]);

  const groups: NavGroup[] = [
    {
      label: t("configuration"),
      items: [
        {
          label: t("general"),
          href: "/admin/general",
          icon: Settings,
          subItems: GENERAL_SECTIONS.map(([id, key]) => ({
            label: t(key),
            href: `/admin/general#${id}`,
          })),
        },
        { label: t("authentication"), href: "/admin/authentication", icon: Shield },
        { label: t("boards"), href: "/admin/boards", icon: Columns3 },
        { label: t("statuses"), href: "/admin/statuses", icon: Tag },
        { label: t("roadmap"), href: "/admin/roadmap", icon: Map },
      ],
    },
    {
      label: t("securityAccess"),
      items: [
        {
          label: t("users"),
          href: "/admin/users",
          icon: Users,
          matchPrefix: true,
          subItems: [
            { label: t("members"), href: "/admin/users" },
            { label: t("invitations"), href: "/admin/users/invitations" },
          ],
        },
        { label: t("auditLog"), href: "/admin/audit-log", icon: ScrollText },
      ],
    },
    {
      label: t("developers"),
      items: [
        { label: t("api"), href: "/admin/api", icon: KeyRound },
        { label: t("webhooks"), href: "/admin/webhooks", icon: Webhook },
        ...(integrationsEnabled
          ? [{ label: t("integrations"), href: "/admin/integrations", icon: Plug, matchPrefix: true as const }]
          : []),
      ],
    },
  ];

  return (
    <AdminSidebar title={t("title")} groups={groups} activeSection={currentPage === "general" ? activeSection : null} />
  );
};
