"use client";

import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { HeaderQuickAccessItem } from "@codegouvfr/react-dsfr/Header";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { type ReactNode, useId, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { InitialsAvatar } from "@/components/img/InitialsAvatar";
import { config } from "@/config";
import { Icon } from "@/dsfr";
import { Link } from "@/i18n/navigation";
import { USER_ROLE } from "@/lib/model/User";

export const UserHeaderItem = ({ variant = "tenant" }: { variant?: "root" | "tenant" }) => {
  const session = useSession();
  const segments = useSelectedLayoutSegments();
  const t = useTranslations("auth");

  switch (session.status) {
    case "authenticated": {
      const { user } = session.data;

      const items: UserMenuItem[] = [
        {
          label: t("myProfile"),
          iconId: "fr-icon-user-line",
          linkProps: { href: "/profile" },
          isCurrent: segments.includes("profile"),
        },
      ];

      const isAdmin =
        user.role === USER_ROLE.ADMIN ||
        user.role === USER_ROLE.OWNER ||
        user.isSuperAdmin ||
        user.currentTenantRole === USER_ROLE.ADMIN ||
        user.currentTenantRole === USER_ROLE.OWNER;
      if (isAdmin) {
        items.push({
          label: variant === "root" ? t("administration") : t("tenantAdmin"),
          iconId: "fr-icon-settings-5-line",
          linkProps: { href: "/admin" },
          isCurrent: segments.includes("admin"),
        });
      }

      return (
        <UserMenuHeaderItem
          showLogout
          showUserInfo
          withOutline
          buttonLabel={t("mySpace")}
          userName={
            <>
              {user.name}
              {user.image ? (
                <Image
                  src={new URL(user.image, config.espaceMembre.url).toString()}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full float-right"
                />
              ) : (
                <InitialsAvatar as="span" className="float-right" name={user.name || user.email.toLocaleUpperCase()} />
              )}
            </>
          }
          userEmail={user.email}
          onLogout={() => {
            void signOut({ redirectTo: "/" });
          }}
          items={items}
        />
      );
    }
    case "loading":
      return (
        <HeaderQuickAccessItem
          key="hqai-authloading-fake-user"
          quickAccessItem={{
            iconId: "fr-icon-account-fill",
            buttonProps: {
              onClick(e) {
                e.preventDefault();
              },
              className: fr.cx("fr-btn--tertiary"),
            },
            text: <Skeleton width="6rem" highlightColor="var(--text-action-high-blue-france)" />,
          }}
        />
      );
    default:
      return (
        <HeaderQuickAccessItem
          key="hqai-unauthenticated-login"
          quickAccessItem={{
            iconId: "fr-icon-lock-line",
            linkProps: {
              href: "/login",
              className: fr.cx("fr-btn--secondary"),
            },
            text: t("login"),
          }}
        />
      );
  }
};

export interface UserMenuItem {
  iconId: FrIconClassName;
  isCurrent?: boolean;
  label: ReactNode;
  linkProps: { href: string };
  onClick?: () => void;
}

export interface UserMenuHeaderItemProps {
  buttonLabel?: string;
  className?: CxArg;
  items: UserMenuItem[];
  logoutHref?: string;
  onLogout?: () => void;
  showLogout?: boolean;
  showUserInfo?: boolean;
  userEmail?: ReactNode;
  userName?: ReactNode;
  withOutline?: boolean;
}

export function UserMenuHeaderItem({
  buttonLabel,
  withOutline = true,
  showUserInfo = true,
  showLogout = true,
  userName,
  userEmail,
  items,
  className,
  onLogout,
  logoutHref = "/logout",
}: UserMenuHeaderItemProps) {
  const id = useId();
  const [_open, setOpen] = useState(false);
  const t = useTranslations("auth");
  const label = buttonLabel ?? t("mySpace");

  const toggleMenu = () => setOpen(v => !v);
  const closeMenu = () => setOpen(false);

  const menuId = `user-menu-${id}`;
  const collapseId = `user-menu-collapse-${id}`;
  const componentClass = "fr-user-menu";

  return (
    <nav className={cx(componentClass, fr.cx("fr-nav", "fr-text--sm"), "self-center", className)} id={menuId}>
      <div className={fr.cx("fr-nav__item")}>
        <Button
          className={`${componentClass}__btn`}
          nativeButtonProps={{
            id: `user-menu-btn-${id}`,
            "aria-controls": collapseId,
            "aria-expanded": "false",
            type: "button",
            title: label,
          }}
          priority={withOutline ? "tertiary" : "tertiary no outline"}
          size="small"
          iconId="fr-icon-account-fill"
          onClick={toggleMenu}
        >
          <Icon
            className={`${componentClass}__btn-label`}
            icon="fr-icon-arrow-down-s-line"
            text={label}
            iconPosition="right"
          />
        </Button>

        <div className={cx(fr.cx("fr-collapse", "fr-menu"), `${componentClass}__menu`)} id={collapseId}>
          <ul className={fr.cx("fr-menu__list")} role="menu">
            {showUserInfo && (
              <li className={`${componentClass}__header`}>
                <p className={cx(`${componentClass}__name`)}>{userName}</p>
                <p className={cx(`${componentClass}__email`, fr.cx("fr-text--xs"))}>{userEmail}</p>
              </li>
            )}

            {items.map((item, index) => (
              <li key={index}>
                <Link
                  {...item.linkProps}
                  className={fr.cx("fr-nav__link")}
                  onClick={() => {
                    closeMenu();
                    item.onClick?.();
                  }}
                  aria-current={item.isCurrent}
                >
                  <Icon icon={item.iconId} text={item.label} />
                </Link>
              </li>
            ))}

            {showLogout && logoutHref && (
              <>
                <li className={`${componentClass}__logout`}>
                  <Button
                    priority="tertiary"
                    iconId="fr-icon-logout-box-r-line"
                    size="large"
                    linkProps={{
                      href: logoutHref,
                      onClick(e) {
                        e.preventDefault();
                        closeMenu();
                        onLogout?.();
                      },
                    }}
                  >
                    {t("logout")}
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
