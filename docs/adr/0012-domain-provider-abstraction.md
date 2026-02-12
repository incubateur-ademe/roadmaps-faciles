# ADR 0012 — Abstraction de la gestion des domaines (IDomainProvider)
- **Date**: 2026-02-10
- **Statut**: Accepted

## Contexte
  - L'application multi-tenant supporte les domaines custom (stockés en DB) et les sous-domaines, mais la gestion côté infrastructure (TLS, routing PaaS) reste manuelle.
  - Le déploiement peut cibler différents PaaS (Scalingo, Clever Cloud) ou une infrastructure auto-gérée (VPS, Kubernetes), chacun avec sa propre API de gestion de domaines.
  - Le couplage direct à un PaaS rendrait le code non portable et compliquerait les migrations.

## Décision
  - Créer une interface `IDomainProvider` avec 3 méthodes : `addDomain`, `removeDomain`, `checkStatus`.
  - Fournir 5 implémentations : `NoopDomainProvider` (dev), `ScalingoDomainProvider`, `ScalingoWildcardDomainProvider` (wildcard SSL — délègue les custom domains, no-op pour les sous-domaines), `CleverCloudDomainProvider`, `CaddyDomainProvider` (on-demand TLS).
  - La sélection du provider se fait via la variable d'environnement `DOMAIN_PROVIDER` (`noop` par défaut).
  - Un singleton factory (`getDomainProvider()`) instancie le bon provider au runtime.
  - Les use cases (`CreateNewTenant`, `UpdateTenantDomain`, `DeleteTenant`) appellent le provider après les opérations DB.

## Options envisagées
  - **Option A — Couplage direct Scalingo** : simple mais non portable, impossible à tester en local sans Scalingo.
  - **Option B — Interface + providers multiples (retenue)** : portable, testable (Noop en dev), extensible à tout PaaS ou reverse proxy.
  - **Option C — Webhook externe** : flexible mais ajoute un service à maintenir et une latence réseau.

## Conséquences
  - Le code applicatif est découplé de l'infrastructure de gestion des domaines.
  - En dev, `DOMAIN_PROVIDER=noop` ne fait que logger — aucun service externe requis.
  - L'ajout d'un nouveau PaaS nécessite uniquement une nouvelle implémentation de `IDomainProvider`.
  - Le provider `scalingo-wildcard` repose sur un certificat wildcard (`*.rootDomain`) géré par le DNS — les sous-domaines n'ont pas besoin d'être enregistrés individuellement côté Scalingo. Les custom domains sont délégués au `ScalingoDomainProvider` classique. La gestion DNS associée est documentée dans l'ADR 0013.
  - Le provider Caddy repose sur l'on-demand TLS : un endpoint `/api/domains/check` valide les domaines autorisés.
  - Les erreurs de provisionnement de domaine (API PaaS down) n'empêchent pas la mise à jour en DB — le domaine est ajouté côté app d'abord, puis côté infra.

## Liens
  - ADR 0003 — Multi-tenant sous-domaines
  - ADR 0013 — Abstraction IDnsProvider (gestion DNS interne)
  - `src/lib/domain-provider/` — code source
  - `docs/deploy/caddy/` — configs de déploiement Caddy
