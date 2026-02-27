# DDR 0001 — Palette French Blue en oklch

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

Le thème "Default" (shadcn) a besoin d'une palette cohérente qui fonctionne en light et dark mode, avec suffisamment de variations pour couvrir tous les tokens shadcn (primary, secondary, muted, accent, border, card, chart, sidebar). La charte DSFR (Blue France) ne s'applique pas au root — raison légale (cf. DDR-0002).

## Décision

Palette **French Blue** complète, définie en **oklch** (perceptuellement uniforme, gamut P3-ready). Un seul hue principal (~263-265) décliné en 10+ nuances, de Carbon Black à Lavender.

## Options envisagées

- **Option A : HSL classique** — plus répandu, support universel. Inconvénient : non perceptuellement uniforme, les shifts de lightness ne sont pas visuellement linéaires.
- **Option B : oklch** ✅ — perceptuellement uniforme, prêt pour les écrans wide-gamut (P3), syntax CSS native. Inconvénient : support navigateur récent uniquement (OK pour notre target).
- **Option C : Design tokens abstraits (sans valeur directe)** — trop d'indirection, perte de lisibilité dans globals.scss.

## Spécifications

### Tokens light mode (`[data-ui-theme="Default"]`)

| Token | Valeur oklch | Rôle |
|-------|-------------|------|
| `--primary` | `oklch(0.386 0.146 263)` | French Blue — CTA, accents, interactive |
| `--primary-foreground` | `oklch(1 0 0)` | Blanc pur — texte sur primary |
| `--background` | `oklch(1 0 0)` | Fond page |
| `--foreground` | `oklch(0.252 0.041 264)` | Texte body (Carbon Black + blue tint) |
| `--card` | `oklch(1 0 0)` | Surface carte |
| `--card-foreground` | `oklch(0.252 0.041 264)` | Texte carte |
| `--secondary` | `oklch(0.853 0.031 265)` | Lavender — bouton secondaire |
| `--secondary-foreground` | `oklch(0.350 0.114 263)` | Regal Navy |
| `--muted` | `oklch(0.935 0.015 265)` | Lavender très clair — fills subtils |
| `--muted-foreground` | `oklch(0.542 0.104 265)` | Smart Blue — texte secondaire |
| `--accent` | `oklch(0.920 0.020 265)` | Wisteria area — hover states |
| `--border` | `oklch(0.885 0.020 265)` | Dividers, bordures |
| `--ring` | `oklch(0.542 0.104 265)` | Focus ring |

### Tokens dark mode (`[data-ui-theme="Default"][data-fr-theme="dark"]`)

| Token | Valeur oklch | Delta vs light |
|-------|-------------|----------------|
| `--primary` | `oklch(0.620 0.130 264)` | +0.234 lightness, légèrement moins saturé |
| `--background` | `oklch(0.220 0.010 264)` | Near Carbon Black |
| `--foreground` | `oklch(0.920 0.015 265)` | Near Lavender |
| `--card` | `oklch(0.260 0.030 264)` | Prussian Blue |
| `--muted` | `oklch(0.313 0.060 264)` | Twilight Indigo |
| `--border` | `oklch(0.350 0.050 264)` | Twilight subtle |

### Architecture

```
globals.scss
├── @theme inline          → Mappe --color-* pour Tailwind 4 utilities
├── [data-ui-theme="Default"]  → Light tokens (CSS custom properties)
└── [data-ui-theme="Default"][data-fr-theme="dark"]  → Dark tokens
```

Le `--radius: 0.625rem` est global (pas lié à la palette).

## Conséquences

- Toutes les couleurs sont dans un seul fichier (`globals.scss`), facilement auditables.
- oklch permet d'ajuster lightness/chroma indépendamment pour le dark mode sans changer le hue.
- Les utilitaires Tailwind (`bg-primary`, `text-muted-foreground`, etc.) fonctionnent grâce au `@theme inline` bridge.
- Si un navigateur ne supporte pas oklch (< 2023), les couleurs ne s'affichent pas — risque accepté vu la cible.

## Liens

- PR #104 — feat/theme-switching
- `src/app/globals.scss` lignes 55-169
