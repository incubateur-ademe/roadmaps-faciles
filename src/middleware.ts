import { type NextRequest, NextResponse } from "next/server";

import { responseWithAnonymousId } from "@/utils/anonymousId/responseWithAnonymousId";
import { DIRTY_DOMAIN_HEADER } from "@/utils/dirtyDomain/config";
import { getDomainPathname, pathnameDirtyCheck } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { config as appConfig } from "./config";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host")!.replace(".localhost:3000", `.${appConfig.rootDomain}`);

  // experimental: support for Chrome DevTools
  if (req.url.includes("/.well-known/appspecific/com.chrome.devtools.json") && appConfig.env === "dev") {
    console.log("Serving Chrome DevTools configuration");
    return NextResponse.json({
      workspace: {
        root: import.meta.url.replace("file://", "").replace("src/middleware.ts", ""),
        uuid: crypto.randomUUID(),
      },
      deployment: {
        url: hostname,
      },
    });
  }

  // special case for Vercel preview deployment URLs (should it be used for scalingo?)
  // if (
  //   hostname.includes("---") &&
  //   hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  // ) {
  //   hostname = `${hostname.split("---")[0]}.${
  //     appConfig.rootDomain
  //   }`;
  // }

  const isDirtyDomain = pathnameDirtyCheck(url.pathname);
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // rewrites for app pages
  if (hostname == appConfig.rootDomain) {
    return responseWithAnonymousId(
      req,
      NextResponse.rewrite(new URL(`${path === "/" ? "" : path}`, req.url), {
        headers: {
          [DIRTY_DOMAIN_HEADER]: isDirtyDomain ? getDomainPathname(url.pathname) : "false",
        },
      }),
    );
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
    "/((?!api|_next/|_static).*)",
    // include api/auth for next-auth
    "/api/auth/:path*",
  ],
};
