# ADR 0018 — Double authentification (2FA) et OAuth SSO multi-tenant
- **Date**: 2026-02-17
- **Statut**: Accepted

## Contexte
  - L'application gère des espaces de travail multi-tenant avec des données sensibles (roadmaps, membres, paramètres). L'authentification reposait uniquement sur des magic links (email) et le pont SSO Espace Membre. Les administrateurs n'avaient aucun moyen d'imposer un second facteur d'authentification, et les utilisateurs ne pouvaient pas se connecter via des fournisseurs OAuth tiers.

## Décision
  - Implémenter trois méthodes de double authentification (passkey WebAuthn, OTP TOTP, email) avec possibilité pour les administrateurs d'imposer la 2FA (force 2FA) avec une période de grâce configurable.
  - Ajouter le support OAuth SSO (GitHub, Google, ProConnect) activable par tenant depuis l'interface d'administration.

### 2FA — Preuve server-side via Redis
  - Chaque endpoint de vérification 2FA (`/api/webauthn/authenticate/verify`, `/api/otp/verify`, `/api/2fa/email/verify`) stocke une preuve éphémère dans Redis (`2fa:proof:{userId}`, TTL 60 secondes) après validation réussie.
  - Le client appelle `session.update()` ; le callback JWT vérifie et consomme la preuve Redis avant de marquer `twoFactorVerified: true` dans le token.
  - Ce mécanisme empêche un client de marquer arbitrairement sa session comme vérifiée sans avoir complété la vérification côté serveur.

### 2FA — Force 2FA et période de grâce
  - Les administrateurs (root et tenant) peuvent activer le force 2FA avec une période de grâce de 0 à 5 jours.
  - La deadline est persistée en base (`User.twoFactorDeadline`), évaluée à chaque création de session JWT.
  - Configurer une méthode 2FA annule la deadline. Désactiver le force 2FA efface toutes les deadlines en attente.

### OAuth — Architecture multi-tenant
  - Les fournisseurs sont configurés globalement via des variables d'environnement (`OAUTH_GITHUB_CLIENT_ID`, etc.) mais activables indépendamment par tenant.
  - Les providers activés sont validés côté serveur contre une whitelist (`VALID_OAUTH_PROVIDERS`).
  - OAuth est bloqué sur le domaine racine (réservé aux tenants).

## Options envisagées
  - **2FA côté client uniquement** (flag dans `session.update()` sans preuve server-side) — Rejeté : un client malveillant pourrait marquer sa session comme vérifiée sans compléter la 2FA.
  - **2FA via middleware** (vérification dans `src/proxy.ts`) — Rejeté : le proxy n'a pas accès à la session NextAuth ni aux données utilisateur.
  - **OAuth global** (tous les providers actifs partout) — Rejeté : chaque tenant a des besoins différents ; l'activation par tenant offre plus de flexibilité.
  - **Stockage 2FA proof en base** (au lieu de Redis) — Rejeté : la preuve est éphémère (60s), Redis est plus adapté et déjà utilisé pour les challenges WebAuthn et codes email.

## Conséquences
  - Redis devient une dépendance critique pour le flux 2FA (déjà requis pour le caching).
  - Le modèle `User` gagne les champs `twoFactorEnabled`, `twoFactorDeadline`, `emailTwoFactorEnabled`, `otpSecret`, `otpVerifiedAt`.
  - Le modèle `Authenticator` stocke les credentials WebAuthn.
  - Les modèles `AppSettings` et `TenantSettings` gagnent `force2FA` et `force2FAGraceDays`.
  - Le modèle `TenantDefaultOAuth` stocke les providers OAuth activés par tenant.
  - `DefaultAuthenticatedLayout` lit le header `x-pathname` (injecté dans `src/proxy.ts`) pour éviter les boucles de redirection entre la page de setup 2FA et la page de vérification.

## Liens
  - PR #11 : feat(auth): 2FA (passkey/OTP/email), OAuth SSO tenants, refresh token
  - PR #61 : review et corrections de sécurité
  - WebAuthn : `@simplewebauthn/server` + `@simplewebauthn/browser`
  - OTP : `otplib` (TOTP)
  - ADR 0017 : templates email DSFR (utilisés pour les codes 2FA par email)
