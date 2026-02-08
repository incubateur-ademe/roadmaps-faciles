import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { Grid, GridCol } from "@/dsfr";
import { userRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";
import { type NextServerPageProps } from "@/utils/next";

import { UserEditForm } from "./UserEditForm";

const UserEditPage = async ({ params }: NextServerPageProps<{ userId: string }>) => {
  await connection();

  const { userId } = await params;
  const user = await userRepo.findById(userId);
  if (!user) notFound();
  if (user.role === UserRole.OWNER || user.role === UserRole.INHERITED) notFound();

  return (
    <div>
      <Grid haveGutters valign="middle" mb="4w">
        <GridCol>
          <h1 className={fr.cx("fr-mb-0")}>{user.name ?? user.email}</h1>
        </GridCol>
        <GridCol base={false} className="fr-col-auto">
          <ButtonsGroup
            inlineLayoutWhen="always"
            buttonsSize="small"
            buttons={[
              {
                children: "Retour",
                priority: "secondary",
                linkProps: { href: "/admin/users" },
              },
            ]}
          />
        </GridCol>
      </Grid>

      <UserEditForm user={user} />
    </div>
  );
};

export default UserEditPage;
