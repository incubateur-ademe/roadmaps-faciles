import { faker } from "@faker-js/faker";
import { type Mock, vi } from "vitest";

import { type IBoardRepo } from "@/lib/repo/IBoardRepo";
import { type IInvitationRepo } from "@/lib/repo/IInvitationRepo";
import { type IPostRepo } from "@/lib/repo/IPostRepo";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";

type MockRepo<T> = { [K in keyof T]: Mock };

export function createMockPostRepo(): MockRepo<IPostRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockBoardRepo(): MockRepo<IBoardRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findAllForTenant: vi.fn(),
    findById: vi.fn(),
    findSlugById: vi.fn(),
    reorder: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockTenantRepo(): MockRepo<ITenantRepo> {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findAllForUser: vi.fn(),
    findAllWithSettings: vi.fn(),
    findByCustomDomain: vi.fn(),
    findById: vi.fn(),
    findByIdWithSettings: vi.fn(),
    findBySubdomain: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockTenantSettingsRepo(): MockRepo<ITenantSettingsRepo> {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByTenantId: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockInvitationRepo(): MockRepo<IInvitationRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findAllForTenant: vi.fn(),
    findById: vi.fn(),
  };
}

export function createMockUserOnTenantRepo(): MockRepo<IUserOnTenantRepo> {
  return {
    countOwners: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findByTenantId: vi.fn(),
    findByUserId: vi.fn(),
    findByUserIdWithSettings: vi.fn(),
    findMembership: vi.fn(),
    update: vi.fn(),
  };
}

export function fakePost(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    boardId: faker.number.int({ min: 1, max: 100 }),
    postStatusId: null,
    tenantId: 1,
    userId: faker.string.uuid(),
    anonymousId: null,
    slug: faker.lorem.slug(),
    createdAt: new Date(),
    updatedAt: new Date(),
    editedAt: null,
    editedById: null,
    approvalStatus: "APPROVED" as const,
    tags: [],
    ...overrides,
  };
}

export function fakeBoard(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    tenantId: 1,
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    order: 0,
    slug: faker.lorem.slug(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function fakeTenant(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    customDomain: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function fakeTenantSettings(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    tenantId: 1,
    name: faker.company.name(),
    subdomain: faker.lorem.slug(),
    ...overrides,
  };
}
