# ADR 0024 — Abstraction tracking multi-provider + PostHog
- **Date**: 2026-02-25
- **Statut**: Accepted

## Contexte
  - Roadmaps Faciles n'avait aucun tracking comportemental. Matomo était intégré en dur dans quelques déploiements mais sans plan d'événements structuré ni tracking serveur.
  - Besoin de comprendre l'adoption (AARRR : Acquisition → Activation → Engagement → Retention → Referral → Impact) pour piloter le produit.
  - Contraintes : multi-tenant, RGPD (hébergement EU), privacy by design, instances self-hosted sans tracking obligatoire.
  - Sentry était déjà en place mais sans hardening (pas de release tagging, pas de sampling configuré, pas de noise filter).

## Décision
  - **Abstraction multi-provider** dans `src/lib/tracking-provider/` avec 3 niveaux : `noop` (aucun tracking), `simple` (page views Matomo), `full` (PostHog complet).
  - **PostHog** comme provider "full" : events, identify, group, feature flags côté client et serveur. Host EU (`eu.i.posthog.com`), session replay désactivé.
  - **Plan de tracking AARRR** : 24 événements couvrant le cycle de vie utilisateur, définis dans `trackingPlan.ts` comme factories typées.
  - **Fire-and-forget** : les événements serveur sont émis via `void trackServerEvent(...)` — pas de `await`, pas d'impact sur la latence des server actions.
  - **Consentement DSFR** : les finalités du `ConsentBanner` sont dynamiques selon le provider actif. Pas de tracking avant consentement.
  - **Sentry hardening** en parallèle : environment/release tagging, sampling adaptatif (1% traces prod, 100% errors), `beforeSend` noise filter, cross-integration PostHog↔Sentry.

## Options envisagées
  - **Option A — Matomo uniquement (statu quo)** : gratuit, auto-hébergé, mais limité aux page views. Pas de tracking serveur, pas d'identify/group, pas de feature flags. Insuffisant pour un plan AARRR.
  - **Option B — PostHog en dur** : simple à intégrer mais impossible à désactiver pour les instances self-hosted. Couplage fort, pas de fallback.
  - **Option C — Abstraction provider switchable (retenue)** : `noop`/`matomo`/`posthog` sélectionné par variable d'environnement. Les instances self-hosted restent sur `noop` par défaut. Le code métier utilise les interfaces, pas les implémentations.
  - **Option D — Segment/RudderStack comme couche d'abstraction** : puissant mais ajoute un intermédiaire, un coût, et une dépendance. Overkill pour 3 providers max.

## Conséquences
  - Le tracking est opt-in par configuration : `NEXT_PUBLIC_TRACKING_PROVIDER=posthog` + clé API. Par défaut rien ne s'active.
  - Le plan de tracking est versionné dans le code (`trackingPlan.ts`) — pas de drift entre spec et implémentation.
  - Les factories typées garantissent que chaque événement a les bonnes properties au compile-time.
  - Le pattern fire-and-forget (`void`) évite tout impact perf sur les server actions, mais les erreurs de tracking sont silencieuses (acceptable car non-critique).
  - La factory côté serveur utilise `require()` (CJS) intentionnellement pour éviter que le code PostHog server ne leak dans le bundle client — conséquence : cette factory n'est pas testable unitairement avec vitest ESM.
  - Ajouter un nouveau provider = implémenter `ITrackingProvider` + `IServerTrackingProvider` + l'enregistrer dans les factories.

## Liens
  - PR : https://github.com/incubateur-ademe/roadmaps-faciles/pull/98
  - Tracking plan : `src/lib/tracking-provider/trackingPlan.ts`
  - Documentation : `/doc/technical/tracking`
  - Types : `src/lib/tracking-provider/types.ts`
