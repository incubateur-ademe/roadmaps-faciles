# ADR 0008 — Unification de la gestion d’autorisation (assertSession)
- **Date**: 2025-10-08
- **Statut**: Accepted

## Contexte
Le code comportait plusieurs approches d’autorisation : vérification d’un admin global (`isAdmin`), membership de tenant, etc.  
Cette hétérogénéité rendait la logique difficile à maintenir et à composer.  
Nous avions besoin d’une API unifiée et typée pour contrôler les accès à plusieurs niveaux (global / tenant) tout en restant cohérente avec l’architecture DDD.

## Décision
Création d’une fonction utilitaire `assertSession()` :
- Vérifie la présence d’une session (`auth()`).
- Permet de définir des règles d’accès basées sur :
  - un **rootUser** (niveau global),
  - un **tenantUser** (niveau tenant courant).
- Chaque niveau peut exiger un rôle et/ou un statut, via `min` (hiérarchique) ou `only` (strict).
- Le rôle `INHERITED` est résolu via le `userRepo` (rôle racine).
- La priorité d’évaluation est **rootUser > tenantUser**.
- En cas d’échec, l’utilitaire peut soit :
  - lever une `UnexpectedSessionError`, soit
  - invoquer `forbidden()` (Next.js).

## Options envisagées
### Option A — Étendre le système existant (`admin`, `isTenantAdmin`, etc.)
- ✅ Simple à intégrer à court terme.
- ❌ Multiplication des helpers / conditions.
- ❌ Peu extensible pour d’autres contextes (ex: workspace, project).

### Option B — Nouveau module `assertSession` typé et hiérarchique (**choisi**)
- ✅ Typé, clair, homogène (`rootUser`, `tenantUser`).
- ✅ Extensible (autres scopes à venir).
- ✅ Compatible avec les Server Actions (pas de dépendance client).
- ⚠️ Légèrement plus verbeux à l’appel.

## Conséquences
- Simplification des règles d’accès.
- Alignement avec le modèle DDD (`repo`, `service`, `lib/utils`).
- Réduction du risque d’erreur sur les vérifications multi-niveaux.
- Nécessite d’étendre le type `Session` (`role`, `status`).
- Migration progressive à prévoir pour remplacer les anciens guards (`assertAdmin`, `assertTenantMember`, etc.).

## Liens
- PR #18 — Introduction de `assertSession`
- `lib/utils/auth.ts`
