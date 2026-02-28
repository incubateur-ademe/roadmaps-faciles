# Plan : Theme Switching DSFR ↔ shadcn/ui — Phases 3 à 8

**Date** : 2026-02-27
**Issue** : #101
**Branche** : `feat/theme-switching`
**Pré-requis** : Phases 0-2 commitées (commit `d2258c8`)

## Rappel — Ce qui est fait (Phases 0-2)

- Prisma : enum `UiTheme` + champ `uiTheme` sur `TenantSettings`
- Zod : `uiThemeSchema` + intégré au schéma `TenantSettings`
- Feature flag : `themeSwitching` (désactivé par défaut)
- i18n : clés flag + sélecteur admin (fr/en)
- UI abstraction : `UIProvider`, `useUI()`, `getTheme()`, `cn()`, types, barrel, alias `@/ui`
- shadcn : 25 composants dans `src/ui/shadcn/`, CSS variables scopées `[data-ui-theme="Default"]`
- Stubs : `Header`, `Footer`, `RootHeader`, `RootFooter` dans `src/ui/shadcn/`
- `use-mobile.ts` hook (useSyncExternalStore)

## Décisions architecturales

| Sujet | Choix | Raison |
|-------|-------|--------|
| Injection thème HTML | `data-ui-theme` sur `<html>` | Les CSS variables shadcn sont scopées par cet attribut ; un seul point d'injection |
| Root layout | shadcn NOW | ADEME n'est pas gouv.fr, le root doit être shadcn dès le départ |
| Bridge strategy | "Shared logic, separate shells" | Abstraction fine sur les atomes (~10 wrappers), pas d'abstraction sur les composés, conditional rendering ponctuel |
| Dark mode (shadcn) | Réutilise `data-fr-theme` existant | Cohérence avec le mécanisme DSFR déjà en place ; migration `next-themes` possible plus tard |

---

## Phase 3 — Wiring du thème dans les layouts

### Objectif
Injecter `data-ui-theme` sur `<html>`, alimenter `UIProvider`, et rendre les layouts conditionnels.

### 3.1 — Attribut `data-ui-theme` sur `<html>`

**Fichier** : `src/app/layout.tsx` (root layout)

- Lire le thème :
  - Pages root (hors `[domain]`) : toujours `"Default"` (pas de tenant)
  - Pages tenant : résolu via `getTheme(settings)` dans le layout `[domain]`
- Ajouter `data-ui-theme={theme}` sur `<html>` dans le root layout
- Le root layout a besoin du thème pour l'attribut HTML → deux options :
  1. **Option A** : passer le thème via un cookie serveur (set dans le layout `[domain]`, lu dans root layout)
  2. **Option B** : toujours `"Default"` dans root layout, override via `[domain]` layout avec un script inline ou un composant client qui modifie l'attribut
- **Recommandation** : Option B — le root layout met `data-ui-theme="Default"`, le layout `[domain]` injecte un `<ThemeInjector theme={resolvedTheme} />` composant client qui fait `document.documentElement.dataset.uiTheme = theme` dans un `useEffect`. Ça évite de mélanger la logique tenant dans le root layout.

**Fichier à créer** : `src/ui/ThemeInjector.tsx`

```tsx
"use client";

import { useEffect } from "react";

import { type UiTheme } from "./types";

export const ThemeInjector = ({ theme }: { theme: UiTheme }) => {
  useEffect(() => {
    document.documentElement.dataset.uiTheme = theme;
  }, [theme]);
  return null;
};
```

### 3.2 — UIProvider dans les layouts

**Fichier** : `src/app/layout.tsx`

- Wrapper `{children}` avec `<UIProvider value="Default">` (root = toujours Default)

**Fichier** : `src/app/[domain]/(domain)/layout.tsx`

- Résoudre le thème : `const theme = getTheme(settings)`
- Wrapper avec `<UIProvider value={theme}>`
- Ajouter `<ThemeInjector theme={theme} />`

### 3.3 — Layout conditionnel tenant

**Fichier** : `src/app/[domain]/(domain)/layout.tsx`

Le layout tenant doit rendre le bon Header/Footer selon le thème :

