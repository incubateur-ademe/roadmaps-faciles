"use client";

import SideMenu, { type SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/dsfr";

const GENERAL_SECTION_IDS = ["privacy", "localization", "moderation", "header", "visibility"];

export const AdminSideMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<null | string>(null);
  const visibleSections = useRef(new Set<string>());

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
      text: "Général",
      linkProps: { href: `/admin/general` },
      isActive: currentPage === "general",
      expandedByDefault: currentPage === "general",
      items: [
        {
          linkProps: { href: `/admin/general#privacy` },
          text: "Confidentialité",
          isActive: currentPage === "general" && currentSection === "privacy",
        },
        {
          linkProps: { href: `/admin/general#localization` },
          text: "Localisation",
          isActive: currentPage === "general" && currentSection === "localization",
        },
        {
          linkProps: { href: `/admin/general#moderation` },
          text: "Modération",
          isActive: currentPage === "general" && currentSection === "moderation",
        },
        {
          linkProps: { href: `/admin/general#header` },
          text: "En-tête",
          isActive: currentPage === "general" && currentSection === "header",
        },
        {
          linkProps: { href: `/admin/general#visibility` },
          text: "Visibilité",
          isActive: currentPage === "general" && currentSection === "visibility",
        },
      ],
    },
    {
      text: "Authentification",
      linkProps: { href: `/admin/authentication` },
      isActive: currentPage === "authentication",
    },
    {
      text: "Boards",
      linkProps: { href: `/admin/boards` },
      isActive: currentPage === "boards",
    },
    {
      text: "Statuts",
      linkProps: { href: `/admin/statuses` },
      isActive: currentPage === "statuses",
    },
    {
      text: "Feuille de route",
      linkProps: { href: `/admin/roadmap` },
      isActive: currentPage === "roadmap",
    },
    {
      text: "Webhooks",
      linkProps: { href: `/admin/webhooks` },
      isActive: currentPage === "webhooks",
    },
    {
      text: "Utilisateurs",
      linkProps: { href: `/admin/users` },
      isActive: currentPage.startsWith("users"),
      expandedByDefault: currentPage.startsWith("users"),
      items: [
        {
          text: "Membres",
          linkProps: { href: `/admin/users` },
          isActive: currentPage === "users",
        },
        {
          text: "Invitations",
          linkProps: { href: `/admin/users/invitations` },
          isActive: currentPage === "users/invitations",
        },
      ],
    },
    {
      text: "API",
      linkProps: { href: `/admin/api` },
      isActive: currentPage === "api",
    },
  ];

  return (
    <Container style={{ position: "sticky", top: "1rem" }}>
      <SideMenu burgerMenuButtonText="Administration" items={menuItems} />
    </Container>
  );
};
