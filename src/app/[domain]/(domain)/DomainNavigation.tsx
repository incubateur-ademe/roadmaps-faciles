"use client";

import MainNavigation, { type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegment } from "next/navigation";

import { type Board } from "@/prisma/client";

interface DomainNavigationProps {
  boards: Board[];
}

export const DomainNavigation = ({ boards }: DomainNavigationProps) => {
  const segment = useSelectedLayoutSegment("domain");
  return (
    <MainNavigation
      items={[
        { text: "Roadmap", linkProps: { href: "/roadmap" }, isActive: !segment || segment === "roadmap" },
        ...boards.map<MainNavigationProps.Item>(board => ({
          text: board.name,
          linkProps: { href: `/board/${board.id}` },
          isActive: segment === `board/${board.id}`,
        })),
      ]}
    />
  );
};
