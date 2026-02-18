# Master Plan — Tests Kokatsuna/Roadmaps Faciles

## État actuel

- **125 tests** (99 unitaires + 26 intégration) — 12 fichiers
- **3 tests E2E** smoke (health, home, board placeholder)
- **6 use cases couverts** sur 55 implémentés (11%)
- **Coverage** : utils (string, date, function, error, dirtyDomain), model (Post), use cases (SubmitPost, ApprovePost, CreateBoard, UpdateMemberRole, CreateNewTenant, AbstractCacheUseCase)

## Vue d'ensemble des 6 plans

| # | Plan | Objectif | Tests estimés |
|---|------|----------|---------------|
| 1 | Fix sécurité UpdateMemberRole | Corriger le bug + ajouter le test | ~3 |
| 2 | Validation Zod des inputs | Tester les schemas Zod des use cases critiques | ~60 |
| 3 | Use cases manquants | Couvrir les use cases à logique métier | ~80 |
| 4 | E2E réels | Flows complets avec auth et seed fonctionnel | ~15 |
| 5 | Seuils de couverture | Configurer les thresholds + CI enforcement | ~0 (config) |
| 6 | Tests d'intégration DB (repos) | Tester les repos Prisma contre PostgreSQL réel | ~40 |

**Total estimé : ~200 nouveaux tests → ~325 tests au total**

---

## Plan 1 — Fix sécurité UpdateMemberRole

### Contexte
CLAUDE.md (section Security) : "UpdateMemberRole blocks setting role to OWNER/INHERITED, not just checking current role". L'implémentation actuelle ne bloque que `INHERITED` comme rôle cible. `OWNER` est autorisé, ce qui est un gap de sécurité.

### Tâches

1. **Modifier `src/useCases/user_on_tenant/UpdateMemberRole.ts`**
   - Ajouter la validation : `if (input.role === UserRole.OWNER) throw new Error("Rôle cible non autorisé.")`
   - Placer le check juste après celui de `INHERITED` (ligne ~27)

2. **Vérifier `src/useCases/user_on_tenant/UpdateMemberStatus.ts`** (même pattern)
   - Lire le code, vérifier que le blocage de status OWNER est géré
   - Ajouter une validation si manquante

3. **Vérifier `src/useCases/user_on_tenant/RemoveMember.ts`**
   - Lire le code, vérifier la protection du dernier OWNER (transaction TOCTOU)

4. **Ajouter les tests**
   - `UpdateMemberRole.test.ts` : ajouter test "throws when target role is OWNER"
   - Nouveau fichier `tests/testi/user_on_tenant/UpdateMemberStatus.test.ts` :
     - Changement de statut réussi (ACTIVE → BLOCKED)
     - Erreur si membre introuvable
     - Erreur si on bloque le dernier OWNER
   - Nouveau fichier `tests/testi/user_on_tenant/RemoveMember.test.ts` :
     - Suppression réussie
     - Erreur si membre introuvable
     - Erreur si on retire le dernier OWNER

5. **Supprimer le TODO** dans `UpdateMemberRole.test.ts`

### Vérification
- `pnpm test` → tous les tests passent (dont le nouveau test OWNER target qui échouait avant le fix)
- `pnpm lint --fix` → 0 erreur

---

## Plan 2 — Validation Zod des inputs

### Contexte
Les schemas Zod des use cases ont des `.refine()`, `.min()`, `.regex()`, `.email()`, `.url()`, `.default()` qui ne sont testés qu'indirectement via les tests d'intégration. Des tests unitaires dédiés sur la validation couvrent les edge cases de manière plus fiable.

### Structure
Nouveau dossier : `tests/testu/validation/`

### Fichiers à créer

1. **`tests/testu/validation/SubmitPostInput.test.ts`**
   - Données valides avec userId
   - Données valides avec anonymousId
   - Rejet si ni userId ni anonymousId (`.refine()`)
   - Rejet si title < 3 caractères (`.min(3)`)
   - description optionnel (accepte undefined)
   - boardId et tenantId obligatoires

