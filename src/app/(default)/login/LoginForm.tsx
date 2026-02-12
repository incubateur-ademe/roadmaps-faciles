import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ESPACE_MEMBRE_PROVIDER_ID } from "@incubateur-ademe/next-auth-espace-membre-provider";
import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect, unstable_rethrow as rethrow } from "next/navigation";

import { FormFieldset } from "@/dsfr";
import { signIn } from "@/lib/next-auth/auth";
import { isRedirectError, type NextError } from "@/utils/next";

export interface LoginFormProps {
  defaultEmail?: string;
  domain?: string;
  loginWithEmail?: boolean;
}

const loginValueKey = "login";

export const LoginForm = async ({ loginWithEmail, defaultEmail }: LoginFormProps) => {
  const t = await getTranslations("auth");

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
        legend={<h2>{loginWithEmail ? t("loginWithEmail") : t("loginWithUsername")}</h2>}
        elements={[
          loginWithEmail ? (
            <Input
              key="email"
              label={t("emailLabel")}
              nativeInputProps={{
                type: "email",
                required: true,
                name: loginValueKey,
                defaultValue: defaultEmail,
              }}
            />
          ) : (
            <Input
              key="username"
              label={t("usernameLabel")}
              nativeInputProps={{
                type: "text",
                required: true,
                name: loginValueKey,
                pattern: "^[A-Za-z.]+$",
                title: t("usernameValidation"),
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
                    children: t("login"),
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
