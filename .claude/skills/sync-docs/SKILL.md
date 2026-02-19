---
name: sync-docs
description: Synchronise la documentation du projet (CLAUDE.md, memory, README, ADR, content) avec les features implementees
---

# Synchronisation de la documentation

Met a jour l'ensemble de la documentation du projet en coherence avec les features implementees dans la session courante. Chaque etape produit un diff ou un resume visible par l'utilisateur.

## 1. Analyse des changements

Identifie les fichiers modifies/crees dans la session et la branche courante :

```bash
git diff dev --name-only
git log dev..HEAD --oneline
```

Resume les features et decisions architecturales nouvelles.

## 2. CLAUDE.md — Revise via skill

Lance le skill `/claude-md-management:revise-claude-md` avec comme arguments un resume des learnings de la session.

Si le skill propose des modifications, les appliquer apres validation utilisateur.

## 3. Memory — Synchronisation

Lis le fichier memory a `/Users/lsagetlethias/.claude/projects/-Users-lsagetlethias-source-ADEME-kokatsuna/memory/MEMORY.md` et le `CLAUDE.md` du projet.

Compare les deux et identifie :
- **Doublons** : informations presentes dans les deux fichiers — proposer de les retirer de MEMORY.md (CLAUDE.md fait foi car partage avec l'equipe)
- **Memory-only** : informations dans MEMORY.md absentes de CLAUDE.md — evaluer si elles meritent d'etre dans CLAUDE.md (partageables) ou si elles restent en memory (personnelles/contextuelles)
- **Obsoletes** : informations qui ne correspondent plus au code actuel — proposer de les supprimer
- **Nouveaux learnings** : patterns, gotchas, ou conventions decouverts dans la session — proposer de les ajouter au bon endroit

Presente les modifications proposees et applique-les apres validation utilisateur.

**Regle** : MEMORY.md doit rester sous 200 lignes (au-dela, le contenu est tronque). Si necessaire, creer des fichiers de detail (ex: `debugging.md`, `patterns.md`) et y faire reference depuis MEMORY.md.

## 4. README.md — Mise a jour

Lis `README.md` a la racine et verifie sa coherence avec l'etat actuel du projet :

- **Stack & decisions cles** : versions a jour (Next.js, Node, Prisma, etc.), nouvelles technologies/patterns majeurs
- **Variables d'environnement** : nouvelles variables ajoutees dans `src/config.ts` non documentees dans le README
- **Structure de repertoires** : nouveaux dossiers significatifs (ex: `src/lib/dns-provider/`)
- **Scripts utiles** : nouvelles commandes ajoutees dans `package.json`
- **Reference aux ADR** : si de nouveaux ADR sont crees (etape 5), verifier que la section ADR du README est a jour

Ne modifier que ce qui est factuellement incorrect ou manquant. Ne pas changer le style ou la mise en forme existante.

Presente les modifications proposees et applique-les apres validation utilisateur.

## 5. Documentation utilisateur/technique — `content/`

Le dossier `content/docs/` contient la documentation utilisateur et technique du projet en MDX (rendue sur `/doc/*`). Elle est organisee en sections :

- `content/docs/concepts/` — Concepts metier (roles, tableaux, statuts, espaces)
- `content/docs/guides/` — Guides utilisateur (creer un compte, voter, etc.)
- `content/docs/admin/` — Documentation admin (membres, webhooks, domaines, etc.)
- `content/docs/moderation/` — Documentation moderateur
- `content/docs/technical/` — Documentation technique (DNS, self-hosting, deploiement, securite)

### Procedure

1. A partir de l'analyse des changements (etape 1), identifie les pages MDX potentiellement impactees :
   - Changements auth/roles → `concepts/roles.mdx`, `admin/members.mdx`, `admin/authentication.mdx`
   - Changements DNS/domaines → `technical/dns.mdx`, `technical/self-hosting.mdx`, `admin/custom-domains.mdx`
   - Nouvelles env vars → `technical/self-hosting.mdx` (section Variables d'environnement)
   - Changements moderation → `moderation/`
   - Nouvelles fonctionnalites utilisateur → `guides/`, `concepts/`

2. Lis les pages identifiees et verifie leur coherence avec le code actuel.

3. Propose des modifications si :
   - Des informations sont **factuellement incorrectes** (comportement change)
   - Des **nouvelles fonctionnalites** ou **variables d'environnement** ne sont pas documentees
   - Des **sections manquent** pour couvrir un nouveau comportement significatif

4. Ne pas modifier le style, la mise en forme, ou ajouter de la documentation pour des details d'implementation interne (la doc content est destinee aux utilisateurs et operateurs, pas aux developpeurs).

5. Presente les modifications proposees et applique-les apres validation utilisateur.

## 6. ADR — Architecture Decision Records

Determine si les features implementees dans la session justifient un ou plusieurs nouveaux ADR. Un ADR est justifie si :
- Une **decision architecturale significative** a ete prise (nouveau pattern, nouvelle abstraction, choix technique structurant)
- La decision affecte la **structure du code** de maniere durable
- Il existe des **alternatives envisagees** qu'il est utile de documenter

Un ADR n'est PAS justifie pour :
- Un simple ajout de feature sans decision architecturale (ex: nouvelle page CRUD)
- Un bugfix
- Un refactoring mineur

Si un ADR est justifie :

1. Determine le prochain numero sequentiel en listant `docs/adr/` :
   ```bash
   ls docs/adr/*.md | sort | tail -1
   ```
2. Utilise le template `docs/adr/0000-template.md`
3. Redige l'ADR en francais avec les sections : Contexte, Decision, Options envisagees, Consequences, Liens
4. La date est celle du jour
5. Le statut est `Accepted`

Presente le contenu de l'ADR propose et cree le fichier apres validation utilisateur.

## 7. Resume

Affiche un resume final :

| Document | Action |
|---|---|
| CLAUDE.md | Modifie / Inchange |
| MEMORY.md | Modifie / Inchange |
| README.md | Modifie / Inchange |
| content/ | Modifie (pages) / Inchange |
| ADR | Cree (numero + titre) / Aucun nouveau |

Liste les fichiers modifies/crees avec un lien relatif.
