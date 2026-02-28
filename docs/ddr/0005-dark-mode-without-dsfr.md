# DDR 0005 — Dark mode sans DSFR (ThemeScript)

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

Avant la PR #104, le dark mode était géré par le JavaScript DSFR (`window.dsfr.start()`) qui lit `localStorage("scheme")` et applique `data-fr-scheme` + `data-fr-theme` sur `<html>`. Avec la suppression du DSFR du root (DDR-0002), on a besoin d'un mécanisme autonome pour le dark mode sur les pages non-DSFR.

Contrainte critique : **pas de FOUC** (Flash of Unstyled Content) — le thème doit être appliqué avant le premier paint.

## Décision

Un **script inline bloquant** dans `<head>` (`ThemeScript`) qui lit `localStorage("theme")` et `prefers-color-scheme`, puis toggle la classe `.dark` sur `<html>` avant que le navigateur ne rende quoi que ce soit.

Convention standard shadcn/next-themes : classe `.dark` sur `<html>`, clé localStorage `"theme"`.

## Options envisagées

- **Option A : `useEffect` côté client** — trop tard, le composant React monte après le premier paint → FOUC garanti (flash blanc → dark).
- **Option B : Cookie + RSC** — pas de FOUC si le serveur connaît le thème, mais ajoute un cookie supplémentaire et ne fonctionne pas en static rendering.
- **Option C : Script inline bloquant** ✅ — zéro FOUC, zéro dépendance serveur, compatible SSG et SSR. Le script est minuscule (~200 bytes) et s'exécute avant le premier paint.

## Spécifications

### Composant `ThemeScript` (`src/app/ThemeScript.tsx`)

Le composant injecte un IIFE minifié via React `script` + innerHTML. Le contenu est une **string statique trusted** (pas d'input user, pas d'injection possible).

### Logique de détection

```
1. Lire localStorage("theme")
2. Si "dark"  → dark mode
3. Si "light" → light mode
4. Sinon      → prefers-color-scheme media query (system preference)
5. Toggle classList.toggle("dark", isDark) sur <html>
```

### Clé localStorage

On utilise la clé `"theme"` (convention standard shadcn/next-themes). Les tenants DSFR utilisent leur propre clé `"scheme"` — les deux systèmes sont indépendants.

### Sélecteur CSS

On utilise la classe `.dark` sur `<html>` (convention standard shadcn/next-themes) :
- Le sélecteur dark mode dans `globals.scss` est `.dark[data-ui-theme="Default"]`
- Fumadocs utilise next-themes avec `attribute: "class"` et `storageKey: "theme"`

### Placement dans le layout

Le script est placé dans `<head>` du root layout (`src/app/layout.tsx`), avant le `<body>`.

```html
<html lang="fr" data-ui-theme="Default">
  <head>
    <!-- ThemeScript — bloquant, s'exécute avant le paint -->
  </head>
```

Pas de fallback statique nécessaire — si le script échoue, l'absence de classe `.dark` donne le mode clair par défaut.

### Intégration avec le switch thème

Le composant de switch dark/light (à implémenter) devra :
1. Écrire dans `localStorage.setItem("theme", "dark"|"light")`
2. Appliquer `document.documentElement.classList.toggle("dark", isDark)`

Sur les pages `/doc`, next-themes (via Fumadocs `RootProvider`) gère le toggle automatiquement via `storageKey: "theme"` et `attribute: "class"`.

## Conséquences

- **Zéro FOUC** : le thème est correct dès le premier pixel affiché.
- **Zéro dépendance** : pas de DSFR JS, pas de framework, pas de cookie.
- **Taille négligeable** : ~200 bytes inline, aucun blocking network request.
- **Standard shadcn** : `.dark` class + `localStorage("theme")` — convention partagée avec next-themes.
- **Sécurité** : le contenu du script est une string statique codée en dur, aucune donnée user n'est interpolée. Le innerHTML React est utilisé uniquement pour injecter ce script statique.
- **Limitation** : pas de sync temps réel si l'user change son system theme pendant la session — il faut un `matchMedia` listener (à ajouter au composant switch).

## Liens

- PR #104 — feat/theme-switching
- `src/app/ThemeScript.tsx` — composant script
- `src/app/layout.tsx` — placement dans `<head>`
- `src/app/globals.scss` lignes 115-169 — tokens dark mode
- DDR-0002 — suppression DSFR du root (motivation)
