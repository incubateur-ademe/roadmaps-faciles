# ADR 0006 — Prisma : ts client, views, full-text search
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Utilisation de fonctionnalités avancées de Prisma pour optimiser les performances et la maintenabilité. 
Besoin de gérer les relations complexes, les vues matérialisées, et le full-text search. 
Besoin d'une DX améliorée pour les développeurs.

## Décision
- Utilisation de `prisma-client` pour la génération du client type-safe.
- Mise en place de vues matérialisées pour les requêtes complexes et fréquentes (ex. hotness)
- Utilisation de `previewFeatures=fullTextSearchPostgres` pour les recherches textuelles en combinaison avec un type Prisma "Unsupported" dédié PostgreSQL.
- Utilisation de `previewFeatures=views` pour gérer les vues matérialisées.

## Options envisagées
- Requêtes SQL brutes : moins de sécurité et de maintenabilité.
- ORM alternatif : perte de l'écosystème Prisma.

## Conséquences
- Meilleure performance pour les requêtes complexes.
- Code plus maintenable et sécurisé.
- Schema plus en phase avec la base de données.
- On edge sur les fonctionnalités avancées de Prisma, donc risque de bugs.

## Liens
- [`prisma-client`](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#prisma-client)
- [`fullTextSearchPostgres`](https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search)
- [`views`](https://www.prisma.io/docs/orm/prisma-schema/data-model/views)
