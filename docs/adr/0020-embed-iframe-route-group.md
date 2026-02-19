# ADR 0020 — Mode embed iframe (route group `(embed)`)
- **Date**: 2026-02-19
- **Statut**: Accepted

## Contexte
  - Les utilisateurs veulent embarquer la roadmap ou un board dans leur site externe via `<iframe>`.
  - Le rendu iframe doit être allégé (sans header DSFR, footer, navigation) tout en gardant le theming DSFR et les fonctionnalités de vote.
  - Les headers CSP par défaut (`frame-ancestors: 'self'`, `X-Frame-Options: DENY`) bloquent l'affichage en iframe cross-origin.
  - L'embedding doit être opt-in par tenant (toggle admin `allowEmbedding`).

## Décision
  - Nouveau route group `src/app/[domain]/(embed)/` avec layout minimal (main + footer "Propulsé par").
  - Routes : `/embed/board/[boardSlug]` et `/embed/roadmap` avec paramètres URL (`hideVotes`, `theme`, `view`, `search`).
  - Headers CSP spécifiques dans `next.config.ts` via source `/:path*/embed/:rest*` (après le catch-all pour pouvoir surcharger les headers par défaut) : `frame-ancestors: *`, `X-Frame-Options: ""`, `Cross-Origin-Embedder-Policy: unsafe-none`.
  - Guard dans le layout embed : vérifie `TenantSettings.allowEmbedding` avant tout rendu.
  - Prop `linkTarget="_blank"` passée aux composants board pour ouvrir les liens hors de l'iframe.

## Options envisagées
  - **Route group dédié `(embed)`** (retenu) — isolation claire du layout, pas d'impact sur les routes existantes, composants réutilisés via imports.
  - **Paramètre `?embed=true` sur les routes existantes** — moins de code mais logique conditionnelle dans le layout `(domain)`, risque de régression sur les pages normales.
  - **Middleware pour injecter les headers embed** — plus flexible mais complexe (proxy.ts est déjà dense), et ne résout pas le layout allégé.

## Conséquences
  - Les pages embed sont en lecture seule (pas de formulaire de soumission de post).
  - Les cookies de session tiers sont bloqués en iframe cross-origin — les tenants privés affichent un message d'avertissement plutôt qu'une redirection.
  - Le layout embed inclut `<DsfrPage>` pour l'initialisation JS DSFR (nécessaire pour les composants interactifs comme les boutons de vote).

## Liens
  - PR #64, Issue #50
  - `next.config.ts` : `serializeCsp()`, `embedCsp`, `commonSecurityHeaders`
