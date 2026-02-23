# ADR 0021 — Deploy push-based via GitHub Actions
- **Date**: 2026-02-23
- **Statut**: Accepted

## Contexte
  - Le déploiement était géré par Scalingo qui pull le code depuis GitHub (intégration native). Ce modèle ne permet pas de conditionner le deploy à la réussite de la CI, ni de contrôler finement le timing des déploiements (staging vs prod).
  - Besoin de déployer staging uniquement après validation CI complète (build + lint + tests), et production uniquement sur release-please (tag sémantique).

## Décision
  - GitHub Actions push le code vers Scalingo via `scalingo deploy` (archive tar.gz).
  - Modèle hybride : l'intégration GitHub de Scalingo reste active mais l'auto-deploy est désactivé. Seules les review apps (éphémères par PR) continuent d'utiliser l'intégration native.
  - Deux GitHub Environments (`staging`, `production`) avec secrets `SCALINGO_API_TOKEN` scopés.
  - Staging deploy : déclenché par `workflow_run` sur les 3 workflows CI (Build, Lint, Tests) pour la branche `dev`. Le triple-trigger est géré par vérification API (chaque trigger vérifie que les 3 CI ont passé) + `cancel-in-progress: true` (annule les runs en queue, pas en cours).
  - Production deploy : déclenché par `release: published` (release-please) avec CI gate (vérification des 3 CI sur le commit du tag).
  - Dispatch manuel disponible pour les deux environnements (skip CI gate).
  - Scripts JS externalisés dans `.github/scripts/` (CJS + JSDoc `@ts-check`) pour maintenir le workflow YAML lisible.

## Options envisagées
  - **Option A — Full Scalingo pull (statu quo)** : simple mais aucun contrôle sur le timing, pas de gate CI, pas de distinction staging/prod.
  - **Option B — Full push GitHub Actions (retirer l'intégration Scalingo)** : contrôle total mais perte des review apps. Recréer les review apps dans GitHub Actions demande beaucoup de plomberie (create/deploy/destroy via API Scalingo par PR).
  - **Option C — Hybride push + intégration Scalingo pour review apps (retenue)** : le meilleur des deux mondes. Push-based pour staging/prod avec CI gate, review apps Scalingo natives.
  - **Option D — Consolidation CI en un seul workflow** : fusionner build/lint/test en un workflow unique pour simplifier le trigger deploy. Rejeté car cela change la structure CI existante et réduit la granularité du path filtering.

## Conséquences
  - Les deploys staging/prod sont conditionnés à la CI — plus de deploy d'un code cassé.
  - Le `workflow_run` triple-trigger génère 2-3 runs par push sur `dev`, mais seul le dernier deploy vraiment (les autres sont des no-ops < 10s).
  - L'intégration GitHub de Scalingo doit rester configurée (pour les review apps) mais avec auto-deploy désactivé sur les branches `dev` et `main`.
  - Un script one-shot (`scripts/setup-github-environments.sh`) est nécessaire pour initialiser les GitHub Environments et secrets.

## Liens
  - PR : https://github.com/incubateur-ademe/roadmaps-faciles/pull/90
  - Workflow : `.github/workflows/deploy.yml`
  - Scripts : `.github/scripts/resolve-deploy.js`, `.github/scripts/ci-gate-release.js`
