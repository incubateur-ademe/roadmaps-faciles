# ADR 0004 — Modélisation des objets métier avec Zod v4
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Garantir la cohérence des entrées/sorties (Server Actions, use cases, DTO).

## Décision
- **Zod v4** pour les schémas dans `lib/model`.
- Un fichier par modèle, export des `schema`, `type` inféré, et helpers.

## Options envisagées
- Zod v3 : évité pour être en avance sur les features v4.

## Conséquences
- Types sûrs, validation uniforme, DX claire.

## Liens
- README, exemples d’usage.
