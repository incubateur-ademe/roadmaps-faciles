import { StatusCodes } from "http-status-codes";
import { type NextRequest, NextResponse } from "next/server";

import { espaceMembreClient, verifyEmLinkToken } from "@/lib/espaceMembre";
import { userRepo } from "@/lib/repo";
import { PrismaClientKnownRequestError } from "@/prisma/internal/prismaNamespace";
import { UpdateUser } from "@/useCases/users/UpdateUser";

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token manquant." }, { status: StatusCodes.BAD_REQUEST });
  }

  try {
    const payload = verifyEmLinkToken(token);
    const member = await espaceMembreClient.member.getByUsername(payload.emUsername);

    if (!member.isActive) {
      return NextResponse.json(
        { error: "Ce membre n'est plus actif sur l'Espace Membre." },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    // Vérifier si ce username est déjà lié à un autre utilisateur
    const existingUser = await userRepo.findByUsername(member.username);
    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { error: "Ce login Espace Membre est déjà lié à un autre compte." },
        { status: StatusCodes.CONFLICT },
      );
    }

    const useCase = new UpdateUser(userRepo);
    await useCase.execute({
      id: payload.userId,
      data: {
        isBetaGouvMember: true,
        username: member.username,
        name: member.fullname,
        image: member.avatar,
      },
    });

    return NextResponse.redirect(payload.redirectUrl);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ce login Espace Membre est déjà lié à un autre compte." },
        { status: StatusCodes.CONFLICT },
      );
    }
    return NextResponse.json({ error: (error as Error).message }, { status: StatusCodes.BAD_REQUEST });
  }
};
