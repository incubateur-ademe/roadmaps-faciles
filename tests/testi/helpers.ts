import { faker } from "@faker-js/faker";
import { type Mock, vi } from "vitest";

import { type IBoardRepo } from "@/lib/repo/IBoardRepo";
import { type ICommentRepo } from "@/lib/repo/ICommentRepo";
import { type IInvitationRepo } from "@/lib/repo/IInvitationRepo";
import { type ILikeRepo } from "@/lib/repo/ILikeRepo";
import { type IPostRepo } from "@/lib/repo/IPostRepo";
import { type IPostStatusChangeRepo } from "@/lib/repo/IPostStatusChangeRepo";
import { type IPostStatusRepo } from "@/lib/repo/IPostStatusRepo";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { type IUserRepo } from "@/lib/repo/IUserRepo";
import { type IWebhookRepo } from "@/lib/repo/IWebhookRepo";

type MockRepo<T> = { [K in keyof T]: Mock };

export function createMockPostRepo(): MockRepo<IPostRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findByBoardId: vi.fn(),
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
    findByEmailAndTenant: vi.fn(),
    findById: vi.fn(),
  };
}

export function createMockUserRepo(): MockRepo<IUserRepo> {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findAllWithTenantCount: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findByUsername: vi.fn(),
    searchByEmail: vi.fn(),
    update: vi.fn(),
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

export function createMockCommentRepo(): MockRepo<ICommentRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findAllForPost: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockLikeRepo(): MockRepo<ILikeRepo> {
  return {
    create: vi.fn(),
    deleteByAnonymousId: vi.fn(),
    deleteByUserId: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
  };
}

export function createMockPostStatusRepo(): MockRepo<IPostStatusRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findAllForTenant: vi.fn(),
    findById: vi.fn(),
    reorder: vi.fn(),
    update: vi.fn(),
  };
}

export function createMockPostStatusChangeRepo(): MockRepo<IPostStatusChangeRepo> {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
  };
}

export function createMockWebhookRepo(): MockRepo<IWebhookRepo> {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findAllForTenant: vi.fn(),
    findById: vi.fn(),
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
    deletedAt: null,
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

export function fakeComment(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    postId: faker.number.int({ min: 1, max: 100 }),
    userId: faker.string.uuid(),
    parentId: null,
    isPostUpdate: false,
    tenantId: 1,
    body: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function fakeLike(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    postId: faker.number.int({ min: 1, max: 100 }),
    tenantId: 1,
    userId: faker.string.uuid(),
    anonymousId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function fakePostStatus(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    tenantId: 1,
    name: faker.lorem.word(),
    color: "blueFrance",
    order: 0,
    showInRoadmap: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function fakeInvitation(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    tenantId: 1,
    email: faker.internet.email(),
    tokenDigest: faker.string.hexadecimal({ length: 64 }),
    role: "USER" as const,
    acceptedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}
