import { Container } from "@/dsfr";

import { DomainPageHOP } from "../../../DomainPage";
import { GeneralForm } from "./GeneralForm";

const AdminGeneralPage = DomainPageHOP()(props => {
  const { settings } = props._data;

  return (
    <Container fluid>
      <GeneralForm tenantSettings={settings} />
    </Container>
  );
});

export default AdminGeneralPage;
