"use client";

import SideMenu, { type SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Container } from "@/dsfr";

export const AdminSideMenu = () => {
  const t = useTranslations("rootAdmin");
  const pathname = usePathname();

  // Extract the current admin page from pathname (e.g., /admin/tenants -> tenants)
  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "tenants";

  const menuItems: SideMenuProps.Item[] = [
    {
      text: t("tenants"),
      linkProps: { href: "/admin/tenants" },
      isActive: currentPage.startsWith("tenants"),
    },
    {
      text: t("users"),
      linkProps: { href: "/admin/users" },
      isActive: currentPage === "users",
    },
    {
      text: t("prismaStudio"),
      linkProps: { href: "/admin/prisma" },
      isActive: currentPage === "prisma",
    },
  ];

  return (
    <Container className="sticky top-4">
      <SideMenu burgerMenuButtonText={t("sideMenu")} items={menuItems} />
    </Container>
  );
};