```tsx
import { Header as ShadcnHeader } from "@/ui/shadcn/Header";
import { Footer as ShadcnFooter } from "@/ui/shadcn/Footer";
// DSFR imports existants...

// Dans le rendu :
{theme === "Dsfr" ? <DsfrHeader ... /> : <ShadcnHeader ... />}
{children}
{theme === "Dsfr" ? <DsfrFooter ... /> : <ShadcnFooter ... />}
```

### 3.4 — Root layout → shadcn

Le root layout (`src/app/(default)/`) utilise actuellement le DSFR. Puisque ADEME n'est pas gouv.fr :

- Remplacer le header/footer DSFR par les stubs shadcn `RootHeader` / `RootFooter`
- Garder le `DsfrProvider` dans le root layout (il est nécessaire pour le bon fonctionnement des tenants DSFR qui transitent par le même root)
- Alternative : si le `DsfrProvider` cause des conflits CSS avec shadcn, le conditionner ou le déplacer dans le layout `[domain]` uniquement

**Fichiers impactés** :
- `src/app/(default)/layout.tsx` — remplacer Header/Footer
- `src/app/(default)/page.tsx` — adapter le contenu si nécessaire (le contenu de la landing utilise peut-être des classes DSFR)

### Vérification Phase 3

1. `pnpm lint --fix` + `pnpm build` clean
2. Dev server : page root affiche `data-ui-theme="Default"` sur `<html>`
3. Dev server : page tenant (DB `uiTheme = Default`) affiche `data-ui-theme="Default"`
4. Modifier manuellement en DB `uiTheme = Dsfr` → page tenant affiche `data-ui-theme="Dsfr"` et header/footer DSFR
5. `useUI()` retourne la bonne valeur dans un composant client

---

## Phase 4 — Admin UI : sélecteur de thème

### Objectif
Permettre aux admins root de changer le thème d'un tenant via l'UI d'administration.

### 4.1 — Server action

**Fichier** : `src/app/[domain]/(domain)/(tenant-admin)/admin/settings/` (ou nouvel endpoint)

- Ajouter `uiTheme` au formulaire de settings tenant
- Guard : `isFeatureEnabled("themeSwitching", session)` — si le flag est off, le champ n'apparaît pas
- Server action : update `TenantSettings.uiTheme` + audit log (`TENANT_SETTINGS_UPDATE` existant ou nouveau `TENANT_UI_THEME_UPDATE`)

### 4.2 — UI admin settings

**Fichier** : le formulaire settings tenant existant (probablement dans `admin/settings/`)

- Ajouter un `Select` (DSFR, car on est dans l'admin tenant qui est toujours DSFR pour l'instant) :
  - Label : `t("domainAdmin.general.uiTheme.label")`
  - Options : `t("domainAdmin.general.uiTheme.options.Default")`, `t("domainAdmin.general.uiTheme.options.Dsfr")`
- Conditionné par `useFeatureFlag("themeSwitching")`

### 4.3 — Root admin override

**Fichier** : UI root admin (gestion des tenants)

- Permettre au root admin de forcer le thème d'un tenant
- Même select mais dans le contexte root admin

### 4.4 — Auto-détection `.gouv.fr`

**Fichier** : use case `CreateNewTenant` ou `UpdateTenantSettings`

- À la création d'un tenant avec un domaine `*.gouv.fr` : auto-set `uiTheme = Dsfr`
- Suggestion dans l'UI : si le domaine contient `.gouv.fr`, pré-sélectionner "DSFR" et afficher un message explicatif
- Le root admin peut toujours override manuellement

### Vérification Phase 4

1. Flag `themeSwitching` OFF → le select n'apparaît pas dans l'admin
2. Flag ON → le select est visible, la valeur se sauvegarde correctement
3. Changer le thème → rechargement de la page tenant reflète le nouveau thème (header/footer switch)
4. Audit log : l'action est tracée
5. Créer un tenant `test.gouv.fr` → `uiTheme` est auto-set à `Dsfr`

---

## Phase 5 — Composants bridge (wrappers atomiques)

### Objectif
Créer des wrappers légers pour les composants UI atomiques qui ont un équivalent dans les deux design systems.

### Stratégie bridge

**Règle** : un wrapper bridge existe UNIQUEMENT si :
1. Le composant est utilisé dans des pages/sections partagées (pas layout-specific)
2. Les APIs DSFR et shadcn sont suffisamment proches pour qu'un wrapper soit simple (<20 lignes)
3. Le composant est un "atome" (pas un composé)

### 5.1 — Wrappers à créer

