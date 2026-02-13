# ADR 0014 — Journal d'audit des opérations admin
- **Date**: 2026-02-13
- **Statut**: Accepted

## Contexte
  - Le projet ne disposait d'aucun mécanisme centralisé de traçabilité des actions admin (seul `PostStatusChange` traçait les changements de statut de posts).
  - Pour des raisons de conformité et de sécurité, toutes les opérations admin (tenant-scoped et root-scoped) doivent être tracées : identité utilisateur, IP, user-agent, succès/échec, cible de l'action.
  - Le journal doit être consultable depuis les interfaces admin (tenant et root) avec filtres et pagination.

## Décision
  - Créer un modèle Prisma `AuditLog` **sans foreign keys** (pas de relation vers `User` ni `Tenant`). Les logs survivent à la suppression des entités référencées.
  - Instrumenter au niveau des **server actions** (pas middleware, pas use cases) via un utilitaire fire-and-forget `audit()` dans `src/lib/utils/audit.ts`.
  - Capturer le contexte HTTP (`IP`, `User-Agent`) via `getRequestContext()` qui lit les headers Next.js. Cette fonction doit être appelée **avant** le try/catch et les early returns de validation, pour que tous les chemins (succès, échec, validation refusée) soient auditables.
  - `audit()` est fire-and-forget (`void`, `.catch()` silencieux) : l'audit ne doit jamais bloquer ni faire échouer l'opération métier.
  - `AuditInput.metadata` accepte `Record<string, unknown>` (plus souple que `Prisma.InputJsonValue`) ; le cast se fait en interne dans `audit()`.
  - Fournir des pages de consultation dans les deux interfaces admin (tenant : filtré par `tenantId`, root : vue globale avec filtre tenant optionnel), avec filtres par action, date, et pagination DSFR.

## Options envisagées
  - **Option A — Middleware global** : intercepte toutes les requêtes. Trop générique : pas de contexte métier (quel use case, quelle entité), pas de distinction succès/échec de l'opération. Bruité (intercepte aussi les navigations, assets, etc.).
  - **Option B — Instrumentation dans les use cases** : les use cases ne disposent pas du contexte HTTP (IP, UA) ni de la session NextAuth. Il faudrait propager ces informations à travers toute la stack, ce qui viole la séparation des responsabilités.
  - **Option C — Instrumentation dans les server actions (retenue)** : les server actions disposent de tout le contexte nécessaire — session auth, tenant résolu, headers HTTP, résultat de l'opération (succès/échec). L'instrumentation est explicite et locale à chaque action.

## Conséquences
  - Chaque nouvelle server action admin doit être instrumentée manuellement (pas d'automatisation). C'est un compromis accepté pour garder un contrôle fin sur les données auditées.
  - Les index composites `(tenantId, createdAt)`, `(userId, createdAt)`, `(action, createdAt)` et `(createdAt)` optimisent les requêtes paginées avec filtres.
  - Le batch lookup des utilisateurs dans le repository (via `Map`) évite les N+1 queries sans nécessiter de FK.
  - ~30 actions sont instrumentées dans 13 fichiers (9 tenant-scoped, 4 root-scoped).

## Liens
  - `src/lib/utils/audit.ts` — utilitaire fire-and-forget
  - `src/lib/repo/IAuditLogRepo.ts` / `src/lib/repo/impl/AuditLogRepoPrisma.ts` — repository
  - `prisma/schema.prisma` — modèle `AuditLog`
  - `src/app/[domain]/(domain)/(authenticated)/admin/audit-log/` — page tenant
  - `src/app/(default)/(authenticated)/admin/audit-log/` — page root
