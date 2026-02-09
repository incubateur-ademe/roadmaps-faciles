"use server";

import { AuthError } from "next-auth";
import { redirect, unstable_rethrow as rethrow } from "next/navigation";

import { signIn } from "@/lib/next-auth/auth";
import { isRedirectError, type NextError } from "@/utils/next";

export const bridgeSignIn = async (formData: FormData) => {
  const token = formData.get("token") as string;
  if (!token) {
    redirect("/login");
  }

  try {
    await signIn("bridge", { token, redirectTo: "/" });
  } catch (error) {
    if (isRedirectError(error as NextError)) rethrow(error);
    if (error instanceof AuthError) {
      redirect(`/login?error=${error.type}`);
    }
    redirect("/login");
  }
};
