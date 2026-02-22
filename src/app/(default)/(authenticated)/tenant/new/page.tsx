import { getTranslations } from "next-intl/server";

import { Container } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { NewTenantForm } from "./NewTenantForm";

const NewTenantPage = async () => {
  const t = await getTranslations("tenant");

  return (
    <DsfrPage>
      <Container mt="2w">
        <h1>{t("newTitle")}</h1>
        <p>{t("newDescription")}</p>
        <NewTenantForm />
      </Container>
    </DsfrPage>
  );
};

export default NewTenantPage;
