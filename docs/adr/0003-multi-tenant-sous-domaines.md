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