2. **`tests/testu/validation/ApprovePostInput.test.ts`**
   - Données valides
   - Rejet si postId manquant
   - Rejet si tenantId manquant

3. **`tests/testu/validation/RejectPostInput.test.ts`** (identique à Approve en structure)

4. **`tests/testu/validation/DeletePostInput.test.ts`**

5. **`tests/testu/validation/UpdatePostContentInput.test.ts`**
   - title obligatoire
   - description, tags optionnels
   - editedById obligatoire

6. **`tests/testu/validation/CreateBoardInput.test.ts`**
   - name `.min(1)`
   - description optionnel
   - tenantId obligatoire

7. **`tests/testu/validation/CreateNewTenantInput.test.ts`**
   - subdomain doit matcher `/^[a-z0-9-]+$/`
   - ownerEmails `.min(1)` + `.email()`
   - Rejet subdomain avec majuscules, espaces, caractères spéciaux

8. **`tests/testu/validation/UpdateMemberRoleInput.test.ts`**
   - role doit être dans `userRoleEnum`
   - userId string obligatoire
   - tenantId number obligatoire

9. **`tests/testu/validation/SendInvitationInput.test.ts`**
   - email `.email()`
   - tenantUrl `.url()`
   - role optionnel, default "USER"
   - Rejet email invalide, URL invalide

10. **`tests/testu/validation/LikePostInput.test.ts`**
    - Refine : userId ou anonymousId requis
    - postId et tenantId obligatoires

11. **`tests/testu/validation/CreateWebhookInput.test.ts`**
    - url `.url()`
    - event doit être dans l'enum des événements webhook
    - Rejet URL invalide, événement inconnu

12. **`tests/testu/validation/ChangePostStatusInput.test.ts`**
    - fromStatusId et toStatusId obligatoires
    - userId et tenantId obligatoires

### Helpers
- Créer `tests/testu/validation/_helpers.ts` avec une fonction `expectZodSuccess(schema, data)` / `expectZodFailure(schema, data, path?)` pour factoriser les assertions Zod.

### Vérification
- `pnpm test` → tous passent
- `pnpm lint --fix` → 0 erreur

---

## Plan 3 — Use cases manquants

### Contexte
6 use cases testés sur 55 (11%). On cible les use cases avec de la **logique métier** (pas les simples CRUD de lecture). Cela exclut les `List*`, `Get*` (pas de logique, juste un appel repo) et les `NotImplemented` (3 stubs).

### Use cases à tester (par priorité)

#### Posts (logique d'approbation, sécurité multi-tenant)
1. **`RejectPost`** — Symétrique d'ApprovePost. Fichier : `tests/testi/posts/RejectPost.test.ts`
   - Rejet réussi d'un post PENDING
   - Erreur si post introuvable
   - Erreur si post n'appartient pas au tenant
   - Erreur si post pas en PENDING

2. **`DeletePost`** — Validation tenant. Fichier : `tests/testi/posts/DeletePost.test.ts`
   - Suppression réussie
   - Erreur si post introuvable
   - Erreur si post n'appartient pas au tenant

3. **`UpdatePostContent`** — Validation tenant + édition. Fichier : `tests/testi/posts/UpdatePostContent.test.ts`
   - Mise à jour réussie (titre, description, tags)
   - Erreur si post introuvable
   - Erreur si post n'appartient pas au tenant
   - Sets editedAt et editedById

#### Boards
4. **`DeleteBoard`** — Conditions de suppression. Fichier : `tests/testi/boards/DeleteBoard.test.ts`
   - Suppression réussie d'un board vide
   - Erreur si board a des posts
   - Erreur si board est le root board du tenant

5. **`UpdateBoard`** — Simple CRUD. Fichier : `tests/testi/boards/UpdateBoard.test.ts`
   - Mise à jour réussie
   - Erreur si board introuvable

6. **`ReorderBoards`** — Fichier : `tests/testi/boards/ReorderBoards.test.ts`
   - Réordonnancement réussi
   - Appelle repo.reorder avec les bons items

