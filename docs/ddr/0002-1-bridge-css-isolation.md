# DDR 0002-1 — Annexe : Bridge CSS isolation via lazy loading

- **Date**: 2026-03-06
- **DDR parent**: DDR-0002 — Chargement conditionnel du DSFR

## Contexte

Le DDR-0002 documente le chargement conditionnel du DSFR au niveau layout (DsfrProvider, ConsentBanner). Mais les bridge components (`src/ui/bridge/`) importaient statiquement les composants DSFR, causant un leak CSS même quand le thème Default était actif.

## Complément

### Bridge CSS isolation

Les bridges utilisent `React.lazy()` + `<Suspense>` pour charger les variants DSFR à la demande :

```tsx
// UIFoo.tsx ("use client")
const UIFooDsfr = lazy(() => import("./UIFooDsfr").then(m => ({ default: m.UIFooDsfr })));

if (theme === "Dsfr") return <Suspense><UIFooDsfr {...props} /></Suspense>;
return <ShadcnFoo {...props} />;
```

Le fichier `UIFooDsfr.tsx` importe statiquement `@codegouvfr/react-dsfr` — ces imports ne sont résolus que quand le lazy module est chargé (= quand le thème est Dsfr).

### DsfrShell (pages standalone)

Pour les pages hors du tenant layout (ex: `/showcase`), le CSS DSFR est injecté via `DsfrShell` :

```tsx
// DsfrShell.tsx ("use client") — chargé via dynamic({ ssr: false })
import "@codegouvfr/react-dsfr/assets/dsfr_plus_icons.css";
<DsfrProvider lang={lang}>
  <StartDsfrOnHydration />
  {children}
</DsfrProvider>
```

### consentManagement — stub temporaire

`consentManagement.tsx` importe `@codegouvfr/react-dsfr/consentManagement`, tiré dans le root layout via `TrackingProvider → useConsent`. Temporairement stubbed pour couper cette chaîne. À résoudre proprement (lazy import ou extraction) avant merge.

## Impact sur le DDR parent

- Le tableau "DsfrProvider → Oui (toujours)" reste vrai pour le tenant layout
- Le CSS DSFR est maintenant isolé aussi au niveau des bridges, pas seulement au niveau layout
- Le root layout reste DSFR-free (inchangé)

## Liens

- ADR 0025-1 — Lazy loading bridges (détails architecture)
- `src/ui/bridge/` — 13 bridges
- `src/app/showcase/` — page de test visuel