**Dossier** : `src/ui/bridge/`

Chaque wrapper :
- Importe `useUI()` pour résoudre le thème
- Rend le composant DSFR ou shadcn selon le thème
- Expose une API unifiée (intersection des props utiles)

| Wrapper | DSFR source | shadcn source | Notes |
|---------|-------------|---------------|-------|
| `UIButton` | `@codegouvfr/react-dsfr Button` | `@/ui/shadcn/button` | Map `priority` → `variant` |
| `UIInput` | `@codegouvfr/react-dsfr Input` | `@/ui/shadcn/input` | Le plus délicat — DSFR Input inclut label+hint+error |
| `UIBadge` | `@codegouvfr/react-dsfr Badge` | `@/ui/shadcn/badge` | Map `severity` → `variant` |
| `UIAlert` | `@codegouvfr/react-dsfr Alert` | `@/ui/shadcn/alert` | Map `severity` → variant + icon |
| `UISelect` | `@codegouvfr/react-dsfr Select` | `@/ui/shadcn/select` | DSFR Select est un <select> natif, shadcn est Radix |
| `UICard` | DSFR `.fr-card` (ou custom) | `@/ui/shadcn/card` | Wrap structure seulement |
| `UILabel` | DSFR `<label>` avec classes | `@/ui/shadcn/label` | Simple |
| `UISeparator` | `<hr className="fr-hr">` | `@/ui/shadcn/separator` | Trivial |
| `UISkeleton` | Custom DSFR skeleton | `@/ui/shadcn/skeleton` | Trivial |
| `UITooltip` | `@codegouvfr/react-dsfr Tooltip` | `@/ui/shadcn/tooltip` | API assez différente — évaluer si ça vaut le coup |

### 5.2 — Pattern type d'un wrapper

```tsx
"use client";

import { type ComponentProps } from "react";

import { useUI } from "@/ui";

import { Button as ShadcnButton } from "@/ui/shadcn/button";

// Map des variants shadcn → DSFR priority
const VARIANT_TO_PRIORITY = {
  default: "primary",
  secondary: "secondary",
  destructive: "primary", // + rouge via DSFR iconId
  outline: "tertiary no outline",
  ghost: "tertiary no outline",
  link: "tertiary no outline",
} as const;

type UIButtonProps = ComponentProps<typeof ShadcnButton> & {
  // Props additionnelles si besoin
};

export const UIButton = ({ variant = "default", ...props }: UIButtonProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    // Import dynamique ou import statique selon la stratégie tree-shaking
    const DsfrButton = require("@codegouvfr/react-dsfr/Button").Button;
    return <DsfrButton priority={VARIANT_TO_PRIORITY[variant]} {...mappedProps} />;
  }

  return <ShadcnButton variant={variant} {...props} />;
};
```

**Note** : le `require()` dynamique est moche mais nécessaire pour le tree-shaking côté client. Alternative : `React.lazy()` + `Suspense` ou `next/dynamic`. À évaluer en implem.

### 5.3 — Barrel export bridge

**Fichier** : `src/ui/bridge/index.ts`

Ré-exporte tous les wrappers.

### 5.4 — Migration incrémentale des pages

**Pas dans cette phase.** Les wrappers bridge sont créés mais pas encore utilisés dans les pages. La migration se fera page par page, probablement dans des PRs séparées post-merge de cette branche.

### Vérification Phase 5