#### Comments
7. **`AddCommentToPost`** — Fichier : `tests/testi/comments/AddCommentToPost.test.ts`
   - Ajout réussi
   - Données correctement passées au repo

8. **`DeleteComment`** — Fichier : `tests/testi/comments/DeleteComment.test.ts`
   - Suppression réussie

#### Invitations
9. **`SendInvitation`** — Logique complexe (vérif doublon, token, email). Fichier : `tests/testi/invitations/SendInvitation.test.ts`
   - Envoi réussi (crée invitation + envoie email)
   - Erreur si utilisateur déjà membre
   - Erreur si utilisateur bloqué/supprimé
   - Erreur si invitation déjà en attente
   - Remplace une invitation acceptée précédente
   - **Note** : nécessite mock de `prisma` (accès direct), `sendEmail`, `renderInvitationEmail`, `getEmailTranslations`

10. **`RevokeInvitation`** — Fichier : `tests/testi/invitations/RevokeInvitation.test.ts`
    - Révocation réussie
    - Erreur si invitation introuvable
    - Erreur si invitation déjà acceptée

#### Likes
11. **`LikePost`** — Fichier : `tests/testi/likes/LikePost.test.ts`
    - Like par utilisateur authentifié
    - Like par visiteur anonyme
    - Données correctement passées au repo

12. **`UnlikePost`** — Fichier : `tests/testi/likes/UnlikePost.test.ts`
    - Unlike par utilisateur
    - Unlike par visiteur anonyme

#### Tenant
13. **`DeleteTenant`** — Sécurité owner-only + cleanup domaine/DNS. Fichier : `tests/testi/tenant/DeleteTenant.test.ts`
    - Suppression réussie par un OWNER
    - Cleanup domaine + DNS appelé
    - DNS failure non-bloquant

14. **`UpdateTenantDomain`** — Provisioning domaine/DNS. Fichier : `tests/testi/tenant/UpdateTenantDomain.test.ts`
    - Mise à jour subdomain
    - Mise à jour custom domain
    - Ancien domaine supprimé, nouveau ajouté

#### User on Tenant
15. **`RemoveMember`** — Protection dernier OWNER. Fichier : `tests/testi/user_on_tenant/RemoveMember.test.ts`
    - (déjà planifié dans Plan 1)

16. **`UpdateMemberStatus`** — Protection dernier OWNER. Fichier : `tests/testi/user_on_tenant/UpdateMemberStatus.test.ts`
    - (déjà planifié dans Plan 1)

#### Post Statuses
17. **`CreatePostStatus`** — Auto-order. Fichier : `tests/testi/post_statuses/CreatePostStatus.test.ts`
    - Création avec ordre auto-incrémenté
    - Ordre 0 si aucun status existant

18. **`DeletePostStatus`** — Condition: pas de posts liés. Fichier : `tests/testi/post_statuses/DeletePostStatus.test.ts`
    - Suppression réussie
    - Erreur si des posts utilisent ce status

#### Cache
19. **`GetTenantForDomain`** — Cache 1h + résolution subdomain/custom. Fichier : `tests/testi/tenant/GetTenantForDomain.test.ts`
    - Résolution par subdomain
    - Résolution par custom domain
    - Cache hit (second appel sans exécution)

### Helpers à enrichir
- Ajouter dans `tests/testi/helpers.ts` : `createMockCommentRepo()`, `createMockLikeRepo()`, `createMockPostStatusRepo()`, `createMockFollowRepo()`, `createMockPostStatusChangeRepo()`, `fakeComment()`, `fakeLike()`, `fakePostStatus()`, `fakeInvitation()`

### Vérification
- `pnpm test` → tous passent
- `pnpm lint --fix` → 0 erreur

---

## Plan 4 — E2E réels

### Contexte
Les 3 tests E2E actuels sont des smoke tests sans authentification. Pour valider des flows utilisateur réels, il faut :
1. Un seed de test fonctionnel en CI
2. Un mécanisme d'authentification en test (bypass ou magic link)
3. Des flows complets multi-pages

