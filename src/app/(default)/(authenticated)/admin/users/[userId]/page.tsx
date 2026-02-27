import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { userRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";
import { Button } from "@/ui/shadcn/button";
import { type NextServerPageProps } from "@/utils/next";

import { UserEditForm } from "./UserEditForm";

const UserEditPage = async ({ params }: NextServerPageProps<{ userId: string }>) => {
  await connection();

  const { userId } = await params;
  const user = await userRepo.findById(userId);
  if (!user) notFound();
  if (user.role === UserRole.OWNER || user.role === UserRole.INHERITED) notFound();

  const t = await getTranslations("rootAdmin");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{user.name ?? user.email}</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/users">{t("back")}</Link>
        </Button>
      </div>

      <UserEditForm user={user} />
    </div>
  );
};

export default UserEditPage;
