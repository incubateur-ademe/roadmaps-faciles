import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { UICard } from "@/ui/bridge";

import { LoginForm } from "./LoginForm";

const LoginPage = async (_: PageProps<"/login">) => {
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <UICard
        title={t("loginTitle", { brandName: config.brand.name })}
        description={<LoginForm />}
        className="w-full max-w-md"
      />
    </div>
  );
};

export default LoginPage;
