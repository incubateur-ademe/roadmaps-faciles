# ADR 0002 — Authentification avec NextAuth + Prisma
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Besoins d’auth standard, intégrée Next.js, persistée en DB. 
Besoin que l'auth soit compatible multi-tenant.
Besoin que l'auth puisse se faire via des providers externes (SSO, Google, etc.) et email/magic link.

## Décision
- **NextAuth** relié à **Prisma** en utilisant la table `User` existante.
- Stratégie **JWT** + callbacks alignés avec nos besoins multi-tenant.
- Pages personnalisées si nécessaire.

## Options envisagées
- Auth maison (bcrypt + sessions) : plus de maintenance.
- Auth0/Clerk : coût/lock-in.

## Conséquences
- Mise à jour du schéma Prisma si nécessaire (relations sessions/tokens).
- Tests d’intégration sur le flux login/out.

## Liens
- README (env NEXTAUTH_*), code d’intégration.
