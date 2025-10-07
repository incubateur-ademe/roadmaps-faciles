# ADR 0007 — UI : DSFR + MUI + utilitaires Tailwind
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Respecter les standards de l’État (DSFR) tout en gardant de la souplesse.

## Décision
- DSFR comme base (classes `fr-*`).
- MUI pour composants complexes non couverts par DSFR (timeline)
- Tailwind pour utilitaires (ex: `sticky`) et micro-layout.
- Composants maison minces, style sobre et accessible.

## Options envisagées
- UI Kit custom pur Tailwind : risque d’incohérence.
- Bootstrap : non aligné DSFR.

## Conséquences
- Respect des guidelines DSFR.
- Peu de besoin de composants custom grâce à MUI.
- Focus sur l’accessibilité et l'UX plutôt que le design from scratch.

## Liens
- Guidelines DSFR, composants.
