import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { assertAdmin } from "@/utils/auth";

import { CreateTenantForm } from "./CreateTenantForm";

const CreateTenantPage = async () => {
  await connection();
  await assertAdmin();

  const t = await getTranslations("adminTenants");

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t("create")}</h1>
      <CreateTenantForm />
    </div>
  );
};

export default CreateTenantPage;
