# ADR 0009 — Invitation sécurisée par token SHA256
- **Date**: 2026-02-08
- **Statut**: Accepted

## Contexte
Le système d'invitation permet aux admins d'un tenant d'inviter des utilisateurs par email. Le lien d'invitation doit être sécurisé (non devinable, non extractible depuis la DB) et doit pouvoir contourner la politique d'inscription du tenant (`emailRegistrationPolicy`).

## Décision
- Génération d'un **token aléatoire** (`crypto.randomBytes(32)`) à l'envoi.
- Stockage uniquement du **digest SHA256** du token en base (`tokenDigest`), jamais le token en clair.
- Le token en clair est envoyé dans le lien email (`/login?invitation=<token>`).
- À la réception, le digest est recalculé côté serveur pour valider le token.
- **Bypass de politique** : une invitation pendante (`acceptedAt: null`) contourne `emailRegistrationPolicy` dans le callback `signIn` de NextAuth.
- **Acceptation atomique** : `updateMany` avec condition `acceptedAt: null` pour éviter les races conditions ; création automatique de la membership `UserOnTenant` (rôle `USER`).
- **Pré-vérifications** à l'envoi : utilisateur non déjà membre, pas d'invitation pendante existante, utilisateur non bloqué.

## Options envisagées
### Option A — Token stocké en clair
- ✅ Plus simple.
- ❌ Compromission DB = tokens exploitables.

### Option B — Token hashé SHA256 (**choisi**)
- ✅ DB compromise ≠ tokens exploitables (attaque par force brute irréaliste sur 32 bytes).
- ✅ Pattern standard (similaire aux reset password tokens).
- ⚠️ Légèrement plus de code.

### Option C — JWT signé
- ✅ Pas de stockage côté serveur.
- ❌ Irrévocable sans blacklist, plus complexe à valider.

## Conséquences
- Sécurité renforcée : même en cas de fuite DB, les tokens ne sont pas exploitables.
- Le lien d'invitation est à usage unique (marqué `acceptedAt` après acceptation).
- Le callback `signIn` de NextAuth a une logique en deux phases (verification request → magic link click).

## Liens
- PR #18
- `src/useCases/invitations/SendInvitation.ts`
- `src/app/[domain]/(domain)/login/page.tsx` (validation token)
- `src/lib/next-auth/auth.ts` (callback signIn, bypass policy, acceptation)
