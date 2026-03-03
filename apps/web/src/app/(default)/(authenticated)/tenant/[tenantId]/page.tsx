import { notFound } from "next/navigation";

import { tenantRepo } from "@/lib/repo";
import { GetTenantWithSettings } from "@/useCases/tenant/GetTenantWithSettings";

import { Form } from "./Form";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Form tenant={{ ...tenant, settings }} />
    </div>
  );
};

export default TenantMainPage;
