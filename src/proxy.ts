import { type NextRequest, NextResponse } from "next/server";

import { responseWithAnonymousId } from "@/utils/anonymousId/responseWithAnonymousId";
import { DIRTY_DOMAIN_HEADER } from "@/utils/dirtyDomain/config";
import { getDomainPathname, pathnameDirtyCheck } from "@/utils/dirtyDomain/pathnameDirtyCheck";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from "@/utils/i18n";

import { config as appConfig } from "./config";

const NON_DEFAULT_LOCALES = LOCALES.filter(l => l !== DEFAULT_LOCALE);
const localePrefix = new RegExp(`^/(${NON_DEFAULT_LOCALES.join("|")})(/.*)?$`);
const defaultLocalePrefix = new RegExp(`^/${DEFAULT_LOCALE}(/.*)?$`);

function detectLocale(req: NextRequest, pathname: string): { locale: string; strippedPathname: string } {
  // 1. Redirect /fr/... → /... (default locale should not have prefix)
  const defaultMatch = pathname.match(defaultLocalePrefix);
  if (defaultMatch) {
    const target = defaultMatch[1] || "/";
    const url = req.nextUrl.clone();
    url.pathname = target;
    // This will be handled specially by the caller
    return { locale: DEFAULT_LOCALE, strippedPathname: `__REDIRECT__${target}${url.search}` };
  }

  // 2. Extract non-default locale prefix (/en/...)
  const match = pathname.match(localePrefix);
  if (match) {
    return { locale: match[1], strippedPathname: match[2] || "/" };
  }

  // 3. No prefix — read cookie, fallback to default
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number]) ? cookieLocale : DEFAULT_LOCALE;
  return { locale, strippedPathname: pathname };
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Skip locale handling for auth API routes
  if (pathname.startsWith("/api/auth")) {
    return;
  }

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers.get("host")!.replace(".localhost:3000", `.${appConfig.rootDomain}`);

  // experimental: support for Chrome DevTools
  if (req.url.includes("/.well-known/appspecific/com.chrome.devtools.json") && appConfig.env === "dev") {
    console.log("Serving Chrome DevTools configuration");
    return NextResponse.json({
      workspace: {
        root: import.meta.url.replace("file://", "").replace("src/proxy.ts", ""),
        uuid: crypto.randomUUID(),
      },
      deployment: {
        url: hostname,
      },
    });
  }

  // Detect and strip locale prefix
  const { locale, strippedPathname } = detectLocale(req, pathname);

  // Handle redirect for default locale prefix
  if (strippedPathname.startsWith("__REDIRECT__")) {
    const target = strippedPathname.replace("__REDIRECT__", "");
    return NextResponse.redirect(new URL(target, req.url));
  }

  const isDirtyDomain = pathnameDirtyCheck(strippedPathname);
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${strippedPathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  const setLocaleCookie = (response: NextResponse) => {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  };

  // rewrites for app pages
  if (hostname == appConfig.rootDomain) {
    return setLocaleCookie(
      responseWithAnonymousId(
        req,
        NextResponse.rewrite(new URL(`${path === "/" ? "" : path}`, req.url), {
          headers: {
            [DIRTY_DOMAIN_HEADER]: isDirtyDomain ? getDomainPathname(strippedPathname) : "false",
          },
        }),
      ),
    );
  }

  // Custom domains in dev: strip port so [domain] param matches DB customDomain without port.
  // Subdomains keep the port (needed for getTenantSubdomain matching against rootDomain).
  if (!hostname.endsWith(`.${appConfig.rootDomain}`)) {
    hostname = hostname.replace(/:(\d+)$/, "");
  }

  // rewrite everything else to `/[domain] dynamic route
  return setLocaleCookie(responseWithAnonymousId(req, NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))));
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    // "/((?!api|_next/|_static|[\\w-]+\\.\\w+).*)",
    "/((?!api|_next/|_static|img/).*)",
    // include api/auth for next-auth
    "/api/auth/:path*",
  ],
};
