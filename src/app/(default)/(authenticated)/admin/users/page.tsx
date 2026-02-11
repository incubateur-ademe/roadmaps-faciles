import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { config } from "@/config";
import { auth } from "@/lib/next-auth/auth";
import { userRepo } from "@/lib/repo";
import { ListAllUsers } from "@/useCases/users/ListAllUsers";

import { GlobalUsersList } from "./GlobalUsersList";

const UsersPage = async () => {
  await connection();

  const [session, t] = await Promise.all([auth(), getTranslations("adminUsers")]);
  const useCase = new ListAllUsers(userRepo);
  const users = await useCase.execute();

  const superAdminIds = new Set(users.filter(u => u.username && config.admins.includes(u.username)).map(u => u.id));

  return (
    <div>
      <h1>{t("title")}</h1>
      <GlobalUsersList users={users} currentUserId={session?.user.uuid ?? ""} superAdminIds={[...superAdminIds]} />
    </div>
  );
};

export default UsersPage;
