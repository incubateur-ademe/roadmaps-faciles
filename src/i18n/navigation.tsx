"use client";

import { useLocale } from "next-intl";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import {
  redirect as nextRedirect,
  type RedirectType,
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import { type ComponentProps, forwardRef } from "react";

import { DEFAULT_LOCALE, stripLocalePrefix } from "@/utils/i18n";

function addLocalePrefix(href: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return href;
  // Don't prefix absolute URLs or API routes
  if (href.startsWith("http") || href.startsWith("/api")) return href;
  return `/${locale}${href.startsWith("/") ? "" : "/"}${href}`;
}

export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(function Link(props, ref) {
  const locale = useLocale();
  const href = typeof props.href === "string" ? addLocalePrefix(props.href, locale) : props.href;
  return <NextLink ref={ref} {...props} href={href} />;
});

export function usePathname(): string {
  const pathname = useNextPathname();
  return stripLocalePrefix(pathname);
}

export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();

  return {
    ...router,
    push(href: string, options?: Parameters<typeof router.push>[1]) {
      router.push(addLocalePrefix(href, locale), options);
    },
    replace(href: string, options?: Parameters<typeof router.replace>[1]) {
      router.replace(addLocalePrefix(href, locale), options);
    },
  };
}

/**
 * Server-side locale-aware redirect. Must be used in server components/actions only.
 */
export async function redirect(href: string, type?: RedirectType): Promise<never> {
  const { getLocale } = await import("next-intl/server");
  const locale = await getLocale();
  return nextRedirect(addLocalePrefix(href, locale), type);
}

export type { NextLinkProps as LinkProps };
