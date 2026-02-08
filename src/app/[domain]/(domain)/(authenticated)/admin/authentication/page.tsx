import { DomainPageHOP } from "../../../DomainPage";
import { AuthenticationForm } from "./AuthenticationForm";

const AuthenticationAdminPage = DomainPageHOP()(props => {
  const { settings } = props._data;

  return (
    <div>
      <h1>Paramètres d'authentification</h1>
      <AuthenticationForm tenantSettings={settings} />
    </div>
  );
});

export default AuthenticationAdminPage;
