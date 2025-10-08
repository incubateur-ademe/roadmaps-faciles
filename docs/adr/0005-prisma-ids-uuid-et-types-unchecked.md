# ADR 0005 — Prisma : IDs en UUID et `Unchecked*` dans les repositories
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Uniformiser les identifiants et simplifier les écritures bulk/performantes côté repo.

## Décision
- Tous les `id` en **UUID** dans le schéma Prisma.
- Dans les repositories, usage des types **`Unchecked*`** (ex: `CommentUncheckedCreateInput`) quand pertinent.

## Options envisagées
- IDs auto-incréments : collisions multi-régions, migrations.
- `Pick`/`Omit` : plus verbeux et fragile.

## Conséquences
- Migration de données si l’existant n’était pas en UUID.
- Revue accrue des validations côté Zod.

## Liens
- Schéma Prisma, repositories.
