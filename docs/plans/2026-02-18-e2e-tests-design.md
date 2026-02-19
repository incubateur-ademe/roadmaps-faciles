# Design : Suite E2E Playwright complète

**Date** : 2026-02-18
**Issue** : #47 — Tests : mise en place unit, intégration et e2e
**Branche** : `feat/tests`

## Décisions

| Sujet | Choix |
|-------|-------|
| Multi-tenant | Header `x-forwarded-host` injecté par Playwright (pas de DNS) |
| Auth externe (OAuth, WebAuthn) | Skip — tester l'UI uniquement, `/api/test-auth` bypass l'auth |
| Test seed | Enrichir `prisma/test-seed.ts` avec données variées |
| Granularité | Parcours utilisateur par domaine fonctionnel |
| Structure fichiers | Par domaine fonctionnel (~14 fichiers) |
| Tenant E2E | Subdomain `"e2e"`, host `e2e.localhost:3000` |

## Infrastructure

### Test seed enrichi (`prisma/test-seed.ts`)

Données existantes (inchangées) :
- 1 tenant (subdomain: `"e2e"`, au lieu de `config.seed.tenantSubdomain`)
- 1 user admin (`test-admin@test.local`, role ADMIN, membership OWNER)
- 1 board ("Test Board", slug `test-board`)
- 1 post approved ("Test Post", slug `test-post`)

Données ajoutées :
- **User moderator** : `test-mod@test.local`, role USER global, membership MODERATOR sur le tenant
- **User simple** : `test-user@test.local`, role USER global, membership USER
- **Post PENDING** : "Pending Post", `approvalStatus: PENDING`, slug `pending-post`
- **Post REJECTED** : "Rejected Post", `approvalStatus: REJECTED`, slug `rejected-post`
- **2 statuts custom** : "En cours" (blueFrance), "Terminé" (greenBourgeon)
- **1 invitation** en attente : `invited@test.local`
- **2e board** : "Second Board", slug `second-board`
- **AppSettings** singleton (déjà dans le seed existant)

### Auth setup (`tests/teste2e/auth.setup.ts`)

3 authentifications distinctes via `/api/test-auth` :
- `admin.json` — `test-admin@test.local`
- `mod.json` — `test-mod@test.local`
- `user.json` — `test-user@test.local`

### Fixtures custom (`tests/teste2e/fixtures.ts`)

Étend `test` de Playwright avec :
- Re-export `test` et `expect` pour usage dans tous les spec files
- Fixtures optionnelles si nécessaire (helpers de navigation tenant)

## Configuration Playwright

```
projects:
  setup            → auth.setup.ts (crée 3 storageStates)
  root-auth        → admin.json, pas de header tenant
                     Fichiers : root-admin, profile
  tenant-admin     → admin.json + x-forwarded-host: e2e.localhost:3000
                     Fichiers : tenant-admin, tenant-admin-extras, board, moderation
  tenant-mod       → mod.json + x-forwarded-host: e2e.localhost:3000
                     Fichiers : moderation
  tenant-user      → user.json + x-forwarded-host: e2e.localhost:3000
                     Fichiers : post, search, i18n
  unauthenticated  → pas de storageState
                     Fichiers : health, home, auth, routing, api
  mobile           → user.json + Pixel 5 + x-forwarded-host: e2e.localhost:3000
                     Fichiers : home, board, post
```

## Structure des fichiers

```
tests/teste2e/
├── auth.setup.ts                  # 3 auth states
├── fixtures.ts                    # Custom test extend
├── .auth/                         # gitignored sauf .gitkeep
│
├── health.spec.ts                 # (existant) GET /api/healthz
├── home.spec.ts                   # (existant, enrichi) Home root
├── auth.spec.ts                   # Login root, login tenant, 2FA UI, erreur
├── post.spec.ts                   # Submit, détail, modal, vote, commentaires, anonyme
├── board.spec.ts                  # (réécrit) Posts affichés, toggle cards/list, navigation
├── moderation.spec.ts             # File pending, approve, reject, page rejected
├── tenant-admin.spec.ts           # Boards CRUD, statuts, users, invitations, general, auth settings
├── root-admin.spec.ts             # Dashboard, tenants, users, sécurité, audit log
├── tenant-admin-extras.spec.ts    # Webhooks, API keys, audit log tenant, roadmap config
├── profile.spec.ts                # Profil, page sécurité
├── search.spec.ts                 # Recherche globale
├── i18n.spec.ts                   # Switch langue
├── routing.spec.ts                # Multi-tenant, stats, roadmap, erreur
└── api.spec.ts                    # Domain check, subdomain check
```

