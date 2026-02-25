import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { getFeatureFlags } from "@/lib/feature-flags";

import { FeatureFlagsForm } from "./FeatureFlagsForm";

const AdminFeatureFlagsPage = async () => {
  await connection();
  const [flags, t] = await Promise.all([getFeatureFlags(), getTranslations("rootAdmin.featureFlags")]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <FeatureFlagsForm flags={flags} />
    </div>
  );
};

export default AdminFeatureFlagsPage;
