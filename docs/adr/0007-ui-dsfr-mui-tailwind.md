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

---

## Mise à jour — 2026-02-08 (post PR #18)

### react-dsfr comme couche principale

L'ADR initial décrit l'usage des "classes `fr-*`" brutes. En pratique, la couche **react-dsfr** (`@codegouvfr/react-dsfr`) est devenue le point d'entrée principal pour les composants DSFR : `Badge`, `Button`, `Select`, `ButtonsGroup`, `Tooltip`, `Pagination`, `Alert`, `ToggleSwitch`, `SideMenu`, etc.

Les classes `fr-*` brutes ne sont utilisées que pour le micro-layout ou les cas non couverts par react-dsfr.

### Composants custom dans `src/dsfr/`

Plusieurs composants custom ont été créés pour combler les manques :
- `TableCustom` — tableau avec header/body typés, remplace les tables HTML et le composant react-dsfr `Table`
- `Icon` — wrapper pour les icônes DSFR/Remix Icon
- Composants de layout DSFR (`DsfrPage`, etc.)

### Place de MUI réévaluée

La mention "peu de besoin de composants custom grâce à MUI" n'est plus exacte. C'est react-dsfr qui couvre la majorité des besoins. MUI reste utilisé ponctuellement (timeline), mais n'est plus la solution de fallback principale.

### Composition de classes

Convention établie pour mixer DSFR et Tailwind :
```tsx
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
className={cx(fr.cx("fr-mt-2w"), "tw-flex tw-gap-2")}
```
Jamais de template literals pour mixer les deux systèmes.
