import { fakerFR as faker } from "@faker-js/faker";
import { times } from "lodash";

import { prisma } from "@/lib/db/prisma";
import { getServerService } from "@/lib/services";
import { type Comment, type Follow, type Like } from "@/prisma/client";

import { type IWorkflow } from "./IWorkflow";

const POSTS_COUNT = 200;
const MAX_LIKES = 128;
const MAX_COMMENTS = 16;

export class CreateFakePostsWorkflow implements IWorkflow {
  public async run() {
    const current = await getServerService("current");
    const tenant = current.tenant;

    const usersOnTenant = await prisma.userOnTenant.findMany({
      where: {
        tenantId: tenant.id,
      },
    });

    const MAX_FOLLOWS = usersOnTenant.length;

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

    const previousPostCount = await prisma.post.count();

    let alreadyPinned = false;
    for (let i = 0; i < POSTS_COUNT; i++) {
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

      // pin first post
      if (!alreadyPinned) {
        await prisma.pin.upsert({
          create: {
            postId: post.id,
            id: 1,
          },
          update: {
            postId: post.id,
            id: 1,
          },
          where: {
            id: 1,
          },
        });
        alreadyPinned = true;
      }

      await prisma.like.createMany({
        data: times(
          faker.number.int(MAX_LIKES),
          () =>
            ({
              postId: post.id,
              anonymousId: faker.string.uuid(),
              tenantId: tenant.id,
            }) as Like,
        ),
      });

      await prisma.comment.createMany({
        data: times(
          faker.number.int(MAX_COMMENTS),
          () =>
            ({
              body: faker.lorem.paragraph({ min: 1, max: 4 }),
              postId: post.id,
              userId: usersOnTenant[faker.number.int(usersOnTenant.length - 1)].userId,
              tenantId: tenant.id,
            }) as Comment,
        ),
      });

      const alreadyFollowed = [...usersOnTenant];
      await prisma.follow.createMany({
        data: times(faker.number.int(MAX_FOLLOWS), () => {
          const userIndex = faker.number.int(alreadyFollowed.length - 1);
          const userId = alreadyFollowed[userIndex].userId;
          alreadyFollowed.splice(userIndex, 1);
          return {
            postId: post.id,
            tenantId: tenant.id,
            userId,
          } as Follow;
        }),
      });
    }

    // test PostWithHotness
    const postsWithHotnessCount = await prisma.postWithHotness.count();
    if (postsWithHotnessCount !== POSTS_COUNT + previousPostCount) {
      console.log({ postsWithHotnessCount, POSTS_COUNT, previousPostCount });
      throw new Error("PostWithHotness count is not correct");
    }
  }
}
