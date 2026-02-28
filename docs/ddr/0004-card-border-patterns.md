# DDR 0004 — Patterns de bordures pour les cartes

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

Les cartes (composant shadcn `<Card>`) sont utilisées massivement dans la landing (bento grid) et les pages tenant. Le composant de base shadcn a un `border` plein et un `shadow-sm` par défaut. Le feedback design a montré que les bordures pleines étaient trop prononcées et les shadows inutiles — on veut un look plus "aéré" et subtil.

## Décision

**Bordures atténuées via opacité** (`border-border/40` pour les cartes outer, `border-border/30` pour les cartes inner) et **aucune shadow** (`shadow-none`).

## Options envisagées

- **Option A : Défaut shadcn (border plein + shadow-sm)** — trop lourd visuellement, les cartes "sautent" de la page.
- **Option B : Bordures atténuées + shadow-none** ✅ — subtil, professionnel, le contenu prime sur le conteneur.
- **Option C : Pas de bordures, juste du background** — trop plat, perte de structure visuelle.

## Spécifications

### Hiérarchie de profondeur

| Niveau | Classes | Usage |
|--------|---------|-------|
| **Outer** (niveau 1) | `border-border/40 shadow-none p-8` | Cartes principales (bento grid) |
| **Inner** (niveau 2) | `border-border/30 shadow-none p-4` | Cartes imbriquées (kanban items, vote form) |
| **Status** (sémantique) | `border-{color}/20 shadow-none` | Cartes avec indicateur de statut |
| **Accent bg** | `bg-muted/30` | Zone secondaire dans une carte outer |

### Exemples concrets

```tsx
{/* Carte outer — bento grid */}
<Card className="border-border/40 p-8 shadow-none md:col-span-8">

{/* Carte inner — item kanban */}
<Card className="border-border/30 bg-muted/30 p-4 shadow-none">

{/* Carte status — "en cours" avec accent primary */}
<Card className="border-primary/20 bg-primary/[0.02] p-4 shadow-none">

{/* Carte status — "livré" avec accent emerald */}
<Card className="border-emerald-100/50 bg-emerald-50/20 p-4 shadow-none
                 dark:border-emerald-900/50 dark:bg-emerald-950/20">

{/* Carte avec fond accent */}
<Card className="border-border/40 bg-muted/30 p-8 shadow-none">
```

### Dark mode

Les opacités (`/40`, `/30`, `/20`) fonctionnent automatiquement en dark mode grâce aux tokens oklch qui changent entre `[data-ui-theme="Default"]` et `.dark[data-ui-theme="Default"]`.

Pour les couleurs sémantiques (emerald, amber), on utilise des classes `dark:` explicites :

```tsx
border-emerald-100/50 dark:border-emerald-900/50
bg-emerald-50/20 dark:bg-emerald-950/20
```

### Règles

1. **Toujours** ajouter `shadow-none` explicitement — le composant `<Card>` shadcn a `shadow-sm` par défaut.
2. **Jamais** de `shadow-md`, `shadow-lg` sur les cartes. La profondeur est gérée par la bordure, pas les ombres.
3. Les cartes inner doivent avoir une opacité de bordure inférieure aux outer (30 < 40).
4. Le `bg-muted/30` est le background d'accent pour les cartes secondaires.
5. Les cartes status utilisent la couleur à `/20` pour la bordure et `/[0.02]` pour le fond.

## Conséquences

- Look cohérent et aéré sur toute la landing.
- Les cartes ne "compétent" pas visuellement avec le contenu — le texte et les icônes priment.
- Le pattern est extensible : toute nouvelle carte suit la même logique (outer/inner/status).
- Potentiel breaking si le composant `<Card>` shadcn est mis à jour avec de nouveaux defaults → il faut maintenir le `shadow-none`.

## Liens

- PR #104 — feat/theme-switching
- `src/ui/shadcn/card.tsx` — composant de base
- `src/app/(default)/page.tsx` — bento grid
