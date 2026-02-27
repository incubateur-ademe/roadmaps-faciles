import { AlertTriangle, Lock, Search, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

import { Button } from "@/ui/shadcn/button";

const ICON_MAP = {
  lock: Lock,
  search: Search,
  error: AlertTriangle,
  wrench: Wrench,
};

const SYSTEM_CODE_ICONS: Record<string, keyof typeof ICON_MAP> = {
  "401": "lock",
  "403": "lock",
  "404": "search",
  "500": "error",
  construction: "wrench",
  maintenance: "wrench",
};

const SYSTEM_CODE_ALIASES: Record<string, string> = {
  unauthorized: "401",
  forbidden: "403",
  "not-found": "404",
  "login-AuthorizedCallbackError": "401",
  "login-AccessDenied": "401",
};

export type RootSystemCode = keyof typeof SYSTEM_CODE_ALIASES;

export const VALID_ROOT_SYSTEM_CODES = new Set([
  ...Object.keys(SYSTEM_CODE_ICONS),
  ...Object.keys(SYSTEM_CODE_ALIASES),
]);

export type RootSystemMessageProps = RootSystemMessageProps.WithCode & RootSystemMessageProps.WithRedirect;

namespace RootSystemMessageProps {
  export type WithRedirect =
    | {
        noRedirect: true;
        redirectLink?: never;
        redirectText?: never;
      }
    | {
        noRedirect?: never;
        redirectLink?: LinkProps<string>["href"];
        redirectText?: string;
      };

  export type WithCode =
    | {
        body: ReactNode;
        code: "custom";
        headline: string;
        icon?: keyof typeof ICON_MAP;
        title: string;
      }
    | {
        body?: never;
        code: RootSystemCode;
        headline?: never;
        icon?: never;
        title?: never;
      };
}

export const RootSystemMessage = async ({
  code,
  noRedirect,
  body,
  headline,
  title,
  icon = "error",
  redirectLink = "/",
  redirectText,
}: RootSystemMessageProps) => {
  const t = await getTranslations("errors");

  if (code !== "custom") {
    const resolvedCode = SYSTEM_CODE_ALIASES[code] ?? code;
    body = t(`${resolvedCode}.body` as "401.body");
    headline = t(`${resolvedCode}.headline` as "401.headline");
    title = t(`${resolvedCode}.title` as "401.title");
    icon = SYSTEM_CODE_ICONS[resolvedCode] ?? "error";
    code = resolvedCode;
  }

  if (!redirectText) redirectText = t("homepage");

  const IconComponent = ICON_MAP[icon];

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <IconComponent className="size-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        {!isNaN(+code) && <p className="mb-2 text-sm text-muted-foreground">{t("errorCode", { code })}</p>}
        <p className="mb-4 text-lg text-muted-foreground">{headline}</p>
        <div className="mb-6 text-sm text-muted-foreground">{body}</div>
        {!noRedirect && (
          <Button asChild>
            <Link href={redirectLink}>{redirectText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
