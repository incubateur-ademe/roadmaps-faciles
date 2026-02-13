# ADR 0016 — Posts anonymes et workflow de modération
- **Date**: 2026-02-13
- **Statut**: Accepted

## Contexte
  - Les utilisateurs doivent pouvoir soumettre des suggestions (posts) sur les boards. Deux besoins distincts convergent :
    1. **Feedback anonyme** : certains tenants souhaitent recueillir du feedback sans obliger les utilisateurs à se connecter (setting `allowAnonymousFeedback` existant). Le modèle `Post` imposait un `userId` non-nullable, bloquant cette fonctionnalité.
    2. **Modération** : les tenants ont besoin de contrôler les posts avant publication (spam, contenu inapproprié). Aucun mécanisme d'approbation n'existait — tous les posts étaient directement visibles.
  - La section admin existante (`/admin`) est réservée aux `ADMIN`+ et concerne la configuration du tenant. La modération de contenu est une responsabilité distincte, potentiellement déléguée à des `MODERATOR`.

## Décision
  - **Posts anonymes** : `Post.userId` est rendu nullable. Un champ `anonymousId` (string, optionnel) identifie de manière unique un visiteur anonyme (via cookie). Le use case `SubmitPost` exige au moins l'un des deux identifiants.
  - **Workflow d'approbation** : un setting `requirePostApproval` (par tenant) détermine si les nouveaux posts sont créés en `APPROVED` (publication immédiate) ou `PENDING` (nécessite approbation). Les use cases `ApprovePost` et `RejectPost` gèrent les transitions de statut, avec validation cross-tenant obligatoire (`post.tenantId === input.tenantId`).
  - **Section modération dédiée** : `/moderation` est une section séparée de `/admin`, protégée par `assertTenantModerator` (rôle minimum `MODERATOR`). Elle possède son propre layout, side menu et server actions.

## Options envisagées
  - **Option A — Modération dans l'admin** : ajouter des pages de modération sous `/admin`. Plus simple structurellement, mais mélange configuration et modération de contenu, et oblige à donner le rôle `ADMIN` aux modérateurs.
  - **Option B — Section modération séparée (retenue)** : espace `/moderation` distinct avec contrôle d'accès `MODERATOR`+. Séparation des responsabilités claire, permet de déléguer la modération sans accès admin.
  - **Option C — File d'attente automatisée** : modération par IA ou règles automatiques. Prématuré à ce stade, mais la structure actuelle (statut `PENDING` → `APPROVED`/`REJECTED`) permet d'ajouter de l'automatisation ultérieurement.

## Conséquences
  - **Null-safety** : tous les accès à `post.user` doivent gérer le cas `null` (affichage "Anonyme").
  - **Sécurité cross-tenant** : les use cases de modération valident systématiquement que le post appartient au tenant du modérateur.
  - **Filtrage** : les requêtes publiques de posts (board, trending) filtrent sur `approvalStatus: APPROVED` — les posts en attente ou rejetés ne sont jamais visibles publiquement.
  - **Migration** : les posts existants conservent leur `userId` (non impacté). Le champ `approvalStatus` a un default `APPROVED` en base, donc les posts existants restent visibles.

## Liens
  - Plan d'implémentation : branche `feat/new-post`
  - Use cases : `src/useCases/posts/SubmitPost.ts`, `ApprovePost.ts`, `RejectPost.ts`
  - Section modération : `src/app/[domain]/(domain)/(authenticated)/moderation/`
