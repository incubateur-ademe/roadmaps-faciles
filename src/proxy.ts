import { type NextRequest, NextResponse } from "next/server";

import { responseWithAnonymousId } from "@/utils/anonymousId/responseWithAnonymousId";
import { DIRTY_DOMAIN_HEADER } from "@/utils/dirtyDomain/config";
import { getDomainPathname, pathnameDirtyCheck } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { config as appConfig } from "./config";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Skip proxy rewriting for auth API routes
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

  const isDirtyDomain = pathnameDirtyCheck(pathname);
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // rewrites for app pages
  if (hostname == appConfig.rootDomain) {
    return responseWithAnonymousId(
      req,
      NextResponse.rewrite(new URL(path, req.url), {
        headers: {
          [DIRTY_DOMAIN_HEADER]: isDirtyDomain ? getDomainPathname(pathname) : "false",
        },
      }),
    );
  }

  // Custom domains in dev: strip port so [domain] param matches DB customDomain without port.
  // Subdomains keep the port (needed for getTenantSubdomain matching against rootDomain).
  if (!hostname.endsWith(`.${appConfig.rootDomain}`)) {
    hostname = hostname.replace(/:(\d+)$/, "");
  }

  // rewrite everything else to `/[domain] dynamic route
  return responseWithAnonymousId(req, NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url)));
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
