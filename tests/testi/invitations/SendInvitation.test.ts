import { SendInvitation } from "@/useCases/invitations/SendInvitation";

import {
  type createMockInvitationRepo as CreateMockInvitationRepo,
  createMockInvitationRepo,
  fakeInvitation,
} from "../helpers";

// Mock prisma (direct access for user/invitation lookups)
const mockUserFindUnique = vi.fn();
const mockInvitationFindUnique = vi.fn();
const mockInvitationDelete = vi.fn();
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => mockUserFindUnique(...args) },
    invitation: {
      findUnique: (...args: unknown[]) => mockInvitationFindUnique(...args),
      delete: (...args: unknown[]) => mockInvitationDelete(...args),
    },
  },
}));

// Mock email sending
const mockSendEmail = vi.fn();
vi.mock("@/lib/mailer", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

// Mock email rendering
vi.mock("@/emails/renderEmails", () => ({
  renderInvitationEmail: vi.fn().mockResolvedValue("<html>invitation</html>"),
}));

// Mock email translations
vi.mock("@/emails/getEmailTranslations", () => ({
  getEmailTranslations: vi.fn().mockResolvedValue({
    subjectOwner: "Invitation owner",
    subjectUser: "Invitation user",
    title: "Title",
    body: "Body {roleText}",
    roleOwner: "owner role",
    button: "Accept",
    ignore: "Ignore",
    footer: "Footer",
  }),
  interpolate: vi.fn((template: string, vars: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] || ""),
  ),
}));

vi.mock("@/config", () => ({
  config: {
    rootDomain: "localhost:3000",
    host: "http://localhost:3000",
  },
}));

describe("SendInvitation", () => {
  let mockInvitationRepo: ReturnType<typeof CreateMockInvitationRepo>;
  let useCase: SendInvitation;

  const validInput = {
    tenantId: 1,
    email: "new@example.com",
    tenantUrl: "https://tenant.example.com",
    role: "USER" as const,
  };

  beforeEach(() => {
    mockInvitationRepo = createMockInvitationRepo();
    useCase = new SendInvitation(mockInvitationRepo);
    mockUserFindUnique.mockReset();
    mockInvitationFindUnique.mockReset();
    mockInvitationDelete.mockReset();
    mockSendEmail.mockReset();
  });

  it("sends an invitation successfully", async () => {
    mockUserFindUnique.mockResolvedValue(null);
    mockInvitationFindUnique.mockResolvedValue(null);
    const invitation = fakeInvitation({ tenantId: 1, email: "new@example.com" });
    mockInvitationRepo.create.mockResolvedValue(invitation);
    mockSendEmail.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(invitation);
    expect(mockInvitationRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 1,
        email: "new@example.com",
        role: "USER",
      }),
    );
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it("throws when user is already a member", async () => {
    mockUserFindUnique.mockResolvedValue({
      id: "user-1",
      status: "ACTIVE",
      memberships: [{ status: "ACTIVE" }],
    });

    await expect(useCase.execute(validInput)).rejects.toThrow("Cet utilisateur est déjà membre de ce tenant.");
  });

  it("throws when user is blocked globally", async () => {
    mockUserFindUnique.mockResolvedValue({
      id: "user-1",
      status: "BLOCKED",
      memberships: [],
    });

    await expect(useCase.execute(validInput)).rejects.toThrow("Cet utilisateur est bloqué ou supprimé.");
  });

  it("throws when user is deleted globally", async () => {
    mockUserFindUnique.mockResolvedValue({
      id: "user-1",
      status: "DELETED",
      memberships: [],
    });

    await expect(useCase.execute(validInput)).rejects.toThrow("Cet utilisateur est bloqué ou supprimé.");
  });

  it("throws when user is blocked on tenant", async () => {
    mockUserFindUnique.mockResolvedValue({
      id: "user-1",
      status: "ACTIVE",
      memberships: [{ status: "BLOCKED" }],
    });

    await expect(useCase.execute(validInput)).rejects.toThrow("Cet utilisateur est bloqué sur ce tenant.");
  });

  it("throws when a pending invitation already exists", async () => {
    mockUserFindUnique.mockResolvedValue(null);
    mockInvitationFindUnique.mockResolvedValue(fakeInvitation({ acceptedAt: null }));

    await expect(useCase.execute(validInput)).rejects.toThrow(
      "Une invitation est déjà en attente pour cet utilisateur.",
    );
  });

  it("replaces a previously accepted invitation", async () => {
    mockUserFindUnique.mockResolvedValue(null);
    mockInvitationFindUnique.mockResolvedValue(fakeInvitation({ id: 42, acceptedAt: new Date() }));
    mockInvitationDelete.mockResolvedValue(undefined);
    const newInvitation = fakeInvitation({ tenantId: 1 });
    mockInvitationRepo.create.mockResolvedValue(newInvitation);
    mockSendEmail.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(mockInvitationDelete).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(result).toEqual(newInvitation);
  });
});
