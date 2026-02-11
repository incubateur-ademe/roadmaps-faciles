"use client";

import SideMenu, { type SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { usePathname } from "next/navigation";

import { Container } from "@/dsfr";

export const AdminSideMenu = () => {
  const pathname = usePathname();

  // Extract the current admin page from pathname (e.g., /admin/tenants -> tenants)
  const currentPage = pathname.split("/admin/")[1]?.split("#")[0] || "tenants";

  const menuItems: SideMenuProps.Item[] = [
    {
      text: "Tenants",
      linkProps: { href: "/admin/tenants" },
      isActive: currentPage.startsWith("tenants"),
    },
    {
      text: "Utilisateurs",
      linkProps: { href: "/admin/users" },
      isActive: currentPage === "users",
    },
    {
      text: "Prisma Studio",
      linkProps: { href: "/admin/prisma" },
      isActive: currentPage === "prisma",
    },
  ];

  return (
    <Container className="sticky top-4">
      <SideMenu burgerMenuButtonText="Administration" items={menuItems} />
    </Container>
  );
};
