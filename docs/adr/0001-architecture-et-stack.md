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

---

## Mise à jour — 2026-02-08 (post PR #18)

Le stack a évolué depuis la rédaction initiale :

| Composant | ADR initial | État actuel |
|-----------|-------------|-------------|
| Next.js | 15.5.x | **16** (App Router, standalone output) |
| Prisma | (non précisé) | **7** — client auto-généré dans `src/generated/prisma/` |
| Tailwind | (non précisé) | **CSS 4** |
| React | (implicite) | **React Compiler** activé |
| Zod | v4 | v4 (inchangé) |

Autres évolutions notables :
- Le pattern **Use Case** a été formalisé (interface `UseCase<TRequest, TResponse>`, classes avec injection de repos, validation Zod en entrée). Cf. `src/useCases/`.
- Le type **`ServerActionResponse<T>`** standardise les retours des server actions (`{ ok: true, data } | { ok: false, error }`).
- Migration CI de yarn vers **pnpm**.
