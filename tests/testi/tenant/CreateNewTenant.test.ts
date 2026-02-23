import { CreateNewTenant } from "@/useCases/tenant/CreateNewTenant";

import {
  type createMockInvitationRepo as CreateMockInvitationRepo,
  type createMockTenantRepo as CreateMockTenantRepo,
  type createMockTenantSettingsRepo as CreateMockTenantSettingsRepo,
  type createMockUserOnTenantRepo as CreateMockUserOnTenantRepo,
  type createMockUserRepo as CreateMockUserRepo,
  createMockInvitationRepo,
  createMockTenantRepo,
  createMockTenantSettingsRepo,
  createMockUserOnTenantRepo,
  createMockUserRepo,
  fakeTenant,
  fakeTenantSettings,
} from "../helpers";

// Mock des providers externes
const mockAddDomain = vi.fn();
vi.mock("@/lib/domain-provider", () => ({
  getDomainProvider: () => ({ addDomain: mockAddDomain }),
}));

const mockAddRecord = vi.fn();
vi.mock("@/lib/dns-provider", () => ({
  getDnsProvider: () => ({ addRecord: mockAddRecord }),
}));

// Mock SendInvitation avec une vraie classe (nécessaire pour `new`)
const mockSendInvitationExecute = vi.fn();
vi.mock("@/useCases/invitations/SendInvitation", () => ({
  SendInvitation: class {
    public execute = mockSendInvitationExecute;
  },
}));

vi.mock("@/config", () => ({
  config: {
    rootDomain: "localhost:3000",
    host: "http://localhost:3000",
  },
}));

