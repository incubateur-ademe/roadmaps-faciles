import { type NextRequest, NextResponse } from "next/server";

import { config } from "@/config";
import { createBridgeToken } from "@/lib/authBridge";
import { auth } from "@/lib/next-auth/auth";

const rootUrl = (path = "/") => new URL(path, config.host);

export const GET = async (request: NextRequest) => {
  const redirectUrl = request.nextUrl.searchParams.get("redirect");

  if (!redirectUrl) {
    return NextResponse.redirect(rootUrl());
  }

  // Validate redirect URL to prevent open redirect
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(redirectUrl);
  } catch {
    return NextResponse.redirect(rootUrl());
  }

  // Only allow http/https protocols
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.redirect(rootUrl());
  }

  // Only allow redirect to same host or tenant subdomains
  const rootDomain = config.rootDomain;
  const rootHost = rootUrl().host;
  const isAllowedHost = parsedUrl.host === rootHost || parsedUrl.host.endsWith(`.${rootDomain}`);
  if (!isAllowedHost) {
    return NextResponse.redirect(rootUrl());
  }

  const session = await auth();

  if (!session?.user?.uuid) {
    // Not logged in — redirect to root login so user can authenticate first
    return NextResponse.redirect(rootUrl("/login"));
  }

  const token = createBridgeToken(session.user.uuid);
  parsedUrl.searchParams.set("bridge_token", token);

  return NextResponse.redirect(parsedUrl);
};
