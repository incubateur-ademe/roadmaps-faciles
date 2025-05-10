import { fakerFR as faker } from "@faker-js/faker";

import { prisma } from "@/lib/db/prisma";
import { getServerService } from "@/lib/services";
import { $Enums } from "@/prisma/client";

import { type IWorkflow } from "./IWorkflow";

export class CreateFakeUsersWorkflow implements IWorkflow {
  public async run() {
    const current = await getServerService("current");
    const tenant = current.tenant;

    const userStatusKeys = Object.keys($Enums.UserStatus) as Array<keyof typeof $Enums.UserStatus>;
    for (let i = 0; i < 10; i++) {
      const fakeUserSexType = faker.person.sexType();
      const fakeUserFirstName = faker.person.firstName(fakeUserSexType);
      const fakeUserLastName = faker.person.lastName(fakeUserSexType);

      const userIteration = await prisma.user.create({
        data: {
          username: faker.internet.username({
            firstName: fakeUserFirstName,
            lastName: fakeUserLastName,
          }),
          name: faker.person.fullName({
            sex: fakeUserSexType,
            firstName: fakeUserFirstName,
            lastName: fakeUserLastName,
          }),
          email: faker.internet
            .email({
              provider: "faker.beta.gouv.fr",
              firstName: fakeUserFirstName,
              lastName: fakeUserLastName,
            })
            .toLocaleLowerCase(),
          emailVerified: new Date(),
          role: $Enums.UserRole.USER,
          status: $Enums.UserStatus[userStatusKeys[faker.number.int(userStatusKeys.length - 1)]],
        },
      });

      await prisma.userOnTenant.create({
        data: {
          userId: userIteration.id,
          tenantId: tenant.id,
          role: $Enums.UserRole.USER,
          status: $Enums.UserStatus[userStatusKeys[faker.number.int(userStatusKeys.length - 1)]],
        },
      });
    }
  }
}
