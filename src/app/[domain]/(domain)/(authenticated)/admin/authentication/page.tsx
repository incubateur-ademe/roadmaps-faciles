import { DomainPageHOP } from "../../../DomainPage";
import { AuthenticationForm } from "./AuthenticationForm";

const AuthenticationAdminPage = DomainPageHOP({ withSettings: true })(props => {
  const { settings } = props._data;
  if (!settings) throw new Error("Settings not found");

  return (
    <div>
      <h1>Paramètres d'authentification</h1>
      <AuthenticationForm tenantSettings={settings} />
    </div>
  );
});

export default AuthenticationAdminPage;
