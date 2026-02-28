# DDR 0002 — Chargement conditionnel du DSFR

- **Date**: 2026-02-28
- **Statut**: Accepted

## Contexte

Le DSFR (Design System de l'État français) est le design system officiel des services publics. **Légalement, seules les entités autorisées peuvent utiliser la charte de l'État** (Marianne, couleurs officielles, etc.). Notre plateforme est multi-tenant : certains tenants sont des collectivités publiques (= DSFR obligatoire), d'autres non (= DSFR interdit).

Le root (pages d'accueil, documentation, profil) n'est pas un service public → DSFR interdit sur le root.

## Décision

**`DsfrProvider` toujours wrappé dans le tenant layout** car les composants tenant (BoardPost, PostList, etc.) utilisent des hooks DSFR (`useIsDark()`). Seuls le **Header, Footer, et ConsentBanner** switchent en fonction du thème. Le root layout n'a **aucune dépendance** au DSFR.

## Options envisagées

- **Option A : DSFR partout, override CSS pour les non-DSFR** — facile techniquement, mais illégal pour les entités non-publiques. Le CSS DSFR injecte des styles base (link underlines, heading sizes, list resets) quasi impossibles à neutraliser proprement.
- **Option B : Chargement conditionnel** ✅ — `DsfrProvider` + `ConsentBannerAndConsentManagement` wrappés conditionnellement. Clean separation, zéro CSS DSFR sur le root.
- **Option C : Deux apps séparées** — overkill, duplication de code massive.

## Spécifications

### Root layout (`src/app/layout.tsx`)

```tsx
// ZERO import DSFR
import { ThemeScript } from "./ThemeScript";
import { cn } from "@/ui/cn";

<html lang={lang} data-ui-theme="Default" className={cn(styles.app, "snap-y")}>
  <head><ThemeScript /></head>   {/* .dark class toggle avant le 1er paint */}
  <body>
    {/* SessionProvider, NextIntlClientProvider, TrackingProvider, SkeletonTheme */}
    <UIProvider value="Default">
      {children}
    </UIProvider>
  </body>
</html>
```

### Tenant layout (`src/app/[domain]/(domain)/layout.tsx`)

```tsx
const theme = getTheme(tenantSettings);

// DsfrProvider TOUJOURS wrappé — les composants tenant (BoardPost, PostList, etc.)
// utilisent des hooks DSFR (useIsDark, Card, Badge, Tag).
// Seuls Header/Footer/ConsentBanner switchent.
return (
  <UIProvider value={theme}>
    <ThemeInjector theme={theme} />
    <DsfrProvider lang={lang}>
      {theme === "Dsfr" && <ConsentBannerAndConsentManagement />}
      <AppRouterCacheProvider>
        <MuiDsfrThemeProvider>
          {theme === "Dsfr" ? <Header ... /> : <ShadcnHeader ... />}
          {mainContent}
          {theme === "Dsfr" ? <PublicFooter ... /> : <ShadcnFooter ... />}
        </MuiDsfrThemeProvider>
      </AppRouterCacheProvider>
    </DsfrProvider>
  </UIProvider>
);
```

### Attributs de thème

| Attribut | Root | Tenant DSFR | Tenant Default |
|----------|------|-------------|----------------|
| `data-ui-theme` | `"Default"` | `"Dsfr"` | `"Default"` |
| `.dark` class | via ThemeScript | via ThemeScript | via ThemeScript |
| `DsfrProvider` | Non | Oui (toujours) | Oui (toujours) |
| `ConsentBanner` | Non | Oui | Non |

### CSS scoping (`globals.scss`)

Les tokens shadcn sont scopés sous `[data-ui-theme="Default"]`.
Les resets DSFR (link underline, heading sizes) sont aussi scopés sous `[data-ui-theme="Default"]` pour neutraliser le CSS DSFR résiduel quand les deux coexistent.

### SCSS conditionnel (`root.module.scss`)

```scss
:global([data-ui-theme="Default"]) .app {
    background-color: var(--background);
    color: var(--foreground);
}
:global([data-ui-theme="Dsfr"]) .app {
    background-color: var(--background-default-grey);
    color: var(--text-default-grey);
}
```

## Conséquences

- **Légal** : conformité assurée — pas de charte État sur les pages non-autorisées.
- **Performance** : le root ne charge pas le CSS/JS DSFR (~150 Ko+ gzippé).
- **Complexité** : conditionnels `theme === "Dsfr"` pour Header/Footer/ConsentBanner uniquement. `DsfrProvider` et `MuiDsfrThemeProvider` wrappent toujours le tenant content — maintenable tant que les composants tenant dépendent de hooks DSFR.
- **Consent banner** : le root n'a pas de consent banner DSFR. Si du tracking est actif sur le root en prod, il faudra une alternative shadcn.
- **DSFR CSS résiduel** : certains styles DSFR leakent via le global scope (link underlines, heading sizes) — les resets dans `globals.scss` les neutralisent pour le scope `[data-ui-theme="Default"]`.

## Liens

- PR #104 — feat/theme-switching
- `src/app/layout.tsx` — root layout DSFR-free
- `src/app/[domain]/(domain)/layout.tsx` — tenant layout conditionnel
- `src/app/globals.scss` lignes 176-205 — DSFR resets
