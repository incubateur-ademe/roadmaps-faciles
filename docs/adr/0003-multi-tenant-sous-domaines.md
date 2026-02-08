# ADR 0003 — Multi-tenant par sous-domaines
- **Date**: 2025-10-07
- **Statut**: Accepted

## Contexte
Servir des contenus selon un tenant, sans changer l’URL visible pour l’utilisateur final (rewrite).

## Décision
- Détermination du **tenant par le sous-domaine** (ex.: `acme.example.com`).
- **Rewrite** côté edge/server pour mapper le tenant → contenu.
- Stockage du `tenantId` côté DB et propagation côté use cases.
- Possibilité de passer par un domaine custom (ex.: `app.acme.com`).

## Options envisagées
- Paramètre d’URL : moins élégant, SEO moins clair.
- Entêtes custom : complexifie le routing.

## Conséquences
- Besoin d’un wildcard DNS et d’un hosting compatible.
- Besoin potentiellement d'une gestion intermédiaire pour la gestion des domaines customs via CNAME. (à faire)
- Tests E2E pour éviter les fuites de données inter-tenant. (à faire)

## Liens
- README (section multi-tenant), implémentation routing.

---

## Mise à jour — 2026-02-08 (post PR #18)

Le pattern de résolution du tenant a été formalisé et diffère du "rewrite côté edge/server" décrit initialement.

### Pattern actuel : résolution explicite

Le problème fondamental en App Router est que layouts et pages se rendent en parallèle (RSC streaming). Un pattern "set-then-read" (le layout set le tenant, la page le lit) est **incompatible** — la page peut lire avant que le layout n'ait set.

**Solution retenue** : chaque consommateur résout le tenant indépendamment, sans état partagé.

- **Pages** : utilisent `DomainPageHOP` (Higher Order Page) qui résout le tenant depuis le param `[domain]` de l'URL et injecte `{ tenant, settings, domain }` dans les props (`_data`).
  - Fichier : `src/app/[domain]/(domain)/DomainPage.tsx`
- **Server actions** : appellent `getDomainFromHost()` qui lit les headers `x-forwarded-host` / `host` pour déterminer le domaine, puis `getTenantFromDomain()`.
  - Fichier : `src/lib/utils/tenant.ts`
- **Auth** : `assertTenantAdmin(domain)` prend le domaine explicitement.
  - Fichier : `src/lib/utils/auth.ts`

### Conséquences additionnelles
- Pas de singleton, `React.cache()`, ou `AsyncLocalStorage` pour le tenant — toujours explicite.
- Les types `DomainParams` et `DomainProps` sont exportés depuis le layout domain (`src/app/[domain]/(domain)/layout.tsx`).
