# ADR 0022 — Framework d'intégrations tierces (provider pattern)
- **Date**: 2026-02-24
- **Statut**: Accepted

## Contexte
  - Les utilisateurs demandent de synchroniser leurs boards/posts avec des outils tiers (Notion, Trello, etc.) — issue #76.
  - La synchronisation doit être bidirectionnelle (outbound RF → Notion, inbound Notion → RF) avec détection de conflits.
  - Les credentials (clés API) doivent être stockées de manière sécurisée.
  - L'architecture doit supporter N intégrations du même type par tenant et être extensible à d'autres connecteurs.

## Décision
  - **Provider pattern** : interface `IIntegrationProvider` avec factory `createIntegrationProvider(type, config)`. Chaque intégration est instanciée à la demande avec sa propre config déchiffrée (pas de singleton).
  - **Mapping externe** : table `IntegrationMapping` relie les entités locales (posts) aux entités distantes (pages Notion) sans modifier le modèle `Post`. Les posts inbound sont de vrais Posts en DB, liés par mapping avec `metadata.direction = "inbound"`.
  - **Encryption AES-256-GCM** : clés API chiffrées avec scrypt (key derivation) + salt/iv/tag aléatoires. Format `salt:iv:tag:ciphertext`. Env var `INTEGRATION_ENCRYPTION_KEY`.
  - **Cron par route handler** : `POST /api/cron/integrations` avec Bearer auth. Pas de dépendance à un scheduler externe (node-cron) — l'appel est déclenché par un cron externe (Scalingo scheduler, crontab, etc.).
  - **Inbound readonly** : les posts importés depuis Notion sont protégés par un double guard — UI (pas de boutons edit/delete) + server actions (rejet avec erreur i18n).

## Options envisagées
  - **Option A : Modifier le modèle Post** (ajouter `sourceIntegrationId`, `remoteId`, etc.) — Rejeté : pollue le modèle core, complique les requêtes non liées aux intégrations, empêche le multi-intégration par post.
  - **Option B : Mapping externe (retenue)** — Table dédiée `IntegrationMapping` avec index composé. Zéro impact sur le modèle Post. Supporte N intégrations par post.
  - **Option C : Webhooks Notion** — Rejeté pour le MVP : Notion n'a pas de webhooks natifs fiables. Le polling via cron + cursor est plus simple et suffisant.
  - **Option D : Singleton provider global** — Rejeté : chaque intégration a ses propres credentials. L'instanciation à la demande est nécessaire.

## Conséquences
  - **Positif** : extensible (ajouter un provider = implémenter `IIntegrationProvider`), isolation des credentials, pas de couplage avec le modèle Post.
  - **Coût** : JOIN supplémentaire pour vérifier si un post est synced (IntegrationMapping), complexité du sync bidirectionnel avec conflits.
  - **Risque** : le polling cron a un délai inhérent (pas de temps réel). Acceptable pour le MVP.
  - **Migration** : 3 nouvelles tables Prisma (TenantIntegration, IntegrationMapping, IntegrationSyncLog), 4 nouveaux enums, 1 nouvelle dépendance npm (`@notionhq/client`).

## Liens
  - Issue #76
  - `.plan-notion-integration.md` — plan d'implémentation détaillé
  - `src/lib/integration-provider/` — code du framework
  - `src/useCases/integrations/` — use cases
