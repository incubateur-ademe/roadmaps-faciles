import { prisma } from "@/lib/db/prisma";
import { getServerService } from "@/lib/services";

import { type IWorkflow } from "./IWorkflow";

export class CreateWelcomeEntitiesWorkflow implements IWorkflow {
  public async run() {
    const current = await getServerService("current");
    const tenant = current.tenant;

    const owner = (await prisma.userOnTenant.findFirst({
      where: {
        tenantId: tenant.id,
        status: "ACTIVE",
        role: "OWNER",
      },
    }))!;

    // Create some Boards
    const featureBoard = await prisma.board.create({
      data: {
        name: "Feature Requests",
        slug: "feature",
        description:
          "Ceci est un **tableau** ! Allez dans les Paramètres > Boards pour le personnaliser ou en ajouter d'autres !",
        order: 0,
        tenantId: tenant.id,
      },
    });
    const bugBoard = await prisma.board.create({
      data: {
        name: "Bug Reports",
        slug: "bug",
        description: "Dites-nous tout sur les problèmes que vous avez rencontrés dans nos services !",
        order: 1,
        tenantId: tenant.id,
      },
    });

    // Create some Post Statuses
    const plannedPostStatus = await prisma.postStatus.create({
      data: {
        name: "Planifié",
        color: "blueCumulus",
        order: 0,
        tenantId: tenant.id,
        showInRoadmap: true,
      },
    });
    const inProgressPostStatus = await prisma.postStatus.create({
      data: {
        name: "En cours",
        color: "purpleGlycine",
        order: 1,
        tenantId: tenant.id,
        showInRoadmap: true,
      },
    });
    const completedPostStatus = await prisma.postStatus.create({
      data: {
        name: "Complété",
        color: "greenMenthe",
        order: 2,
        tenantId: tenant.id,
        showInRoadmap: true,
      },
    });
    const rejectedPostStatus = await prisma.postStatus.create({
      data: {
        name: "Rejetté",
        color: "error",
        order: 3,
        tenantId: tenant.id,
        showInRoadmap: false,
      },
    });

    // Create some Posts
    const post1 = await prisma.post.create({
      data: {
        title: "Ceci est un exemple de post de feedback, cliquez pour en savoir plus !",
        description:
          'Les utilisateurs peuvent soumettre des retours en publiant des posts comme celui-ci. Vous pouvez attribuer un **statut** à chaque post : celui-ci, par exemple, est marqué comme "Planifié". N\'oubliez pas que vous pouvez personnaliser les statuts des posts dans les paramètres du site > Statuts',
        boardId: featureBoard.id,
        userId: owner.userId,
        postStatusId: plannedPostStatus.id,
        tenantId: tenant.id,
      },
    });
    await prisma.postStatusChange.create({
      data: {
        postId: post1.id,
        userId: owner.userId,
        postStatusId: plannedPostStatus.id,
        tenantId: tenant.id,
      },
    });

    await prisma.pin.create({
      data: {
        postId: post1.id,
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: "Il y a plusieurs tableaux",
        description:
          'Nous avons créé deux tableaux pour vous, "Demandes de fonctionnalités" et "Rapports de bogues", mais vous pouvez en ajouter ou en supprimer autant que vous le souhaitez ! Il suffit d\'aller dans Paramètres du site > Tableaux !',
        boardId: bugBoard.id,
        userId: owner.userId,
        tenantId: tenant.id,
      },
    });

    // Create some comments
    await prisma.comment.create({
      data: {
        body: "Les utilisateurs peuvent commenter pour exprimer leurs opinions ! Comme pour les publications et les descriptions de tableau, les commentaires peuvent être formatés en *Markdown* **formaté**",
        userId: owner.userId,
        tenantId: tenant.id,
        postId: post1.id,
      },
    });

    // Set first board as root page
    await prisma.tenantSettings.update({
      where: {
        tenantId: tenant.id,
      },
      data: {
        rootBoardId: featureBoard.id,
      },
    });
  }
}
