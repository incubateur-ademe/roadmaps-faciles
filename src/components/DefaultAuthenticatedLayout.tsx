import { redirect } from "next/navigation";

import { auth } from "@/lib/next-auth/auth";

export const DefaultAuthenticatedLayout = async ({ children }: LayoutProps<"/">) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Redirect to 2FA verification if required but not yet verified
  if (session.twoFactorRequired && !session.twoFactorVerified) {
    redirect("/2fa");
  }

  // Redirect to 2FA setup if force 2FA is active but user has no 2FA methods
  if (session.twoFactorRequired && !session.user.twoFactorEnabled) {
    redirect("/profile/security");
  }

  return children;
};