### Prérequis
- Vérifier que `prisma/test-seed.ts` fonctionne (exécuter localement)
- Analyser le flow d'auth pour trouver un moyen de s'authentifier en test (cookies, bridge credentials, ou injection directe de session)

### Stratégie d'authentification E2E
Option recommandée : **direct session injection via API route de test** :
- Créer `src/app/api/test-auth/route.ts` (conditionné par `APP_ENV === "dev"` ou `process.env.E2E_TEST`)
- Cette route crée une session NextAuth pour un utilisateur donné et retourne le cookie
- Playwright appelle cette route avant les tests authentifiés

### Fichiers E2E à créer/modifier

1. **`tests/teste2e/auth.setup.ts`** — Setup Playwright pour l'authentification
   - Appelle la route de test pour obtenir une session
   - Stocke le `storageState` (cookies) dans un fichier partagé
   - Utilisé comme `setup` project dans `playwright.config.ts`

2. **`tests/teste2e/health.spec.ts`** — (existant, pas de changement)

3. **`tests/teste2e/home.spec.ts`** — Enrichir :
   - Vérifier le contenu du header (nom de marque)
   - Vérifier le footer DSFR

4. **`tests/teste2e/board.spec.ts`** — Flow complet :
   - Naviguer vers un board
   - Vérifier que les posts seedés sont affichés
   - Créer un nouveau post (formulaire)
   - Vérifier que le post apparaît dans la liste

5. **`tests/teste2e/post.spec.ts`** — Nouveau :
   - Naviguer vers un post existant
   - Ajouter un commentaire
   - Liker le post
   - Vérifier le compteur de likes

6. **`tests/teste2e/moderation.spec.ts`** — Nouveau :
   - Créer un post (sur un tenant avec `requirePostApproval: true`)
   - Vérifier qu'il n'apparaît pas dans le board
   - Aller dans l'interface de modération
   - Approuver le post
   - Vérifier qu'il apparaît dans le board

7. **`tests/teste2e/admin.spec.ts`** — Nouveau :
   - Accéder au panneau admin
   - Vérifier la liste des membres
   - Vérifier la page des boards

### Modifications
- `playwright.config.ts` : ajouter le projet `setup` pour l'auth
- `prisma/test-seed.ts` : enrichir avec données de modération (tenant avec `requirePostApproval: true`, post PENDING)

### Vérification
- `pnpm test:e2e` → tous les tests passent localement (avec dev server)
- Les tests doivent être idempotents (seed de test exécuté avant chaque suite)

---

## Plan 5 — Seuils de couverture

### Contexte
Après les plans 1-4, la couverture sera significative. Il faut configurer des seuils minimaux pour empêcher les régressions et rendre la CI bloquante.

### Tâches

1. **Exécuter `pnpm test:coverage`** pour obtenir la baseline actuelle

2. **Configurer les seuils dans `vitest.config.ts`** :
   ```ts
   coverage: {
     thresholds: {
       // Seuils globaux (à ajuster selon la baseline)
       lines: 30,
       functions: 40,
       branches: 30,
       statements: 30,
     },
     // Seuils par dossier pour les zones critiques
     '100': {
       'src/useCases/**': {
         functions: 60,
         branches: 60,
       },
       'src/lib/utils/**': {
         functions: 80,
         branches: 70,
       },
     },
   }
   ```

3. **Mettre à jour le CI** (`.github/workflows/test.yml`) :
   - Ajouter un step `pnpm test:coverage` qui échoue si les seuils ne sont pas atteints (comportement par défaut de vitest avec thresholds)
   - Ajouter un commentaire de couverture sur les PRs (optionnel, via `vitest-coverage-report` action)

4. **Ajouter un script** `"test:ci": "vitest run --coverage"` dans `package.json` pour la CI

5. **Documenter** les seuils dans CLAUDE.md (section Testing)

