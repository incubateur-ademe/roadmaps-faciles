"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/next-auth/auth";

/**
 * Bridge sign-in server action.
 *
 * Uses `redirect: false` so that the session cookie is set without
 * a server-side redirect (which resolves against the internal Next.js
 * server URL, not the external proxy domain). The client component
 * handles navigation via `window.location.href` instead.
 */
export const bridgeSignIn = async (formData: FormData) => {
  const token = formData.get("token") as string;
  if (!token) {
    return { error: "no-token" as const };
  }

  try {
    await signIn("bridge", { token, redirect: false });
    return { ok: true as const };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type };
    }
    return { error: "unknown" as const };
  }
};
