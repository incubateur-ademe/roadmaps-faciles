# ADR 0000 — <Titre court>
- **Date**: YYYY-MM-DD
- **Statut**: Proposed | Accepted | Superseded by ADR-xxxx | Deprecated

## Contexte
  - Quel problème ? Pourquoi maintenant ?

## Décision
  - La décision prise, claire et actionnable.

## Options envisagées
  - Option A — avantages / inconvénients
  - Option B — ...

## Conséquences
  - Effets positifs, coûts, risques, migrations.

## Liens
  - Issues, PRs, docs, références.

---

## Règle d'immutabilité

Un ADR accepté **ne doit jamais être modifié**. Si de nouvelles informations, décisions complémentaires ou évolutions doivent être documentées :

1. **Créer une annexe** : `XXXX-N-<titre-annexe>.md` (ex: `0025-1-css-isolation.md`)
2. **Ajouter une référence** dans la section `## Annexes` de l'ADR parent (ne pas modifier le contenu existant)
3. **Si la décision est invalidée** : changer uniquement le statut en `Superseded by ADR-YYYY` et créer un nouvel ADR

Template d'annexe : `docs/adr/0000-0-template-annexe.md`
