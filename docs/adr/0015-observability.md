# ADR 0015 — Observabilité (logging, error tracking, health check)
- **Date**: 2026-02-13
- **Statut**: Accepted

## Contexte
  - Le projet utilise ~36 `console.*` non structurés, aucun error tracking, un health check HTML sans vérification de dépendances, pas de correlation ID, pas de métriques, pas de tracing.
  - L'audit log (ADR 0014) est en place mais isolé — il ne bénéficie pas de correlation ID ni de logging structuré.
  - Le projet doit supporter plusieurs hébergeurs (Scalingo, CleverCloud, Scaleway/Docker/Kube) sans changement de code.

## Décision
  - **Logging structuré** : Pino (server-only). JSON en prod (stdout → log drain PaaS ou Fluentd/Vector en Kube), `pino-pretty` en dev (devDep, chargé dynamiquement via transport).
  - **Error tracking + tracing + métriques** : `@sentry/nextjs`, optionnel — activé par la présence de `SENTRY_DSN`. Quand le DSN est vide, Sentry est entièrement désactivé (zéro overhead). Sentry instrumente automatiquement RSC, Server Actions, Route Handlers, `fetch()` et Prisma (via OTEL intégré).
  - **Correlation ID** : généré dans le middleware Next.js (UUID v4 via `crypto.randomUUID()`). Propagé via header `x-correlation-id` dans la requête et la réponse. Injecté dans les logs Pino (child logger) et dans les métadonnées de l'audit log.
  - **Health check** : route handler `/api/healthz` retournant un JSON avec l'état de la DB (Prisma `$queryRaw`) et de Redis (unstorage `getKeys`). HTTP 200 si healthy, 503 sinon.
  - **Principe directeur** : tout est piloté par variables d'environnement. Aucun changement de code entre environnements.

## Options envisagées
  - **Option A — Winston** : populaire mais plus lourd, API callback-based, pas de transport natif par workers. Pino est plus performant (JSON sérialisation plus rapide) et mieux adapté à Next.js.
  - **Option B — OTEL SDK standalone (sans Sentry)** : nécessite un collector (Jaeger, Grafana Tempo), plus de setup infra. Adapté à Kube mais overkill pour PaaS. Documenté comme extension future.
  - **Option C — Pino + Sentry optionnel (retenue)** : Pino universel pour les logs, Sentry conditionnel pour error tracking/tracing/métriques. Meilleur rapport complexité/valeur pour un déploiement PaaS-first.

## Conséquences
  - Toutes les `console.*` server-side doivent être migrées progressivement vers le logger Pino. Un batch prioritaire (~6 fichiers) est migré immédiatement, le reste au fil des PR.
  - Les `console.error` côté client restent — Sentry client les capture automatiquement via `beforeSend`.
  - Le health check remplace l'ancien `/healthz` (page HTML statique) par `/api/healthz` (route handler JSON).
  - Extension future : pour un déploiement Kube avec OTEL collector natif, remplacer Sentry par `@opentelemetry/sdk-node` + OTLP exporter (sans toucher à Pino ni au health check).

## Liens
  - `src/lib/logger.ts` — singleton Pino
  - `sentry.client.config.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts` — configs Sentry
  - `src/instrumentation.ts` — hook Next.js (import conditionnel Sentry)
  - `src/proxy.ts` — correlation ID (Next.js 16 proxy)
  - `src/lib/utils/requestLogger.ts` — child logger avec correlation ID
  - `src/app/(default)/api/healthz/route.ts` — health check enrichi