## Détail des tests par fichier

### `auth.spec.ts` (unauthenticated, 4 tests)
1. Page login root affiche le bouton de connexion Espace Membre
2. Page login tenant affiche les providers SSO configurés
3. Page 2FA est accessible (UI seulement, pas de flow complet)
4. Page erreur login affiche un message d'erreur

### `post.spec.ts` (tenant-user, 6 tests)
1. Soumettre un post via le formulaire sur un board
2. Voir le détail d'un post (page complète)
3. Post s'ouvre en modal interceptée depuis le board
4. Voter (like) sur un post — compteur incrémente
5. Ajouter un commentaire sur un post
6. Post anonyme (du seed) est visible sans user affiché

### `board.spec.ts` (tenant-admin, 3 tests)
1. Board affiche les posts approved (pas les pending)
2. Toggle vue cards ↔ list via paramètre URL
3. Navigation entre les 2 boards du seed

### `moderation.spec.ts` (tenant-admin + tenant-mod, 4 tests)
1. File d'attente affiche les posts PENDING
2. Approuver un post → il disparaît de la file
3. Rejeter un post → il apparaît dans /moderation/rejected
4. Badge compteur modération visible dans le menu

### `tenant-admin.spec.ts` (tenant-admin, 6 tests)
1. Créer un nouveau board depuis l'admin
2. Gérer les statuts : les 2 statuts du seed sont visibles
3. Liste des membres du tenant avec rôles
4. Changer le rôle d'un membre (user → moderator)
5. Envoyer une invitation email
6. Page settings général accessible et affiche le nom du tenant

### `root-admin.spec.ts` (root-auth, 5 tests)
1. Dashboard affiche la liste des tenants
2. Créer un nouveau tenant
3. Page détail d'un user accessible
4. Audit log affiche des entrées
5. Page sécurité (force 2FA) accessible

### `tenant-admin-extras.spec.ts` (tenant-admin, 4 tests)
1. Page webhooks est accessible
2. Page API keys est accessible
3. Audit log tenant affiche des entrées
4. Page roadmap config est accessible

### `profile.spec.ts` (root-auth, 2 tests)
1. Page profil affiche les infos de l'utilisateur
2. Page sécurité est accessible (section passkeys/OTP visible)

### `search.spec.ts` (tenant-user, 1 test)
1. Recherche un terme → retourne des résultats

### `i18n.spec.ts` (tenant-user, 2 tests)
1. Switch de fr → en via le sélecteur de langue
2. Contenu de la page change après le switch

### `routing.spec.ts` (unauthenticated, 4 tests)
1. Accès au tenant via header x-forwarded-host retourne le bon contenu
2. Page /stats est accessible
3. Page /roadmap du tenant est accessible
4. Page d'erreur affiche un message

### `api.spec.ts` (unauthenticated, 2 tests)
1. POST /api/domains/check retourne un résultat
2. POST /api/subdomain/check retourne un résultat

### `home.spec.ts` (existant, enrichi — unauthenticated, 3 tests)
Inchangé.

### `health.spec.ts` (existant — unauthenticated, 1 test)
Inchangé.

**Total : 47 tests, 14 fichiers**

## Ce qui n'est PAS couvert (choix explicites)

- Flows OAuth complets (GitHub, Google, ProConnect) — services externes
- Flows WebAuthn/passkey — nécessite hardware/émulation
- Flows OTP complets — nécessite TOTP secret
- SSO Bridge root → tenant — complexe, testé en intégration plutôt
- Email sending vérification — couvert par tests unitaires du mailer
- Prisma Studio embed — page proxy, pas de valeur E2E
