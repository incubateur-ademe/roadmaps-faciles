# ADR 0019 — Infrastructure de tests : Vitest + Playwright, architecture 3 couches
- **Date**: 2026-02-19
- **Statut**: Accepted

## Contexte
  - Le projet n'avait aucun test automatisé. L'ajout de fonctionnalités (2FA, OAuth, modération, multi-tenant) rendait les régressions manuelles de plus en plus coûteuses.
  - L'architecture use-case / repo / service se prête bien à des tests à plusieurs niveaux d'abstraction.

## Décision
  - **Vitest** pour les tests unitaires et d'intégration (compatibilité native ESM, vitesse, config TS).
  - **Playwright** pour les tests E2E (multi-navigateur, support natif multi-projet).
  - **3 couches de tests** dans `tests/` :
    - `testu/` — tests unitaires : logique pure, schémas Zod, utilitaires. Pas de mocks, pas de DB.
    - `testi/` — tests d'intégration : use cases avec mocks in-memory des repos/services. Vérifient la logique métier sans dépendance DB.
    - `testdb/` — tests d'intégration DB : repos Prisma contre une vraie base PostgreSQL (`DATABASE_URL_TEST`). Config Vitest séparée (`vitest.config.db.ts`).
  - **E2E** (`teste2e/`) : 7 projets Playwright (root-auth, tenant-admin, tenant-mod, tenant-user, unauthenticated, mobile, setup).
  - **Auth E2E** : route `POST /api/test-auth` (dev-only) qui crée une session via `signIn("credentials")` pour les utilisateurs de test, évitant de passer par le flow complet magic link.
  - **Seed E2E** : `prisma/test-seed.ts` — données prédictibles (3 users, 2 boards, 4 posts, statuses).
  - **Résolution DNS E2E** : `e2e.localhost` résolu via `--host-resolver-rules` Chromium (pas de `/etc/hosts`).
  - **CI** : GitHub Actions avec services PostgreSQL, Redis, Maildev.

## Options envisagées
  - **Jest** — écosystème mature, mais configuration ESM lourde avec Next.js 16 + TypeScript paths. Vitest est nativement compatible.
  - **Cypress** — bon DX mais architecture single-tab, moins adapté au multi-domaine (root → tenant bridge). Playwright supporte nativement les projets multi-domaines.
  - **Tests unitaires seuls** — insuffisants pour valider les flows multi-tenant et l'auth bridge cross-domain.
  - **Tests E2E seuls** — trop lents pour couvrir la logique métier détaillée (validation Zod, use cases). La couche `testi/` avec mocks offre un bon compromis vitesse/couverture.

## Conséquences
  - Les repos doivent exposer une interface (`IXxxRepo`) pour être mockables dans `testi/`.
  - Le seed E2E (`test-seed.ts`) doit rester synchronisé avec les tests — tout changement de données peut casser des assertions.
  - La route `/api/test-auth` ne doit JAMAIS être exposée en production (gardée par `process.env.NODE_ENV !== "production"`).
  - Les tests DB nécessitent une base PostgreSQL dédiée (`DATABASE_URL_TEST`) — le workflow CI utilise un service container.

## Liens
  - PR #47 (feat/tests)
  - `docs/plans/2026-02-18-e2e-tests-design.md` — design initial des 47 tests E2E
  - `vitest.config.ts`, `vitest.config.db.ts`, `playwright.config.ts`
