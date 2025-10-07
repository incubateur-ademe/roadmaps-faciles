# ADR 0001 — Architecture et stack
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Application web moderne orientée produit, contributions bénévoles, besoin de cadence rapide et DX forte.

## Décision
- **Next.js 15.5.x** (App Router) avec **Server Actions** pour réduire la glue API.
- **TypeScript** strict.
- **Prisma** pour l’accès DB Postgres.
- **Zod v4** pour la validation et les DTO dans `lib/model`.
- **DSFR** + utilitaires **Tailwind** pour l’UI.
- DDD partiel avec repos et use cases.

## Options envisagées
- Remix/TantStack Start : écosystème moins aligné avec nos choix.
- tRPC/REST dédié : redondant avec Server Actions.

## Conséquences
- Courbe d’apprentissage App Router/Server Actions.
- Gain de vitesse sur le dev full-stack.

## Liens
- README, structure des dossiers.
