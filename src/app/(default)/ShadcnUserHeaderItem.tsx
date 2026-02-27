"use client";

import { LogIn, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { USER_ROLE } from "@/lib/model/User";
import { Button } from "@/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Skeleton } from "@/ui/shadcn/skeleton";

export const ShadcnUserHeaderItem = () => {
  const session = useSession();
  const t = useTranslations("auth");

  switch (session.status) {
    case "authenticated": {
      const { user } = session.data;
      const isAdmin =
        user.role === USER_ROLE.ADMIN ||
        user.role === USER_ROLE.OWNER ||
        user.isSuperAdmin ||
        user.currentTenantRole === USER_ROLE.ADMIN ||
        user.currentTenantRole === USER_ROLE.OWNER;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">{user.name || user.email}</span>
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
                  {t("administration")}
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
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">
            <LogIn className="mr-2 size-4" />
            {t("login")}
          </Link>
        </Button>
      );
  }
};
