"use client";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@kokatsuna/ui";
import { ArrowRight, LogOut, Settings, Shield, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { isSessionAdmin, isSessionModerator } from "@/utils/sessionRoles";

export interface ShadcnUserHeaderItemProps {
  pendingModerationCount?: number;
  variant?: "root" | "tenant";
}

export const ShadcnUserHeaderItem = ({ variant = "root", pendingModerationCount = 0 }: ShadcnUserHeaderItemProps) => {
  const session = useSession();
  const t = useTranslations("auth");

  switch (session.status) {
    case "authenticated": {
      const { user } = session.data;
      const isAdmin = isSessionAdmin(user);
      const isModerator = isSessionModerator(user);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">{user.name || user.email}</span>
              {pendingModerationCount > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                  {pendingModerationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 size-4" />
                {t("myProfile")}
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Settings className="mr-2 size-4" />
                  {variant === "root" ? t("administration") : t("tenantAdmin")}
                </Link>
              </DropdownMenuItem>
            )}
            {isModerator && variant === "tenant" && (
              <DropdownMenuItem asChild>
                <Link href="/moderation" className="flex items-center">
                  <Shield className="mr-2 size-4" />
                  {t("moderation")}
                  {pendingModerationCount > 0 && (
                    <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                      {t("moderationNewCount", { count: pendingModerationCount })}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void signOut({ redirectTo: "/" });
              }}
            >
              <LogOut className="mr-2 size-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    case "loading":
      return <Skeleton className="h-8 w-24" />;
    default:
      return (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("login")}
          </Link>
          {/* CTA links to /login — single auth entry point (magic link handles both new + returning users) */}
          <Button size="sm" asChild>
            <Link href="/login">
              {t("getStarted")}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </>
      );
  }
};
