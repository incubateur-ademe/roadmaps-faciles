import { redirect } from "next/navigation";

import { auth } from "@/lib/next-auth/auth";
import { getServerService } from "@/lib/services";

const TenantAuthenticatedLayout = async ({ children }: LayoutProps<"/">) => {
  const session = await auth();

  const current = await getServerService("current");

  if (!session) {
    redirect("/login");
  }

  return children;
};

export default TenantAuthenticatedLayout;
