"use client";

import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useTracking } from "./TrackingContext";

/**
 * Syncs the authenticated user identity to both Sentry and the tracking provider.
 * Renders nothing — side-effect only.
 *
 * Place inside `TrackingProvider` and `SessionProvider`.
 */
export function IdentifyUser() {
  const { data: session, status } = useSession();
  const tracking = useTracking();
  const identifiedRef = useRef<null | string>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const user = session.user;
      const userId = user.id;

      if (!userId || identifiedRef.current === userId) return;

      // Sentry user context
      Sentry.setUser({
        id: userId,
        username: user.name ?? undefined,
        email: user.email ?? undefined,
      });

      // Tracking provider identify
      tracking.identify(userId, {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        role: user.role ?? undefined,
      });

      // Tenant group (if in a tenant context)
      if (user.currentTenantRole) {
        tracking.group("tenant", userId, {
          role: user.currentTenantRole,
        });
      }

      identifiedRef.current = userId;
    }

    if (status === "unauthenticated" && identifiedRef.current) {
      Sentry.setUser(null);
      tracking.reset();
      identifiedRef.current = null;
    }
  }, [status, session, tracking]);

  return null;
}