describe("CreateNewTenant", () => {
  let mockTenantRepo: ReturnType<typeof CreateMockTenantRepo>;
  let mockSettingsRepo: ReturnType<typeof CreateMockTenantSettingsRepo>;
  let mockInvitationRepo: ReturnType<typeof CreateMockInvitationRepo>;
  let mockUserOnTenantRepo: ReturnType<typeof CreateMockUserOnTenantRepo>;
  let mockUserRepo: ReturnType<typeof CreateMockUserRepo>;
  let useCase: CreateNewTenant;

  beforeEach(() => {
    mockTenantRepo = createMockTenantRepo();
    mockSettingsRepo = createMockTenantSettingsRepo();
    mockInvitationRepo = createMockInvitationRepo();
    mockUserOnTenantRepo = createMockUserOnTenantRepo();
    mockUserRepo = createMockUserRepo();
    useCase = new CreateNewTenant(
      mockTenantRepo,
      mockSettingsRepo,
      mockInvitationRepo,
      mockUserOnTenantRepo,
      mockUserRepo,
    );
    mockAddDomain.mockReset();
    mockAddRecord.mockReset();
    mockSendInvitationExecute.mockReset();
  });

  it("creates a tenant with settings and provisions domain/DNS", async () => {
    const tenant = fakeTenant({ id: 1 });
    const settings = fakeTenantSettings({ tenantId: 1, name: "Test", subdomain: "test" });

    mockTenantRepo.create.mockResolvedValue(tenant);
    mockSettingsRepo.create.mockResolvedValue(settings);
    mockUserOnTenantRepo.create.mockResolvedValue({});
    mockAddDomain.mockResolvedValue(undefined);
    mockAddRecord.mockResolvedValue({ type: "CNAME", name: "test" });
    mockSendInvitationExecute.mockResolvedValue({});

    const result = await useCase.execute({
      name: "Test",
      subdomain: "test",
      creatorId: "user-1",
      ownerEmails: ["owner@test.com"],
    });

    expect(mockTenantRepo.create).toHaveBeenCalled();
    expect(mockSettingsRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: 1, name: "Test", subdomain: "test" }),
    );
    expect(mockAddDomain).toHaveBeenCalledWith("test.localhost:3000", "subdomain");
    expect(mockAddRecord).toHaveBeenCalledWith("test");
    expect(result.tenant).toEqual({ ...tenant, settings });
    expect(result.dns).toEqual({ type: "CNAME", name: "test" });
  });

  it("continues when DNS provisioning fails (non-blocking)", async () => {
    const tenant = fakeTenant({ id: 2 });
    const settings = fakeTenantSettings({ tenantId: 2, name: "Test2", subdomain: "test2" });

    mockTenantRepo.create.mockResolvedValue(tenant);
    mockSettingsRepo.create.mockResolvedValue(settings);
    mockUserOnTenantRepo.create.mockResolvedValue({});
    mockAddDomain.mockResolvedValue(undefined);
    mockAddRecord.mockRejectedValue(new Error("DNS provider error"));
    mockSendInvitationExecute.mockResolvedValue({});

    const result = await useCase.execute({
      name: "Test2",
      subdomain: "test2",
      creatorId: "user-1",
      ownerEmails: ["owner@test.com"],
    });

    expect(result.dns).toBeUndefined();
    expect(result.tenant).toBeDefined();
  });

  it("sends invitations to all owner emails", async () => {
    const tenant = fakeTenant({ id: 3 });
    const settings = fakeTenantSettings({ tenantId: 3, subdomain: "multi" });

    mockTenantRepo.create.mockResolvedValue(tenant);
    mockSettingsRepo.create.mockResolvedValue(settings);
    mockUserOnTenantRepo.create.mockResolvedValue({});
    mockAddDomain.mockResolvedValue(undefined);
    mockAddRecord.mockResolvedValue({});
    mockSendInvitationExecute.mockResolvedValue({});

    await useCase.execute({
      name: "Multi",
      subdomain: "multi",
      creatorId: "user-1",
      ownerEmails: ["owner1@test.com", "owner2@test.com"],
    });

    expect(mockSendInvitationExecute).toHaveBeenCalledTimes(2);
    expect(mockSendInvitationExecute).toHaveBeenCalledWith(
      expect.objectContaining({ email: "owner1@test.com", role: "OWNER" }),
    );
    expect(mockSendInvitationExecute).toHaveBeenCalledWith(
      expect.objectContaining({ email: "owner2@test.com", role: "OWNER" }),
    );
  });

  it("continues when an owner invitation fails (e.g., already a member)", async () => {
    const tenant = fakeTenant({ id: 5 });
    const settings = fakeTenantSettings({ tenantId: 5, subdomain: "dup" });

    mockTenantRepo.create.mockResolvedValue(tenant);
    mockSettingsRepo.create.mockResolvedValue(settings);
    mockUserOnTenantRepo.create.mockResolvedValue({});
    mockAddDomain.mockResolvedValue(undefined);
    mockAddRecord.mockResolvedValue({});
    mockSendInvitationExecute
      .mockRejectedValueOnce(new Error("Cet utilisateur est déjà membre de ce tenant."))
      .mockResolvedValueOnce({});

    const result = await useCase.execute({
      name: "Dup",
      subdomain: "dup",
      creatorId: "user-1",
      ownerEmails: ["already-member@test.com", "new-owner@test.com"],
    });

    expect(result.tenant).toBeDefined();
    expect(mockSendInvitationExecute).toHaveBeenCalledTimes(2);
  });

  it("creates OWNER membership for the creator", async () => {
    const tenant = fakeTenant({ id: 4 });
    const settings = fakeTenantSettings({ tenantId: 4, subdomain: "owned" });

    mockTenantRepo.create.mockResolvedValue(tenant);
    mockSettingsRepo.create.mockResolvedValue(settings);
    mockUserOnTenantRepo.create.mockResolvedValue({});
    mockAddDomain.mockResolvedValue(undefined);
    mockAddRecord.mockResolvedValue({});
    mockSendInvitationExecute.mockResolvedValue({});

    await useCase.execute({
      name: "Owned",
      subdomain: "owned",
      creatorId: "creator-uuid",
      ownerEmails: ["owner@test.com"],
    });

    expect(mockUserOnTenantRepo.create).toHaveBeenCalledWith({
      userId: "creator-uuid",
      tenantId: 4,
      role: "OWNER",
      status: "ACTIVE",
    });
  });
});
