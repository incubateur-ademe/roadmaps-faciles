import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";

import { LoginForm } from "./LoginForm";

const LoginPage = async (_: PageProps<"/login">) => {
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("loginTitle", { brandName: config.brand.name })}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
