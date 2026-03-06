# ADR 0025-1 — Annexe : Lazy loading bridges + CSS isolation

- **Date**: 2026-03-06
- **ADR parent**: ADR-0025 — Architecture du theme switching tenant-level

## Contexte

L'ADR-0025 documente le pattern bridge components avec "imports conditionnels statiques (pas de dynamic import)". En pratique, les imports statiques des composants DSFR dans les bridges causent un **leak CSS** : Turbopack/webpack bundle le CSS DSFR dans le chunk même si le composant n'est jamais rendu (thème Default actif). Ce CSS DSFR entre en conflit avec les styles shadcn.

## Complément

### Comportement Turbopack découvert

- `next/dynamic` en **server component** → CSS eagerly bundled (leak impossible à éviter)
- `React.lazy()` en **`"use client"` component** → JS preloaded mais **CSS non injecté** tant que le composant n'est pas rendu

### Pattern adopté

Chaque bridge est splitté en deux fichiers :

```
UIFoo.tsx        — "use client", public API, React.lazy() pour le variant DSFR
UIFooDsfr.tsx    — "use client", import statique @codegouvfr/react-dsfr, rendu DSFR
```

```tsx
// UIFoo.tsx
const UIFooDsfr = lazy(() => import("./UIFooDsfr").then(m => ({ default: m.UIFooDsfr })));

if (theme === "Dsfr") return <Suspense><UIFooDsfr {...props} /></Suspense>;
return <ShadcnFoo {...props} />;
```

### Liste complète des bridges (13)

| Bridge | DSFR variant | Default variant |
|--------|-------------|-----------------|
| UIAlert | DSFR Alert | shadcn Alert |
| UIBadge | DSFR Badge | shadcn Badge |
| UIButton | DSFR Button | shadcn Button |
| UIButtonsGroup | DSFR ButtonsGroup | Tailwind flex |
| UICard | DSFR Card | shadcn Card |
| UIInput | DSFR Input | shadcn Input + Label |
| UILabel | DSFR label text | shadcn Label |
| UIModal | DSFR createModal() | shadcn Dialog |
| UISeparator | `<hr>` | shadcn Separator |
| UISkeleton | CSS var | shadcn Skeleton |
| UITable | Default only | shadcn Table |
| UITag | DSFR Tag | shadcn Badge outline |
| UITooltip | DSFR Tooltip | shadcn Tooltip |

### UIModal — cas particulier

`createModal()` de react-dsfr est impératif (module-level factory, `.open()` / `.close()`). Le bridge `UIModalDsfr` le wrappe dans une API déclarative :
- `useRef` pour appeler `createModal()` une seule fois par instance
- `useEffect` sync `open` prop → `.open()` / `.close()`
- Événement `dsfr.conceal` sur le dialog → callback `onClose`

### DsfrShell — pages standalone

Pour les pages hors du tenant layout (ex: `/showcase`), le CSS DSFR est chargé via `DsfrShell` (`"use client"`, `next/dynamic({ ssr: false })`), qui importe `dsfr_plus_icons.css` + `DsfrProvider` + `StartDsfrOnHydration`.

## Impact sur l'ADR parent

- La phrase "pas de dynamic import" dans les conséquences **Performance** est corrigée par cette annexe — les bridges utilisent désormais `React.lazy()`
- Le reste de l'ADR reste inchangé (UIProvider, getTheme, ThemeInjector, guards .gouv.fr, feature flag)

## Liens

- DDR-0002-1 — Annexe CSS isolation (spécifications CSS)
- `src/ui/bridge/` — 13 bridges + 9 variants DSFR
- `src/app/showcase/` — page de test visuel dual-theme
