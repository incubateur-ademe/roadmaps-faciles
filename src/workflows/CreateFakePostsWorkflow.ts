import { fakerFR as faker } from "@faker-js/faker";
import { times } from "lodash";

import { prisma } from "@/lib/db/prisma";
import { getServerService } from "@/lib/services";
import { type Like } from "@/prisma/client";

import { type IWorkflow } from "./IWorkflow";

export class CreateFakePostsWorkflow implements IWorkflow {
  public async run() {
    const current = await getServerService("current");
    const tenant = current.tenant;

    const usersOnTenant = await prisma.userOnTenant.findMany({
      where: {
        tenantId: tenant.id,
      },
    });

    const boards = await prisma.board.findMany({
      where: {
        tenantId: tenant.id,
      },
    });

    const postStatuses = await prisma.postStatus.findMany({
      where: {
        tenantId: tenant.id,
      },
    });

    for (let i = 0; i < 20; i++) {
      const randomUserOnTenant = usersOnTenant[faker.number.int(usersOnTenant.length - 1)];
      const randomBoard = boards[faker.number.int(boards.length - 1)];
      const randomPostStatus = postStatuses[faker.number.int(postStatuses.length - 1)];
      const title = faker.lorem.sentence({ max: 6, min: 3 });

      const post = await prisma.post.create({
        data: {
          title,
          slug: faker.helpers.slugify(title),
          description: faker.lorem.paragraphs({ min: 1, max: 4 }),
          boardId: randomBoard.id,
          postStatusId: randomPostStatus.id,
          userId: randomUserOnTenant.userId,
          tenantId: tenant.id,
        },
      });

      await prisma.like.createMany({
        data: times(
          faker.number.int(25),
          () =>
            ({
              postId: post.id,
              anonymousId: faker.string.uuid(),
              tenantId: tenant.id,
            }) as Like,
        ),
      });
    }
  }
}
