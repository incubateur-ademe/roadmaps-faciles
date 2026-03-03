import { getTranslations } from "next-intl/server";

import { NewTenantForm } from "./NewTenantForm";

const NewTenantPage = async () => {
  const t = await getTranslations("tenant");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">{t("newTitle")}</h1>
      <p className="mb-6 text-muted-foreground">{t("newDescription")}</p>
      <NewTenantForm />
    </div>
  );
};

export default NewTenantPage;
