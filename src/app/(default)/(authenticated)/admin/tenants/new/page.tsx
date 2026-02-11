import { connection } from "next/server";

import { assertAdmin } from "@/utils/auth";

import { CreateTenantForm } from "./CreateTenantForm";

const CreateTenantPage = async () => {
  await connection();
  await assertAdmin();

  return (
    <div>
      <h1>Créer un tenant</h1>
      <CreateTenantForm />
    </div>
  );
};

export default CreateTenantPage;
