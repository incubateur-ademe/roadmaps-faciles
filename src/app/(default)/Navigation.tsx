"use client";

import { MainNavigation, type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSelectedLayoutSegment } from "next/navigation";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment("default");
  const t = useTranslations("navigation");

  const { data: session, status } = useSession();

  return (
    <MainNavigation
      items={[
        {
          text: t("home"),
          linkProps: {
            href: "/",
          },
          isActive: !segment,
        },
        {
          text: t("workspaces"),
          linkProps: {
            href: "/tenant",
          },
          isActive: segment === "tenant",
        },
        {
          text: t("roadmap"),
          linkProps: {
            href: "/roadmap",
          },
          isActive: segment === "roadmap",
        },
        {
          text: t("doc"),
          linkProps: {
            href: "/doc",
          },
          isActive: false,
        },
        ...(((status === "authenticated" &&
          session.user.isSuperAdmin && [
            {
              text: t("admin"),
              linkProps: {
                href: "/admin",
              },
              isActive: segment === "admin",
            },
          ]) ||
          []) as MainNavigationProps["items"]),
      ]}
    />
  );
};
