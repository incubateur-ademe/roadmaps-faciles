import { notFound } from "next/navigation";

import { Container } from "@/dsfr";

import { DomainPageHOP } from "../../../DomainPage";
import { GeneralForm } from "./GeneralForm";

const AdminGeneralPage = DomainPageHOP({ withSettings: true })(async props => {
  const { settings } = props._data;

  if (!settings) notFound();

  return (
    <Container fluid>
      <GeneralForm tenantSettings={settings} />
    </Container>
  );
});

export default AdminGeneralPage;
