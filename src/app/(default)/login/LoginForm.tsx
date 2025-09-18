import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ESPACE_MEMBRE_PROVIDER_ID } from "@incubateur-ademe/next-auth-espace-membre-provider";
import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { redirect, unstable_rethrow as rethrow } from "next/navigation";
import { AuthError } from "next-auth";

import { FormFieldset } from "@/dsfr";
import { signIn } from "@/lib/next-auth/auth";
import { isRedirectError, type NextError } from "@/utils/next";

export interface LoginFormProps {
  domain?: string;
  loginWithEmail?: boolean;
}

const loginValueKey = "login";

export const LoginForm = ({ loginWithEmail }: LoginFormProps) => {
  return (
    <form
      action={async data => {
        "use server";

        try {
          await signIn(loginWithEmail ? "nodemailer" : ESPACE_MEMBRE_PROVIDER_ID, {
            email: data.get(loginValueKey),
            redirectTo: "/",
          });
        } catch (error) {
          // we need to let the error boundary handle the error
          if (isRedirectError(error as NextError)) rethrow(error);
          if (error instanceof AuthError) {
            if (error.cause?.err instanceof EspaceMembreClientMemberNotFoundError)
              redirect("/login/error?error=AccessDenied");
            redirect(`/login/error?error=${error.type}`);
          }
          redirect("/error");
        }
      }}
    >
      <FormFieldset
        legend={
          <h2>
            {loginWithEmail
              ? "Se connecter avec son adresse mail"
              : "Se connecter avec son nom d'utilisateur beta gouv"}
          </h2>
        }
        elements={[
          loginWithEmail ? (
            <Input
              key="email"
              label="Email"
              nativeInputProps={{
                type: "email",
                required: true,
                name: loginValueKey,
              }}
            />
          ) : (
            <Input
              key="username"
              label="Identifiant"
              nativeInputProps={{
                type: "text",
                required: true,
                name: loginValueKey,
                pattern: "^[A-Za-z.]+$",
                title:
                  "Votre identifiant doit être composé de lettres et de points. Il ne s'agit pas de votre adresse email Beta.",
              }}
            />
          ),
          <FormFieldset
            key="submit"
            legend={null}
            elements={[
              <ButtonsGroup
                key="buttons-group"
                buttons={[
                  {
                    children: "Se connecter",
                    type: "submit",
                  },
                ]}
              />,
            ]}
          />,
        ]}
      />
    </form>
  );
};
