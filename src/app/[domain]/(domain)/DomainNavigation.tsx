"use client";

import MainNavigation, { type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

import { type Board, type TenantSettings } from "@/prisma/client";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";

interface DomainNavigationProps {
  boards: Board[];
  tenantSettings: TenantSettings;
}

export const DomainNavigation = ({ boards, tenantSettings }: DomainNavigationProps) => {
  const segments = useSelectedLayoutSegments();
  const segment = segments.join("/");
  const pathname = usePathname();
  const dirtyDomainFixer = dirtySafePathname(pathname);

  return (
    <MainNavigation
      items={[
        ...(tenantSettings.showRoadmapInHeader
          ? [{ text: "Roadmap", linkProps: { href: dirtyDomainFixer("/roadmap") }, isActive: segment === "roadmap" }]
          : []),
        ...boards.map<MainNavigationProps.Item>(board => ({
          text: board.name,
          linkProps: { href: dirtyDomainFixer(`/board/${board.slug}`) },
          isActive: segment === `board/${board.slug}` || (!segment && board.id === tenantSettings.rootBoardId),
        })),
      ]}
    />
  );
};
