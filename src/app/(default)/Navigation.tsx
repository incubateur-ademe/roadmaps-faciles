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
          text: t("groups"),
          linkProps: {
            href: "/group",
          },
          isActive: segment === "group",
        },
        {
          text: t("templates"),
          linkProps: {
            href: "/template",
          },
          isActive: segment === "template",
        },
        {
          text: t("startups"),
          linkProps: {
            href: "/startup",
          },
          isActive: segment === "startup",
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
