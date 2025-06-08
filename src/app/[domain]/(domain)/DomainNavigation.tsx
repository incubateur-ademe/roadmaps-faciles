"use client";

import MainNavigation, { type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegments } from "next/navigation";

import { type Board, type TenantSetting } from "@/prisma/client";

interface DomainNavigationProps {
  boards: Board[];
  tenantSetting: TenantSetting;
}

export const DomainNavigation = ({ boards, tenantSetting }: DomainNavigationProps) => {
  const segments = useSelectedLayoutSegments();
  const segment = segments.join("/");
  return (
    <MainNavigation
      items={[
        { text: "Roadmap", linkProps: { href: "/roadmap" }, isActive: segment === "roadmap" },
        ...boards.map<MainNavigationProps.Item>(board => ({
          text: board.name,
          linkProps: { href: `/board/${board.slug}` },
          isActive: segment === `board/${board.slug}` || (!segment && board.id === tenantSetting.rootBoardId),
        })),
      ]}
    />
  );
};
