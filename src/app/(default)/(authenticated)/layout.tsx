import { redirect } from "next/navigation";

import { auth } from "@/lib/next-auth/auth";

const AuthenticatedLayout = async ({ children }: LayoutProps<"/">) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return children;
};

export default AuthenticatedLayout;
