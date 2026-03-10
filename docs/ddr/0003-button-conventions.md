# DDR 0003 — Conventions boutons shadcn

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

La landing page et les composants root utilisent les boutons shadcn (`<Button>` via cva). On avait initialement ajouté des effets glow/shadow (`shadow-lg shadow-primary/10`) pour donner du "punch" aux CTA. Le feedback design a été clair : **zéro glow, zéro shadow sur les boutons**. L'identité visuelle repose sur le contraste couleur, pas sur les effets lumineux.

## Décision

**Aucun shadow/glow sur les boutons.** Hiérarchie visuelle établie uniquement par les variants cva et le contraste couleur.

## Options envisagées

- **Option A : Glow/shadow pour les CTA** — plus "moderne"/SaaS. Rejeté : esthétique trop startup, pas cohérent avec l'identité institutionnelle French Blue.
- **Option B : Zéro shadow, hiérarchie par variant** ✅ — clean, pro, accessible (pas de dépendance au glow pour la distinction visuelle).

## Spécifications

### Hiérarchie des variants

| Contexte | Variant | Classes | Usage |
|----------|---------|---------|-------|
| CTA principal | `default` | `bg-primary text-primary-foreground` | Bouton d'action principal |
| CTA secondaire | `secondary` | `bg-secondary text-secondary-foreground` | Action alternative |
| Inline action | `outline` | `border border-input bg-background` | Actions dans les cartes |
| Subtil | `ghost` | `hover:bg-accent hover:text-accent-foreground` | Navigation, actions tertiaires |
| Danger | `destructive` | `bg-destructive text-destructive-foreground` | Suppression, actions irréversibles |

### Boutons sur fond inversé (bg-primary)

Quand les boutons sont sur un fond `bg-primary` (ex: section CTA), les couleurs s'inversent :

```tsx
{/* CTA principal sur fond primary */}
<Button className="bg-primary-foreground !text-primary hover:bg-primary-foreground/90 hover:!text-primary">

{/* CTA secondaire sur fond primary */}
<Button variant="ghost" className="border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
```

Le `!text-primary` est nécessaire car le `variant="default"` de cva injecte `text-primary-foreground` qui override. Le `!important` via prefix `!` est la seule solution propre.

### Sizing

| Taille | Classe | Usage |
|--------|--------|-------|
| Hero CTA | `size="lg"` + `px-8 py-6 text-base` | Landing hero |
| Section CTA | `size="lg"` + `px-10 py-4 text-lg font-bold` | Blocs CTA full-width |
| Inline | `size="default"` | Cartes, formulaires |
| Compact | `size="sm"` | Actions secondaires inline |

### Règles strictes

1. **JAMAIS** de `shadow-*` sur un `<Button>`
2. **JAMAIS** de `shadow-primary/*` ou `shadow-lg` sur un CTA
3. Le hover se fait par changement d'opacité du background, pas par ajout d'ombre
4. Sur fond inversé, utiliser `!text-primary` (pas `text-[color]`)

## Conséquences

- Cohérence visuelle : tous les boutons suivent la même logique, pas d'exceptions "glow pour le hero".
- Accessibilité : le contraste couleur seul suffit pour la distinction (pas de dépendance à la perception des ombres).
- Le design system est plus sobre et institutionnel — aligné avec l'identité French Blue.

## Liens

- PR #104 — feat/theme-switching
- `src/ui/shadcn/button.tsx` — définition cva des variants
- `src/app/(default)/page.tsx` — landing page (hero + CTA section)
