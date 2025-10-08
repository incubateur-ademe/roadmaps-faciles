import { getServerService } from "@/lib/services";

const TenantAdminPage = async () => {
  const current = await getServerService("current");

  console.log("TenantAdminPage", { current });
  return <div>Tenant Admin Page</div>;
};

export default TenantAdminPage;
