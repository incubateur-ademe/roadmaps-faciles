#!/bin/bash
# scripts/worktree-guard.sh
#
# Hook post-compact pour Claude Code.
# Injecte la liste des worktrees dans le contexte de Claude
# et lui demande de vérifier avec l'utilisateur lequel est actif.
#
# Configuré via .claude/settings.json :
#   "hooks": { "SessionStart": [{ "matcher": "compact", ... }] }

set -euo pipefail

# Vérifier que git est disponible et qu'on est dans un repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "⚠️ COMPACTION DÉTECTÉE — Impossible de vérifier le worktree (pas dans un dépôt git)."
  echo "INSTRUCTION : Demande à l'utilisateur de confirmer le répertoire de travail actif."
  exit 0
fi

WORKTREE_COUNT=$(git worktree list | wc -l | tr -d ' ')

# Pas de worktrees secondaires → rien à signaler
if [ "$WORKTREE_COUNT" -le 1 ]; then
  exit 0
fi

CURRENT_DIR=$(pwd)
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")

cat <<EOF
⚠️ COMPACTION DÉTECTÉE — Contexte worktree à confirmer.

Répertoire actuel : ${CURRENT_DIR}
Branche actuelle  : ${CURRENT_BRANCH}

Worktrees disponibles :
$(git worktree list 2>/dev/null | while IFS= read -r line; do echo "  - ${line}"; done)

INSTRUCTION OBLIGATOIRE : Avant de reprendre toute tâche, utilise AskUserQuestion pour demander à l'utilisateur sur quel worktree il travaille actuellement. Propose les worktrees ci-dessus comme options. Adapte ensuite TOUS tes chemins absolus au répertoire sélectionné par l'utilisateur.
EOF
