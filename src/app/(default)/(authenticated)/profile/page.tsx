import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import Form from "next/form";

import { Container, FormFieldset, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { userRepo } from "@/lib/repo";

import { PasswordCheck } from "./PasswordCheck";

const ProfilePage = async (_: PageProps<"/[domain]/profile"> | PageProps<"/profile">) => {
  const user = await userRepo.findByEmail("lilian.sagetlethias@beta.gouv.fr");
  console.log({ user });
  return (
    <DsfrPage>
      <Container my="4w">
        <Grid haveGutters>
          <GridCol base={4} offset={4}>
            <Form
              action={async formData => {
                "use server";
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await formData;
                const name = formData.get("name");
                const email = formData.get("email");
                const password = formData.get("password");

                console.log({ name, email, password });
              }}
            >
              <FormFieldset
                legend="Paramètres du profil"
                elements={[
                  <Input key="name" label="Nom complet" nativeInputProps={{ name: "name" }} />,
                  <Input
                    key="email"
                    label="Adresse e-mail"
                    nativeInputProps={{
                      type: "email",
                      name: "email",
                    }}
                  />,
                  // password input with show/hide functionality and confirmation
                  <PasswordCheck key="passwordCheck" name="password" />,
                ]}
              />
              <hr />
              <FormFieldset
                legend="Notifications"
                elements={[
                  <Checkbox
                    key={"emailNotifications"}
                    small
                    hintText="si désactivé, vous ne recevrez aucune notification"
                    options={[{ label: "Notifications activées", nativeInputProps: { defaultChecked: true } }]}
                  />,
                ]}
              />

              <hr />
              <Input
                label="Mot de passe actuel"
                nativeInputProps={{ type: "password" }}
                hintText="Le mot de passe actuel est nécessaire pour confirmer les modifications."
              />
              <Button type="submit" priority="primary">
                Enregistrer les modifications
              </Button>
            </Form>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
};

export default ProfilePage;
