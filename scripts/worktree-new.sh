#!/bin/bash
# scripts/worktree-new.sh
#
# Crée un git worktree isolé pour travailler en parallèle avec Claude Code.
#
# Usage :
#   scripts/worktree-new.sh <branch-name> [port]
#
# Exemples :
#   scripts/worktree-new.sh feat/auth-2fa 3001
#   scripts/worktree-new.sh fix/login-bug        # port par défaut: 3000
#
# Ce script :
#   1. Crée le worktree depuis dev
#   2. Installe les dépendances (pnpm install)
#   3. Génère le client Prisma
#   4. Crée un .env.development.local avec port + DB dédiés
#   5. Crée la DB dédiée si elle n'existe pas
#   6. Affiche la commande pour lancer Claude dedans

set -euo pipefail

# --- Arguments ---
BRANCH="${1:?Usage: $0 <branch-name> [port]}"
PORT="${2:-3000}"

# --- Chemins ---
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
REPO_NAME=$(basename "$REPO_ROOT")
# Extraire un nom court depuis le nom de branche (feat/auth-2fa → auth-2fa)
SHORT_NAME=$(echo "$BRANCH" | sed 's|.*/||')
WORKTREE_DIR="$(dirname "$REPO_ROOT")/${REPO_NAME}-${SHORT_NAME}"
DB_NAME="roadmaps-faciles-${SHORT_NAME}"

# --- Vérifications ---
if [ -d "$WORKTREE_DIR" ]; then
  echo "❌ Le répertoire $WORKTREE_DIR existe déjà."
  echo "   Utilise: cd $WORKTREE_DIR && claude"
  exit 1
fi

# Vérifier que la branche n'est pas déjà checked out dans un autre worktree
if git worktree list | grep -q "\[$BRANCH\]"; then
  echo "❌ La branche $BRANCH est déjà utilisée dans un worktree :"
  git worktree list | grep "\[$BRANCH\]"
  exit 1
fi

# --- Création du worktree ---
echo "📁 Création du worktree..."
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add "$WORKTREE_DIR" "$BRANCH"
else
  git worktree add -b "$BRANCH" "$WORKTREE_DIR" dev
fi

cd "$WORKTREE_DIR"

# --- .env.development.local ---
echo "⚙️  Configuration de l'environnement..."
cat > .env.development.local <<EOF
# Worktree: $BRANCH
# Généré par scripts/worktree-new.sh
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${DB_NAME}"
PORT=${PORT}
NEXT_PUBLIC_SITE_URL=http://localhost:${PORT}
EOF

# --- Base de données ---
echo "🗄️  Préparation de la base de données..."
if psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "   DB $DB_NAME existe déjà, skip."
else
  createdb -U postgres "$DB_NAME" 2>/dev/null && echo "   DB $DB_NAME créée." || echo "   ⚠️  Impossible de créer la DB $DB_NAME. Crée-la manuellement."
fi

# --- Dépendances ---
echo "📦 Installation des dépendances..."
pnpm install --frozen-lockfile

# --- Prisma ---
echo "🔧 Génération du client Prisma..."
pnpm prisma generate
pnpm prisma db push --skip-generate 2>/dev/null || echo "   ⚠️  prisma db push a échoué — lance-le manuellement si le schéma a changé."

# --- Seed (optionnel) ---
echo "🌱 Seed de la base..."
pnpm prisma db seed 2>/dev/null || echo "   ⚠️  Seed a échoué — lance 'pnpm prisma db seed' manuellement si nécessaire."

# --- Résumé ---
echo ""
echo "✅ Worktree prêt !"
echo ""
echo "   Répertoire : $WORKTREE_DIR"
echo "   Branche    : $BRANCH"
echo "   Port       : $PORT"
echo "   Base       : $DB_NAME"
echo ""
echo "👉 Pour lancer Claude dedans :"
echo ""
echo "   cd $WORKTREE_DIR && claude"
echo ""