### Vérification
- `pnpm test:coverage` → rapport généré avec seuils
- CI bloquante si couverture sous les seuils

---

## Plan 6 — Tests d'intégration DB (repos)

### Contexte
Les tests actuels mockent les repos. Les tests DB testent les implémentations Prisma réelles contre PostgreSQL. Cela détecte les bugs de requêtes (joins incorrects, contraintes FK, transactions).

### Infrastructure

1. **Base de données de test dédiée**
   - Nom : `roadmaps-faciles-test`
   - Variable d'env : `DATABASE_URL_TEST` (ou réutiliser `DATABASE_URL` en test)
   - Setup : `prisma db push` (pas de migrations, schéma direct)

2. **Fichier de setup** : `tests/testdb/setup.ts`
   - Connexion à la DB de test
   - `beforeAll` : `prisma db push --force-reset` (reset schema)
   - `afterAll` : `prisma.$disconnect()`
   - `beforeEach` : nettoyage des tables (transaction DELETE en cascade)

3. **Config Vitest séparée** : `vitest.config.db.ts`
   - Include : `tests/testdb/**/*.test.ts`
   - Setup : `tests/testdb/setup.ts`
   - `pool: "forks"` (isolation des tests DB — pas de shared state)
   - Timeout plus long (10s par test)

4. **Script** : `"test:db": "vitest run --config vitest.config.db.ts"`

### Repos à tester (priorité = complexité des requêtes)

1. **`tests/testdb/repos/TenantRepoPrisma.test.ts`**
   - `create()` → vérifie l'auto-increment
   - `findBySubdomain()` → vérifie la résolution via TenantSettings
   - `findByCustomDomain()` → idem
   - `findAllWithSettings()` → vérifie le join complexe (settings + members + count)
   - `findAllForUser()` → vérifie le join via userOnTenant

2. **`tests/testdb/repos/UserOnTenantRepoPrisma.test.ts`**
   - `findMembership()` → composite key
   - `findByUserIdWithSettings()` → join profond tenant → settings
   - `countOwners()` → filtre role + status
   - `update()` → composite key update

3. **`tests/testdb/repos/PostRepoPrisma.test.ts`**
   - `create()` avec toutes les FK (board, tenant, user)
   - `findById()` avec includes
   - `update()` → vérifie que seuls les champs passés sont modifiés

4. **`tests/testdb/repos/BoardRepoPrisma.test.ts`**
   - `findAllForTenant()` → ordre ASC
   - `reorder()` → transaction batch update
   - `findSlugById()` → select partiel

5. **`tests/testdb/repos/AuditLogRepoPrisma.test.ts`**
   - `findAll(filter)` → filtres dynamiques (date range, action, tenant)
   - `hydrateLogs()` → batch user lookup via Map (résolution du N+1)
   - Vérifie que les logs survivent à la suppression d'un user (pas de FK)

6. **`tests/testdb/repos/LikeRepoPrisma.test.ts`**
   - `create()` par userId et par anonymousId
   - `deleteByUserId()` → composite key
   - `deleteByAnonymousId()` → composite key
   - Vérifie l'unicité (pas de double like)

7. **`tests/testdb/repos/InvitationRepoPrisma.test.ts`**
   - `create()` avec tokenDigest
   - `findAllForTenant()` → ordre DESC
   - Vérifie l'unicité email + tenantId

### Helpers DB
- `tests/testdb/helpers.ts` : factories qui créent de vraies entités en DB (pas des fakes)
  - `createTestUser()`, `createTestTenant()`, `createTestBoard()`, `createTestPost()`
  - Chaque factory retourne l'entité créée en DB
  - Nettoyage automatique via le `beforeEach` du setup

### CI
- Ajouter un job `db-tests` dans `.github/workflows/test.yml` :
  - Service PostgreSQL
  - `pnpm prisma db push`
  - `pnpm test:db`

### Vérification
- `pnpm test:db` → tous passent (nécessite PostgreSQL local)
- CI → job `db-tests` passe avec service container
