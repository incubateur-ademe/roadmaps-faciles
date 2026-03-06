# ADR 0025 — Architecture du theme switching tenant-level

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

La plateforme est multi-tenant : certains tenants sont des collectivités publiques (= DSFR obligatoire), d'autres non (= DSFR interdit). Le root (landing, doc, profil) n'est pas un service public → pas de DSFR. On a besoin d'un mécanisme pour que chaque tenant choisisse son design system (DSFR ou shadcn/ui) et que le root soit toujours en shadcn.

## Décision

**Theme switching au niveau tenant** via un champ `TenantSettings.uiTheme` (enum `UiTheme`: `"Dsfr"` | `"Default"`), résolu à l'exécution par un `UIProvider` (React Context) et des **bridge components** (`UIButton`, `UIBadge`, `UIAlert`, etc.) qui rendent le composant DSFR ou shadcn selon le thème actif.

### Architecture

```
UIProvider (context: "Dsfr" | "Default")
├── useUI() — hook client pour lire le thème
├── getTheme(settings) — helper serveur
├── cn() — classe Tailwind merge (shadcn convention)
│
├── Bridge components (runtime switch, DSFR lazy-loaded)
│   ├── UIAlert → DSFR Alert | shadcn Alert
│   ├── UIBadge → DSFR Badge | shadcn Badge
│   ├── UIButton → DSFR Button | shadcn Button
│   ├── UIButtonsGroup → DSFR ButtonsGroup | Tailwind flex
│   ├── UICard → DSFR Card | shadcn Card
│   ├── UIInput → DSFR Input | shadcn Input + Label
│   ├── UILabel → DSFR label | shadcn Label
│   ├── UIModal → DSFR createModal() | shadcn Dialog
│   ├── UISeparator → <hr> | shadcn Separator
│   ├── UISkeleton → CSS var | shadcn Skeleton
│   ├── UITable → shadcn Table (Default only)
│   ├── UITag → DSFR Tag | shadcn Badge outline
│   └── UITooltip → DSFR Tooltip | shadcn Tooltip
│
├── Layout components (conditional render)
│   ├── Header → DSFR Header | ShadcnHeader
│   ├── Footer → DSFR Footer | ShadcnFooter
│   └── ConsentBanner → DSFR only (if theme === "Dsfr")
│
└── ThemeInjector — <html data-ui-theme="..."> attribute setter
```

### Attribut `data-ui-theme`

Posé sur `<html>` par `ThemeInjector`. Sert de scope CSS pour les tokens :
- `[data-ui-theme="Default"]` → tokens shadcn (oklch French Blue)
- `[data-ui-theme="Dsfr"]` → tokens DSFR (via `@gouvfr/dsfr`)

### Guard `.gouv.fr`

Les domaines customs en `.gouv.fr` forcent le thème DSFR indépendamment du setting tenant (obligation légale). Implémenté dans le use case `SaveTenantWithSettings` : si `customDomain.endsWith(".gouv.fr")` et `uiTheme !== "Dsfr"`, validation rejetée.

### Feature flag

Le sélecteur de thème dans l'admin tenant est derrière le feature flag `themeSwitching` (désactivé par défaut). Tant que le flag est off, tous les tenants restent en DSFR.

## Options envisagées

- **Option A : Deux apps séparées** (une DSFR, une shadcn) — duplication massive, impossible à maintenir.
- **Option B : Override CSS conditionnel** (DSFR partout, override pour les non-DSFR) — le CSS DSFR est trop invasif (styles de base non-layered sur `a`, `h1-h6`, `ul`), impossible à neutraliser proprement.
- **Option C : UIProvider + bridge components** ✅ — resolution runtime, un seul codebase, composants partagés. Les bridges sont fins (5-20 lignes chacun), facilement supprimables quand un design system est déprécié.
- **Option D : Design tokens abstraits (CSS-only, pas de bridge)** — insuffisant pour les composants interactifs (modal, dropdown, navigation) qui ont des APIs très différentes entre DSFR et shadcn.

## Conséquences

- **Maintenabilité** : chaque nouveau composant UI doit potentiellement avoir un bridge. En pratique, seuls les composants "atomiques" (Button, Badge, Alert) sont bridgés — les composants composites (Header, Footer) ont des implémentations séparées.
- **Performance** : overhead minimal — le thème est résolu une seule fois au mount. Les variants DSFR sont lazy-loadées via `React.lazy()` + `<Suspense>` pour garantir que le CSS DSFR ne soit jamais injecté quand le thème Default est actif (isolation CSS Turbopack).
- **Testabilité** : les tests E2E doivent spécifier `uiTheme` dans le seed pour garantir le bon design system en test.
- **Extensibilité** : ajouter un troisième thème = ajouter une valeur à l'enum + un cas dans chaque bridge. Le pattern est linéaire, pas exponentiel.
- **Suppression future** : si DSFR est abandonné, supprimer les bridges et les composants DSFR = suppression de fichiers, pas de refactoring.

## Liens

- PR #104 — feat/theme-switching
- DDR-0001 — Palette French Blue oklch
- DDR-0002 — Chargement conditionnel du DSFR
- DDR-0005 — Dark mode sans DSFR
- `src/ui/` — barrel, UIProvider, bridge components
- `src/ui/shadcn/` — composants shadcn/ui
- `src/app/globals.scss` — tokens CSS scopés par `data-ui-theme`
