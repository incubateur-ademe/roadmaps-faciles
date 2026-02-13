"use client";

import SideMenu from "@codegouvfr/react-dsfr/SideMenu";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Container } from "@/dsfr";

export const ModerationSideMenu = () => {
  const pathname = usePathname();
  const t = useTranslations("moderation.sideMenu");

  const currentPage = pathname.split("/moderation")[1]?.replace(/^\//, "") || "";

  return (
    <Container style={{ position: "sticky", top: "1rem" }}>
      <SideMenu
        burgerMenuButtonText={t("title")}
        items={[
          {
            text: t("pendingPosts"),
            linkProps: { href: "/moderation" },
            isActive: currentPage === "",
          },
          {
            text: t("rejectedPosts"),
            linkProps: { href: "/moderation/rejected" },
            isActive: currentPage === "rejected",
          },
        ]}
      />
    </Container>
  );
};
