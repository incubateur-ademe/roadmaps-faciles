import { notFound } from "next/navigation";

import { CenteredContainer } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { tenantRepo } from "@/lib/repo";
import { GetTenantWithSettings } from "@/useCases/tenant/GetTenantWithSettings";

import { Form } from "./Form";
import style from "./TenantMain.module.scss";

interface Params {
  tenantId: string;
}

interface Props {
  params: Promise<Params>;
}

const TenantMainPage = async ({ params }: Props) => {
  const id = Number((await params).tenantId);

  if (isNaN(id)) {
    notFound();
  }

  const useCase = new GetTenantWithSettings(tenantRepo);
  const { tenant, tenantSettings: settings } = await useCase.execute({ id });

  if (!tenant || !settings) {
    notFound();
  }

  return (
    <DsfrPage>
      <CenteredContainer py="4w" className={style.indentity}>
        <Form tenant={{ ...tenant, settings }} />
      </CenteredContainer>
    </DsfrPage>
  );
};

export default TenantMainPage;