1. Chaque wrapper compile sans erreur TS
2. `pnpm build` clean
3. Storybook ou page de test manuelle : chaque wrapper rend correctement en mode Default ET Dsfr
4. Pas de regression DSFR (les pages existantes n'utilisent pas encore les wrappers)

---

## Phase 6 — Root site migration shadcn

### Objectif
Migrer les pages du root site (hors `[domain]`) du DSFR vers shadcn.

### 6.1 — Inventaire pages root

Lister toutes les pages dans `src/app/(default)/` :
- Landing page (`page.tsx`)
- Pages légales (mentions légales, CGU, accessibilité, confidentialité)
- Pages auth (login, register, etc.)
- Pages admin root (`/admin/*`)
- Documentation (`/doc/*`)

### 6.2 — Landing page

**Fichier** : `src/app/(default)/page.tsx`

- Réécrire avec les composants shadcn
- Utiliser `RootHeader` et `RootFooter` (déjà dans le layout)
- Design plus moderne que le DSFR (c'est le point — ADEME n'est pas gouv.fr)

### 6.3 — Pages légales

**Fichiers** : routes légales dans `src/app/(default)/`

- `@incubateur-ademe/legal-pages-react` génère du HTML/DSFR → vérifier si les composants acceptent un mode non-DSFR ou si on doit wrapper
- Si les legal-pages sont DSFR-only, les garder telles quelles dans un wrapper DSFR minimal (acceptable — c'est du contenu statique)

### 6.4 — Pages auth root

**Fichiers** : `src/app/(default)/(auth)/`

- Login, register, 2FA setup, etc.
- Migrer vers shadcn : formulaires avec `Input`, `Button`, `Card`, `Label`
- Les composants auth sont souvent simples (formulaire + CTA)

### 6.5 — Admin root

**Fichiers** : `src/app/(default)/(root-admin)/admin/`

- Gestion tenants, feature flags, etc.
- **Décision** : migrer ou garder DSFR ?
- **Recommandation** : garder DSFR pour l'admin root dans un premier temps. C'est interne, peu visible, et la migration serait coûteuse pour peu de valeur. Prioriser le public-facing.

### 6.6 — Documentation

**Fichiers** : `src/app/doc/`

- Fumadocs avec bridge DSFR (`dsfr-theme.css`)
- **Décision** : Fumadocs a son propre design system. Le bridge CSS existant mappe DSFR → Fumadocs vars.
- **Recommandation** : créer un bridge CSS alternatif shadcn → Fumadocs vars, actif quand `[data-ui-theme="Default"]`. Le contenu MDX ne change pas.

### Vérification Phase 6

1. Toutes les pages root (au minimum landing + auth) rendent en shadcn
2. Pas de classes DSFR visibles dans le markup des pages migrées (sauf legal-pages si gardées telles quelles)
3. Dark mode fonctionne via `data-fr-theme="dark"` (les CSS vars shadcn dark sont scopées dessus)
4. Mobile responsive (les composants shadcn sont responsive par défaut)
5. `pnpm build` clean, tests passent

---

## Phase 7 — DsfrProvider conditionnel

### Objectif
Éviter de charger le JS/CSS DSFR quand le thème est shadcn.

### 7.1 — Analyse d'impact

Le `DsfrProvider` (de `@codegouvfr/react-dsfr`) est actuellement dans le root layout et charge :
- Le CSS DSFR (icons, composants, utility classes)
- Le JS DSFR (accordion, modal, tabs, etc.)
- Les polices Marianne
- Le système de thème `data-fr-scheme`/`data-fr-theme`

**Si on le retire pour les pages shadcn** : plus de CSS DSFR chargé → gain de perf significatif.
**Risque** : les composants bridge qui rendent du DSFR en mode Dsfr ont besoin du provider.

### 7.2 — Stratégie

- **Root layout** : NE PAS inclure `DsfrProvider`
- **Layout `[domain]` avec `theme === "Dsfr"`** : inclure `DsfrProvider`
- **Layout `[domain]` avec `theme === "Default"`** : NE PAS inclure
- **Pages root** : jamais de `DsfrProvider` (sauf legal-pages si nécessaire)

**Attention** : `startReactDsfr()` dans `src/app/StartDsfr.tsx` doit aussi être conditionné. Il initialise le registre DSFR côté client.

### 7.3 — Implémentation

**Fichier** : `src/app/layout.tsx`

- Retirer `DsfrProvider` du root layout
- Retirer `StartDsfr` du root layout

**Fichier** : `src/app/[domain]/(domain)/layout.tsx`

```tsx
{theme === "Dsfr" && (
  <>
    <StartDsfr />
    <DsfrProvider ...>
      <DsfrHeader ... />
      {children}
      <DsfrFooter ... />
    </DsfrProvider>
  </>
)}
{theme === "Default" && (
  <>
    <ShadcnHeader ... />
    {children}
    <ShadcnFooter ... />
  </>
)}
```

### 7.4 — Vérification DSFR conditionnel

1. Page tenant DSFR : CSS DSFR chargé, fonctionnalités DSFR opérationnelles
2. Page tenant shadcn : CSS DSFR NON chargé (vérifier via DevTools Network)
3. Pages root : CSS DSFR NON chargé
4. Pas de FOUC (Flash of Unstyled Content) sur les pages DSFR au chargement

---

## Phase 8 — Tests

### Objectif
Couvrir le theme switching à tous les niveaux de tests.

### 8.1 — Tests unitaires (`testu/`)

| Test | Fichier |
|------|---------|
| `uiThemeSchema` validation | `testu/model/TenantSettings.test.ts` (existant, ajouter cas) |
| `getTheme()` server helper | `testu/ui/server.test.ts` (nouveau) |
| `cn()` utility | `testu/ui/cn.test.ts` (nouveau) |

### 8.2 — Tests d'intégration (`testi/`)

| Test | Fichier |
|------|---------|
| `UpdateTenantSettings` use case avec `uiTheme` | `testi/useCases/tenantSettings/UpdateTenantSettings.test.ts` (existant, ajouter cas) |
| `CreateNewTenant` auto-détection `.gouv.fr` | `testi/useCases/tenant/CreateNewTenant.test.ts` (existant, ajouter cas) |
| Feature flag `themeSwitching` gate | `testi/featureFlags/themeSwitching.test.ts` (nouveau) |

### 8.3 — Tests E2E (`teste2e/`)

| Test | Scénario |
|------|----------|
| Theme attribute injection | Naviguer sur un tenant Default → `data-ui-theme="Default"` sur `<html>` |
| Theme attribute Dsfr | Modifier le thème en DB, recharger → `data-ui-theme="Dsfr"` |
| Admin theme selector | Admin active le flag, change le thème, vérifie le rendu |
| Root site shadcn | Pages root n'ont pas de classes DSFR |
| Header/Footer switch | Tenant Default affiche le header shadcn, tenant Dsfr affiche le header DSFR |

### 8.4 — Test seed

**Fichier** : `prisma/test-seed.ts`

- Ajouter un deuxième tenant E2E avec `uiTheme: "Default"` (le tenant existant `e2e` reste en `Dsfr` ou `Default` selon le test)
- Ou : utiliser le tenant E2E existant et modifier `uiTheme` dans les tests via API

### Vérification Phase 8

1. `pnpm test` — tous les tests unitaires + intégration passent
2. `pnpm test:e2e` — les scénarios E2E theme switching passent
3. CI green

---

## Ordre d'exécution recommandé

```
Phase 3 (wiring layouts) ─── pré-requis pour tout le reste
  │
  ├── Phase 4 (admin UI) ─── peut être en parallèle avec 5/6
  │
  ├── Phase 5 (bridge components) ─── indépendant de 4
  │
  └── Phase 6 (root migration) ─── dépend de 3.4 (root → shadcn dans layout)
       │
       └── Phase 7 (DsfrProvider conditionnel) ─── dépend de 6 (root sans DSFR)
            │
            └── Phase 8 (tests) ─── en dernier, ou en continu à chaque phase
```

**Recommandation** : attaquer Phase 3 → Phase 6 → Phase 7 en séquence, Phase 4 + Phase 5 en parallèle quand Phase 3 est done. Phase 8 en continu.

---

## Risques identifiés

| Risque | Impact | Mitigation |
|--------|--------|------------|
| FOUC au chargement (shadcn vars pas encore appliquées) | UX dégradée | Script inline dans `<head>` pour set `data-ui-theme` avant le paint |
| `DsfrProvider` retiré casse des composants inattendus | Runtime errors | Phase 7 en dernier, tests E2E avant/après |
| Wrappers bridge trop complexes | Maintenance nightmare | Limiter à ~10 atomes, review stricte du LOC par wrapper |
| CSS DSFR leak dans les pages shadcn | Styles pollués | `DsfrProvider` conditionnel (Phase 7) résout ça |
| `legal-pages-react` dépend du DSFR | Pages légales cassées en shadcn | Garder un wrapper DSFR minimal pour ces pages |
| Dark mode incohérent entre DSFR et shadcn | UX dégradée | Tester systématiquement les deux modes à chaque phase |

---

## Orchestration multi-agents (TeamCreate + Task)

### Architecture de l'équipe

L'implémentation des phases 3-8 se prête parfaitement à une exécution parallélisée avec coordination. La structure d'équipe recommandée :

```
┌─────────────────────────────────────────────────────────┐
│                    COORDINATEUR (lead)                   │
│  Rôle : orchestre, dispatch, merge, décisions bloquantes│
│  Type : general-purpose                                 │
│  Mode : acceptEdits                                     │
│  Isolation : aucune (travaille sur la branche principale│
│              feat/theme-switching)                       │
└──────────┬──────────────┬──────────────┬────────────────┘
           │              │              │
    ┌──────▼──────┐ ┌─────▼──────┐ ┌────▼───────┐
    │  AGENT-P4   │ │  AGENT-P5  │ │  AGENT-P6  │
    │ Admin UI    │ │  Bridge    │ │ Root migr. │
    │ worktree    │ │  worktree  │ │  worktree  │
    │ isolé       │ │  isolé     │ │  isolé     │
    └──────┬──────┘ └─────┬──────┘ └────┬───────┘
           │              │              │
           └──────────────┼──────────────┘
                          │
                   ┌──────▼──────┐
                   │  REVIEWER   │
                   │ Code review │
                   │ + cohérence │
                   │ cross-agent │
                   └─────────────┘
```

### Rôles détaillés

#### 1. Coordinateur (soi-même ou agent dédié)

**Responsabilités** :
- Exécuter Phase 3 en premier (séquentiel, bloquant — fondation pour tout le reste)
- Créer l'équipe et les tasks après Phase 3
- Lancer les agents Phase 4/5/6 en parallèle (worktrees isolés)
- Merger les branches des worktrees dans `feat/theme-switching` après review
- Exécuter Phase 7 (séquentiel, dépend de 6)
- Coordonner Phase 8 (tests) à la fin

**Pattern de lancement** :

```
# Étape 1 — Phase 3 (le coordinateur fait ça lui-même)
# Pas de parallélisation possible, c'est la fondation

# Étape 2 — Créer l'équipe
TeamCreate({ team_name: "theme-switching", description: "Theme switching phases 4-6 parallel" })

# Étape 3 — Créer les tasks
TaskCreate({ subject: "Phase 4 — Admin UI sélecteur de thème", ... })
TaskCreate({ subject: "Phase 5 — Composants bridge atomiques", ... })
TaskCreate({ subject: "Phase 6 — Root site migration shadcn", ... })
TaskCreate({ subject: "Review Phase 4", ... })  # bloqué par Phase 4
TaskCreate({ subject: "Review Phase 5", ... })  # bloqué par Phase 5
TaskCreate({ subject: "Review Phase 6", ... })  # bloqué par Phase 6

# Étape 4 — Lancer les 3 agents en parallèle (worktrees isolés)
Task({
  subagent_type: "general-purpose",
  name: "agent-p4",
  team_name: "theme-switching",
  isolation: "worktree",
  prompt: "Implémenter Phase 4 du plan docs/plans/2026-02-27-theme-switching-phases-3-8.md..."
})
Task({
  subagent_type: "general-purpose",
  name: "agent-p5",
  team_name: "theme-switching",
  isolation: "worktree",
  prompt: "Implémenter Phase 5 du plan docs/plans/2026-02-27-theme-switching-phases-3-8.md..."
})
Task({
  subagent_type: "general-purpose",
  name: "agent-p6",
  team_name: "theme-switching",
  isolation: "worktree",
  prompt: "Implémenter Phase 6 du plan docs/plans/2026-02-27-theme-switching-phases-3-8.md..."
})

# Étape 5 — Reviewer après chaque agent
# (voir section Reviewer ci-dessous)
```

#### 2. Agents implémenteurs (agent-p4, agent-p5, agent-p6)

**Type** : `general-purpose` avec `isolation: "worktree"`

Chaque agent reçoit un prompt structuré qui inclut :
- Le contexte du plan (référence au fichier `.md`)
- La phase spécifique à implémenter
- Les conventions du projet (référence à `CLAUDE.md`)
- Les critères de vérification de la phase
- L'instruction de lancer `pnpm lint --fix` + `pnpm build` avant de marquer la task comme complétée

**Prompt template pour chaque agent** :

```
Tu travailles sur le projet Kokatsuna (Next.js 16, multi-tenant).
Lis CLAUDE.md pour les conventions du projet.
Lis docs/plans/2026-02-27-theme-switching-phases-3-8.md pour le contexte complet.

Ta mission : implémenter la Phase {N} — {titre}.

Étapes :
1. Lis les fichiers pertinents listés dans le plan
2. Implémente chaque sous-étape ({N}.1, {N}.2, etc.)
3. Lance `pnpm lint --fix` et corrige les erreurs
4. Lance `pnpm build` et corrige les erreurs TS
5. Commit avec le message : "feat(ui): {description} (#101)"
6. Marque ta task comme completed

Critères de vérification : [copier depuis le plan]
```

**Contraintes worktree** :
- Chaque worktree part de `feat/theme-switching` (après Phase 3 committée)
- L'agent commite sur sa branche worktree
- Le coordinateur merge ensuite dans `feat/theme-switching`

#### 3. Reviewer

**Type** : `feature-dev:code-reviewer`

Le reviewer intervient APRÈS chaque agent, pas en parallèle. Son rôle :

**Vérifications systématiques** :
1. **Conventions projet** : ESLint clean, imports triés, pas de default exports non autorisés, alias `@/` respectés
2. **Cohérence cross-agent** : les 3 agents utilisent les mêmes patterns (nommage, structure, imports)
3. **Pas de régression DSFR** : les pages DSFR existantes ne sont pas cassées
4. **Sécurité** : audit log présent pour les mutations, feature flag vérifié, pas de données sensibles exposées
5. **Performance** : pas d'import inutile de DSFR dans le bundle shadcn (et vice-versa)
6. **Types** : pas de `any`, pas de `as unknown as`, les generics sont corrects

**Prompt du reviewer** :

```
Tu es le reviewer du projet Kokatsuna (theme switching feature).
Lis CLAUDE.md pour les conventions du projet.
Lis docs/plans/2026-02-27-theme-switching-phases-3-8.md pour le contexte.

Review le code de la Phase {N} :
- Branche worktree : {path}
- Diff depuis feat/theme-switching : `git diff feat/theme-switching...HEAD`

Checklist :
1. Conventions ESLint / imports / exports respectées
2. Cohérence avec les autres phases (bridge wrappers utilisent les mêmes patterns)
3. Pas de régression DSFR (si applicable)
4. Audit log pour les mutations (si applicable)
5. Feature flag gate (si applicable)
6. CSS variables scopées correctement
7. Pas de DSFR importé dans le bundle shadcn (tree-shaking)

Signale UNIQUEMENT les problèmes high-confidence. Pas de nit-picking.
```

### Séquencement complet

```
Phase 3 ────── (coordinateur, séquentiel)
  │
  ├── commit sur feat/theme-switching
  │
  ├── TeamCreate "theme-switching"
  │
  ├── 3 agents en parallèle (worktrees isolés) :
  │   ├── agent-p4 : Phase 4 (admin UI)
  │   ├── agent-p5 : Phase 5 (bridge)
  │   └── agent-p6 : Phase 6 (root migration)
  │
  ├── Reviewer sur chaque agent (séquentiel ou parallèle, 3 reviews) :
  │   ├── review-p4 → fix si nécessaire → merge dans feat/theme-switching
  │   ├── review-p5 → fix si nécessaire → merge dans feat/theme-switching
  │   └── review-p6 → fix si nécessaire → merge dans feat/theme-switching
  │
  ├── Phase 7 ──── (coordinateur, séquentiel, dépend de 6 merged)
  │   └── review-p7 → fix → merge
  │
  └── Phase 8 ──── (agent tests, ou coordinateur)
      ├── unit tests (rapide, coordinateur peut faire)
      ├── integration tests
      └── E2E tests (plus lourd, agent dédié possible)
```

### Configuration TeamCreate

```json
{
  "team_name": "theme-switching",
  "description": "Implémentation parallèle theme switching phases 4-6 + review"
}
```

### Tasks à créer (avec dépendances)

| ID | Task | Owner | Bloqué par |
|----|------|-------|------------|
| 1 | Phase 4 — Admin UI sélecteur de thème | agent-p4 | — |
| 2 | Phase 5 — Composants bridge atomiques | agent-p5 | — |
| 3 | Phase 6 — Root site migration shadcn | agent-p6 | — |
| 4 | Review Phase 4 | reviewer | 1 |
| 5 | Review Phase 5 | reviewer | 2 |
| 6 | Review Phase 6 | reviewer | 3 |
| 7 | Merge Phase 4 dans feat/theme-switching | coordinateur | 4 |
| 8 | Merge Phase 5 dans feat/theme-switching | coordinateur | 5 |
| 9 | Merge Phase 6 dans feat/theme-switching | coordinateur | 6 |
| 10 | Phase 7 — DsfrProvider conditionnel | coordinateur | 7, 8, 9 |
| 11 | Review Phase 7 | reviewer | 10 |
| 12 | Phase 8 — Tests | agent-tests | 7, 8, 9, 11 |

### Gestion des conflits de merge

Les 3 agents travaillent sur des fichiers majoritairement disjoints :
- **Phase 4** : `src/app/[domain]/.../admin/settings/`, use cases, server actions
- **Phase 5** : `src/ui/bridge/` (nouveau dossier)
- **Phase 6** : `src/app/(default)/` pages root

**Zones de conflit potentiel** :
- `src/app/[domain]/(domain)/layout.tsx` — Phase 4 (settings update) et Phase 6 (imports potentiels). **Mitigation** : Phase 4 ne touche pas le layout, uniquement les settings admin.
- `messages/fr.json` / `messages/en.json` — Phases 4 et 6 ajoutent des clés i18n. **Mitigation** : les clés sont dans des namespaces différents (`domainAdmin.*` vs `root.*`), merge simple.
- `package.json` — si une phase ajoute une dépendance. **Mitigation** : rebase + `pnpm install` après merge.

**Protocole de merge** : toujours rebase le worktree sur `feat/theme-switching` avant de merge (pas de merge commits). Le coordinateur fait le rebase et résout les conflits.

### Quand NE PAS utiliser les sub-agents

- **Phase 3** : toujours en séquentiel par le coordinateur. C'est la fondation, pas parallélisable.
- **Phase 7** : séquentiel, dépend de toutes les phases précédentes mergées.
- **Phase 8** : peut être un seul agent ou le coordinateur. Les tests doivent voir le code final mergé.
- Si le projet est petit ou la session courte : un seul agent qui fait tout séquentiellement est plus simple et évite l'overhead de coordination.

### Estimation du gain

- **Séquentiel** : Phase 3 → 4 → 5 → 6 → 7 → 8 (6 étapes séquentielles)
- **Parallélisé** : Phase 3 → (4 || 5 || 6) → 7 → 8 (4 étapes, dont 1 parallèle ×3)
- **Gain estimé** : ~30-40% de temps en moins sur les phases 4-6, le bottleneck reste Phase 3 et les reviews

---

## TODO post-design tenant

### Screenshots documentation (`public/doc/screenshots/`)

Tous les screenshots sont obsolètes suite au changement de thème (DSFR → shadcn French Blue). **À refaire une fois le design tenant finalisé.**

30 fichiers PNG (15 pages × light + dark) :

| Page | Fichiers | URL tenant |
|------|----------|------------|
| Login | `login-{light,dark}.png` | `/login` |
| Board cartes | `board-cards-{light,dark}.png` | `/board/[slug]?view=cards` |
| Board liste | `board-list-{light,dark}.png` | `/board/[slug]?view=list` |
| Post detail | `post-detail-{light,dark}.png` | `/board/[slug]/post/[id]` |
| Profile | `profile-{light,dark}.png` | `/profile` |
| Roadmap | `roadmap-{light,dark}.png` | `/roadmap` |
| Moderation | `moderation-{light,dark}.png` | `/moderation` |
| Admin General | `admin-general-{light,dark}.png` | `/admin/general` |
| Admin Boards | `admin-boards-{light,dark}.png` | `/admin/boards` |
| Admin Statuses | `admin-statuses-{light,dark}.png` | `/admin/statuses` |
| Admin Members | `admin-members-{light,dark}.png` | `/admin/members` |
| Admin API Keys | `admin-api-keys-{light,dark}.png` | `/admin/api-keys` |
| Admin Webhooks | `admin-webhooks-{light,dark}.png` | `/admin/webhooks` |
| Admin Audit Log | `admin-audit-log-{light,dark}.png` | `/admin/audit-log` |
| Admin Auth | `admin-authentication-{light,dark}.png` | `/admin/authentication` |

**Approche recommandée** : script Playwright qui navigue sur chaque page avec le dev server + données seedées, toggle `data-fr-theme` entre light/dark, et capture les screenshots. Similaire aux E2E mais sans assertions — juste des `.screenshot({ path })`.

**Pré-requis** : design tenant terminé (composants shadcn Header/Footer tenant, pages board/admin/profile migrées).
