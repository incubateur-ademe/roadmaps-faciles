import { redirect } from "next/navigation";

import { auth } from "@/lib/next-auth/auth";

export const DefaultAuthenticatedLayout = async ({ children }: LayoutProps<"/">) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return children;
};
