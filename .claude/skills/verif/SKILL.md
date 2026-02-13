---
name: verif
description: Verify implementation by running lint, TypeScript diagnostics, and checking for errors
---

# Verification de l'implementation

Effectue les verifications suivantes dans l'ordre :

## 1. ESLint

Lance `pnpm lint --fix` pour corriger automatiquement les erreurs de formatage et de tri des imports, puis verifie qu'il n'y a plus d'erreurs. Sauf evidement si il est passé litéralement juste avant.

Si des erreurs persistent apres le `--fix`, corrige-les manuellement.

## 2. Diagnostics TypeScript

Utilise l'outil `mcp__ide__getDiagnostics` sur chaque fichier modifie ou cree dans cette session pour verifier qu'il n'y a pas d'erreurs TypeScript.

Si tu ne connais pas les fichiers modifies, lance les diagnostics sans URI pour obtenir tous les diagnostics du projet.

## 3. Vérification post-implementation

Fais une revue approfondie de l'implementation pour verifier que les changements sont conformes aux attentes, que les fonctionnalités sont bien implementées, et que le code est propre et maintenable. Tu peux uiliser le MCP `feature-dev:code-reviewer` (et d'autres si besoin) pour t'assister dans cette revue, en incluant un build de contrôle à la fin pour verifier que le projet compile correctement.

## 4. Resume

A la fin, affiche un resume clair :
- Nombre de fichiers verifies
- Erreurs ESLint trouvees et corrigees (ou aucune)
- Erreurs TypeScript trouvees et corrigees (ou aucune)
- Rapport de verification post-implementation
- Statut final : OK ou KO avec details
