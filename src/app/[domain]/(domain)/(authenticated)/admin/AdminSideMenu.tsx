"use client";

import SideMenu, { type SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/dsfr";

const GENERAL_SECTION_IDS = ["privacy", "localization", "moderation", "header", "visibility"];

export const AdminSideMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<null | string>(null);
  const visibleSections = useRef(new Set<string>());
  const t = useTranslations("domainAdmin.sideMenu");

  // Extract the current admin page from pathname (e.g., /admin/general -> general)
  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "general";

  // Track visible sections with IntersectionObserver
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

        // Pick the topmost visible section (by DOM order)
        const topmost = GENERAL_SECTION_IDS.find(id => visibleSections.current.has(id));
        setActiveSection(topmost ?? null);
      },
      { rootMargin: "-10% 0px -60% 0px" },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [currentPage]);

  // Only relevant when on the general page
  const currentSection = currentPage === "general" ? activeSection : null;

  // Define menu structure with dynamic active states
  const menuItems: SideMenuProps.Item[] = [
    {
      text: t("general"),
      linkProps: { href: `/admin/general` },
      isActive: currentPage === "general",
      expandedByDefault: currentPage === "general",
      items: [
        {
          linkProps: { href: `/admin/general#privacy` },
          text: t("privacy"),
          isActive: currentPage === "general" && currentSection === "privacy",
        },
        {
          linkProps: { href: `/admin/general#localization` },
          text: t("localization"),
          isActive: currentPage === "general" && currentSection === "localization",
        },
        {
          linkProps: { href: `/admin/general#moderation` },
          text: t("moderation"),
          isActive: currentPage === "general" && currentSection === "moderation",
        },
        {
          linkProps: { href: `/admin/general#header` },
          text: t("headerSection"),
          isActive: currentPage === "general" && currentSection === "header",
        },
        {
          linkProps: { href: `/admin/general#visibility` },
          text: t("visibility"),
          isActive: currentPage === "general" && currentSection === "visibility",
        },
      ],
    },
    {
      text: t("authentication"),
      linkProps: { href: `/admin/authentication` },
      isActive: currentPage === "authentication",
    },
    {
      text: t("boards"),
      linkProps: { href: `/admin/boards` },
      isActive: currentPage === "boards",
    },
    {
      text: t("statuses"),
      linkProps: { href: `/admin/statuses` },
      isActive: currentPage === "statuses",
    },
    {
      text: t("roadmap"),
      linkProps: { href: `/admin/roadmap` },
      isActive: currentPage === "roadmap",
    },
    {
      text: t("webhooks"),
      linkProps: { href: `/admin/webhooks` },
      isActive: currentPage === "webhooks",
    },
    {
      text: t("users"),
      linkProps: { href: `/admin/users` },
      isActive: currentPage.startsWith("users"),
      expandedByDefault: currentPage.startsWith("users"),
      items: [
        {
          text: t("members"),
          linkProps: { href: `/admin/users` },
          isActive: currentPage === "users",
        },
        {
          text: t("invitations"),
          linkProps: { href: `/admin/users/invitations` },
          isActive: currentPage === "users/invitations",
        },
      ],
    },
    {
      text: t("api"),
      linkProps: { href: `/admin/api` },
      isActive: currentPage === "api",
    },
  ];

  return (
    <Container style={{ position: "sticky", top: "1rem" }}>
      <SideMenu burgerMenuButtonText={t("title")} items={menuItems} />
    </Container>
  );
};
