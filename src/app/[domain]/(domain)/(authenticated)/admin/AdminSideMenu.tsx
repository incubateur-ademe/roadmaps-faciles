"use client";

import SideMenu, { type SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/dsfr";

export const AdminSideMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<null | string>(null);

  // Extract the current admin page from pathname (e.g., /admin/general -> general)
  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "general";

  // Handle hash changes for section navigation
  useEffect(() => {
    const updateActiveSection = () => {
      const hash = window.location.hash.slice(1);
      setActiveSection(hash || null);
    };

    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);
    return () => window.removeEventListener("hashchange", updateActiveSection);
  }, []);

  // Define menu structure with dynamic active states
  const menuItems: SideMenuProps.Item[] = [
    {
      text: "Général",
      linkProps: { href: `/admin/general` },
      isActive: currentPage === "general",
      expandedByDefault: activeSection !== null,
      items: [
        {
          linkProps: { href: `/admin/general#privacy` },
          text: "Confidentialité",
          isActive: currentPage === "general" && activeSection === "privacy",
        },
        {
          linkProps: { href: `/admin/general#localization` },
          text: "Localisation",
          isActive: currentPage === "general" && activeSection === "localization",
        },
        {
          linkProps: { href: `/admin/general#moderation` },
          text: "Modération",
          isActive: currentPage === "general" && activeSection === "moderation",
        },
        {
          linkProps: { href: `/admin/general#header` },
          text: "En-tête",
          isActive: currentPage === "general" && activeSection === "header",
        },
        {
          linkProps: { href: `/admin/general#visibility` },
          text: "Visibilité",
          isActive: currentPage === "general" && activeSection === "visibility",
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
      text: "Invitations",
      linkProps: { href: `/admin/invitations` },
      isActive: currentPage === "invitations",
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
