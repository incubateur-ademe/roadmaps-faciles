import { getTranslations } from "next-intl/server";

import { DomainPageHOP } from "../../../DomainPage";
import { AuthenticationForm } from "./AuthenticationForm";

const AuthenticationAdminPage = DomainPageHOP()(async props => {
  const { settings } = props._data;
  const t = await getTranslations("domainAdmin.authentication");

  return (
    <div>
      <h1>{t("title")}</h1>
      <AuthenticationForm tenantSettings={settings} />
    </div>
  );
});

export default AuthenticationAdminPage;
