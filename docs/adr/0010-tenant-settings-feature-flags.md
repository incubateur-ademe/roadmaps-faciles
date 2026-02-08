# ADR 0010 — Tenant settings comme feature flags serveur
- **Date**: 2026-02-08
- **Statut**: Accepted

## Contexte
Chaque tenant peut activer/désactiver des fonctionnalités (votes, commentaires, édition de posts, accès privé, etc.). Ces paramètres doivent être appliqués de manière fiable côté serveur, pas uniquement côté client.

## Décision
- Les **tenant settings** sont modélisés avec Zod (`TenantSettings`) et stockés en base.
- Ils sont chargés systématiquement par `DomainPageHOP` (plus de flag `withSettings` optionnel) et injectés dans `_data.settings`.
- **Double enforcement** :
  - **Côté serveur (obligatoire)** : les pages (via HOP) et les server actions vérifient les settings avant d'exécuter la logique métier. Exemples :
    - `assertPublicAccess(settings, loginPath)` redirige vers le login si `isPrivate` est activé.
    - Les server actions de vote/commentaire vérifient `allowVoting`/`allowComments` avant mutation.
  - **Côté client (UX uniquement)** : les composants masquent les éléments désactivés (bouton de vote, formulaire de commentaire, etc.) via les props settings.
- **Catégories de settings** :
  - Visibilité : `isPrivate`
  - Engagement : `allowVoting`, `allowAnonymousVoting`, `allowComments`, `allowPostEdits`, `allowAnonymousFeedback`
  - Inscription : `emailRegistrationPolicy` (ANYONE / NOONE / DOMAINS) + `allowedEmailDomains`
  - Navigation : `showRoadmapInHeader`
  - Localisation : `locale`, `useBrowserLocale`

## Options envisagées
### Option A — Vérification client uniquement
- ✅ Simple à implémenter.
- ❌ Contournable via appels directs aux server actions.

### Option B — Double enforcement serveur + client (**choisi**)
- ✅ Sécurisé : impossible de contourner en appelant directement une action.
- ✅ UX propre : les éléments désactivés sont masqués.
- ⚠️ Duplication logique (server + client), mais faible en pratique (un `if` de plus).

### Option C — Middleware edge
- ✅ Centralisation.
- ❌ Trop coarse-grained pour des feature flags au niveau action/composant.

## Conséquences
- Les settings sont toujours disponibles dans les pages (chargement systématique via `DomainPageHOP`).
- Ajout d'un nouveau setting = ajouter au schéma Zod + ajouter les guards serveur + masquer côté client.
- Le client ne fait jamais confiance aux settings pour la sécurité, uniquement pour l'UX.

## Liens
- PR #18
- `src/lib/model/TenantSettings.ts` (schéma Zod)
- `src/app/[domain]/(domain)/DomainPage.tsx` (chargement systématique)
- `src/lib/utils/auth.ts` (`assertPublicAccess`)
