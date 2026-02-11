import { redirect } from "@/i18n/navigation";

const TenantAdminPage = async () => {
  await redirect("/admin/general");
};

export default TenantAdminPage;
