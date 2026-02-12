# ADR 0013 — Abstraction de la gestion DNS interne (IDnsProvider)
- **Date**: 2026-02-12
- **Statut**: Accepted

## Contexte
  - Avec le passage au wildcard SSL sur Scalingo (ADR 0012, provider `scalingo-wildcard`), l'enregistrement individuel de chaque sous-domaine côté PaaS n'est plus nécessaire — le certificat `*.rootDomain` couvre tous les sous-domaines.
  - En revanche, chaque sous-domaine doit disposer d'un enregistrement DNS CNAME dans la zone du `rootDomain` pour que le trafic soit correctement routé.
  - La gestion DNS dépend du registrar/hébergeur DNS (OVH, Cloudflare, etc.) et nécessite une abstraction similaire à `IDomainProvider`.

## Décision
  - Créer une interface `IDnsProvider` avec 3 méthodes : `addRecord`, `removeRecord`, `checkRecord`.
  - Le paramètre `subdomain` est le slug nu (ex: `"myapp"`). Chaque implémentation construit le FQDN et le target en interne depuis `config`.
  - Fournir 4 implémentations :
    - `NoopDnsProvider` (dev) — log uniquement, retourne `active`.
    - `ManualDnsProvider` — retourne des instructions textuelles pour une création manuelle ; vérifie via `dns.resolveCname()`.
    - `OvhDnsProvider` — API OVH REST avec auth HMAC-SHA1 (`$1$` + SHA1).
    - `CloudflareDnsProvider` — API Cloudflare v4 avec auth Global API Key ; zone ID résolu dynamiquement et caché en mémoire.
  - La sélection du provider se fait via la variable d'environnement `DNS_PROVIDER` (`noop` par défaut).
  - Un singleton factory (`getDnsProvider()`) instancie le bon provider au runtime.
  - Les erreurs DNS sont **non-bloquantes** : les use cases encapsulent les appels dans un `try/catch` + `console.warn`. Le tenant est créé/modifié/supprimé en DB même si le DNS échoue.
  - `CreateNewTenantOutput` est étendu en `{ tenant: TenantWithSettings, dns?: DnsProvisionResult }` pour remonter les éventuelles instructions manuelles à l'UI.

## Options envisagées
  - **Option A — DNS intégré au DomainProvider** : le provider PaaS gère aussi le DNS. Simple mais couplage fort — le DNS OVH n'a rien à voir avec l'API Scalingo. Impossible pour les setups wildcard où le PaaS ne touche plus aux sous-domaines.
  - **Option B — Abstraction séparée IDnsProvider (retenue)** : découplé du PaaS, composable (ex: `scalingo-wildcard` + `ovh`), chaque provider a une responsabilité claire.
  - **Option C — Script externe / cron** : un script dédié synchronise les DNS. Ajoute un service à maintenir, décalage temporel entre création du tenant et disponibilité DNS.

## Conséquences
  - Le code applicatif est découplé du fournisseur DNS — changer d'OVH à Cloudflare = changer une variable d'environnement.
  - En dev, `DNS_PROVIDER=noop` ne fait que logger — aucun service externe requis.
  - Le provider `manual` permet un déploiement sans API DNS : l'opérateur reçoit les instructions et crée les enregistrements manuellement.
  - Les résolveurs DNS peuvent retourner les CNAME avec un `.` final — toutes les implémentations normalisent avec `.replace(/\.$/, "")` avant comparaison.
  - `config.rootDomain` inclut le port — les providers le strippent avec `.replace(/:\d+$/, "")`.
  - Le provider `scalingo-wildcard` (ADR 0012) complète cette abstraction : il délègue les custom domains au `ScalingoDomainProvider` classique et ne fait rien pour les sous-domaines (couverts par le wildcard).

## Liens
  - ADR 0012 — Abstraction IDomainProvider (+ `scalingo-wildcard`)
  - ADR 0003 — Multi-tenant sous-domaines
  - `src/lib/dns-provider/` — code source
  - `src/lib/domain-provider/impl/ScalingoWildcardDomainProvider.ts` — provider wildcard
