---
name: worktree-guard
description: Verify and confirm the active git worktree with the user. Use after compaction or when unsure about working directory.
---

# Worktree Guard

Vérifie le worktree git actif et demande confirmation à l'utilisateur.

## Étapes

### 1. Détecter les worktrees

Lance `git worktree list` pour lister tous les worktrees disponibles.

### 2. Demander confirmation à l'utilisateur

Utilise `AskUserQuestion` pour présenter les worktrees disponibles et demander à l'utilisateur sur lequel il travaille.

Formate les options avec le chemin et la branche, par exemple :
- `kokatsuna [dev]` — repo principal
- `kokatsuna-auth-2fa [feat/auth-2fa]`
- `kokatsuna-email-dsfr [feat/email-dsfr]`

### 3. Appliquer le contexte

Une fois le worktree confirmé par l'utilisateur :
- Note le répertoire sélectionné comme répertoire de travail actif
- Utilise EXCLUSIVEMENT des chemins absolus pointant vers ce répertoire pour toutes les opérations suivantes (Read, Write, Edit, Glob, Grep, Bash)
- Ne touche JAMAIS aux fichiers d'un autre worktree ou du repo principal
- Rappelle à l'utilisateur la branche active

### 4. Résumé

Affiche un résumé :
- Worktree confirmé : chemin + branche
- Rappel : tous les chemins utiliseront ce répertoire
