# ADR 0017 — Templates email DSFR avec react-email
- **Date**: 2026-02-15
- **Statut**: Accepted

## Contexte
  - Les 3 emails transactionnels (magic link, invitation, liaison Espace Membre) utilisaient du HTML brut inline, dupliqué dans chaque fichier, sans design cohérent ni dark mode.
  - Le design DSFR Mail (charte graphique Marianne) n'était pas appliqué.
  - Le transport Nodemailer était configuré indépendamment dans chaque fichier émetteur.

## Décision
  - Adopter `react-email` (`@react-email/components` + `@react-email/render`) pour les templates email.
  - Créer un module dédié `src/emails/` avec :
    - `DsfrEmailLayout` — layout partagé (header/footer Marianne, dark mode CSS, responsive 600px)
    - `components.tsx` — composants helpers (`DsfrButton`, `DsfrText`, `DsfrHeading`, `DsfrSpacer`)
    - `renderEmails.tsx` — façade de rendu (garde le JSX hors des fichiers `.ts`)
  - Utiliser un système i18n autonome (`getEmailTranslations`) qui charge les fichiers JSON directement, sans dépendre du contexte serveur `next-intl`.
  - Mutualiser le transport Nodemailer dans `src/lib/mailer.ts` (`sendEmail()`).

## Options envisagées
  - **MJML** — framework email populaire, mais ajoute une étape de compilation et un DSL séparé de React. Plus adapté aux équipes non-React.
  - **react-email** — composants React natifs, rendu HTML côté serveur, intégration naturelle avec l'écosystème existant. Retenu.
  - **next-intl dans les emails** — impossible car les emails sont rendus hors du contexte de requête Next.js (ex: callbacks NextAuth `sendVerificationRequest`).

## Conséquences
  - Les inline styles (`style={{...}}`) sont obligatoires dans `src/emails/` — les clients email ne supportent pas le CSS externe/Tailwind. Exception documentée dans CLAUDE.md.
  - Tout nouvel email doit utiliser `DsfrEmailLayout` et les composants helpers existants.
  - Les traductions email vivent dans les namespaces `emails.*` des fichiers `messages/{fr,en}.json`.

## Liens
  - PR #58 — feat(email): refondre les emails avec DSFR Mail + react-email
  - [react-email](https://react.email/)
  - [DSFR Mail](https://github.com/codegouvfr/dsfr-mail)
