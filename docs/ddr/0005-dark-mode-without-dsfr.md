# DDR 0005 — Dark mode sans DSFR (ThemeScript)

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

Avant la PR #104, le dark mode était géré par le JavaScript DSFR (`window.dsfr.start()`) qui lit `localStorage("scheme")` et applique `data-fr-scheme` + `data-fr-theme` sur `<html>`. Avec la suppression du DSFR du root (DDR-0002), on a besoin d'un mécanisme autonome pour le dark mode sur les pages non-DSFR.

Contrainte critique : **pas de FOUC** (Flash of Unstyled Content) — le thème doit être appliqué avant le premier paint.

## Décision

Un **script inline bloquant** dans `<head>` (`ThemeScript`) qui lit `localStorage("scheme")` et `prefers-color-scheme`, puis applique `data-fr-theme="dark"|"light"` sur `<html>` avant que le navigateur ne rende quoi que ce soit.

## Options envisagées

- **Option A : `useEffect` côté client** — trop tard, le composant React monte après le premier paint → FOUC garanti (flash blanc → dark).
- **Option B : Cookie + RSC** — pas de FOUC si le serveur connaît le thème, mais ajoute un cookie supplémentaire et ne fonctionne pas en static rendering.
- **Option C : Script inline bloquant** ✅ — zéro FOUC, zéro dépendance serveur, compatible SSG et SSR. Le script est minuscule (~200 bytes) et s'exécute avant le premier paint.

## Spécifications

### Composant `ThemeScript` (`src/app/ThemeScript.tsx`)

Le composant injecte un IIFE minifié via React `script` + innerHTML. Le contenu est une **string statique trusted** (pas d'input user, pas d'injection possible).

### Logique de détection

```
1. Lire localStorage("scheme")
2. Si "dark"  → dark mode
3. Si "light" → light mode
4. Sinon      → prefers-color-scheme media query (system preference)
5. Appliquer data-fr-theme="dark"|"light" sur <html>
```

### Clé localStorage

On réutilise la clé `"scheme"` (identique au DSFR) pour la compatibilité :
- Un user qui passe d'un tenant DSFR au root garde sa préférence.
- Le DSFR JS sur les tenants lit/écrit la même clé → pas de désync.

### Attribut CSS

On utilise `data-fr-theme` (pas `data-ui-theme`) comme sélecteur dark mode pour deux raisons :
1. **Compatibilité DSFR** : les tenants DSFR utilisent déjà `data-fr-theme` pour le dark mode.
2. **Un seul sélecteur** : `[data-ui-theme="Default"][data-fr-theme="dark"]` fonctionne pour les tokens CSS.

### Placement dans le layout

Le script est placé dans `<head>` du root layout (`src/app/layout.tsx`), avant le `<body>`.

```html
<html lang="fr" data-ui-theme="Default" data-fr-theme="light">
  <head>
    <!-- ThemeScript — bloquant, s'exécute avant le paint -->
  </head>
```

Le `data-fr-theme="light"` en attribut statique est le fallback si le script échoue (try/catch) ou si JavaScript est désactivé.

### Intégration avec le switch thème

Le composant de switch dark/light (à implémenter) devra :
1. Écrire dans `localStorage.setItem("scheme", "dark"|"light")`
2. Appliquer `document.documentElement.setAttribute("data-fr-theme", "dark"|"light")`

## Conséquences

- **Zéro FOUC** : le thème est correct dès le premier pixel affiché.
- **Zéro dépendance** : pas de DSFR JS, pas de framework, pas de cookie.
- **Taille négligeable** : ~200 bytes inline, aucun blocking network request.
- **Compatibilité DSFR** : la même clé `"scheme"` est partagée → transition seamless entre root et tenants.
- **Sécurité** : le contenu du script est une string statique codée en dur, aucune donnée user n'est interpolée. Le innerHTML React est utilisé uniquement pour injecter ce script statique.
- **Limitation** : pas de sync temps réel si l'user change son system theme pendant la session — il faut un `matchMedia` listener (à ajouter au composant switch).

## Liens

- PR #104 — feat/theme-switching
- `src/app/ThemeScript.tsx` — composant script
- `src/app/layout.tsx` — placement dans `<head>`
- `src/app/globals.scss` lignes 115-169 — tokens dark mode
- DDR-0002 — suppression DSFR du root (motivation)
