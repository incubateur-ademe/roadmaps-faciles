# ADR 0022 — Service de stockage S3 et éditeur Markdown riche
- **Date**: 2026-02-24
- **Statut**: Accepted

## Contexte

Les utilisateurs rédigent des contributions (posts) via un simple textarea. Il n'y a aucun moyen d'uploader des fichiers. Plusieurs besoins convergent : images dans les posts, futur upload de logos tenant et photos de profil. Il faut à la fois un service de stockage et un éditeur plus riche pour l'expérience de rédaction.

## Décision

### Storage Provider

Nouvelle abstraction `IStorageProvider` (interface + factory + implémentations) dans `src/lib/storage-provider/`, suivant exactement le pattern existant des domain/DNS providers. Deux implémentations : `NoopStorageProvider` (log + URL fictive) et `S3StorageProvider` (`@aws-sdk/client-s3`, compatible MinIO/Scalingo).

L'upload est géré par une **server action** (`uploadImage()`) — pas un route handler. La server action authentifie l'utilisateur, scope au tenant, valide type/taille, et produit un audit trail (`IMAGE_UPLOAD`).

Les images sont stockées avec la clé `tenants/{tenantId}/images/{uuid}.{ext}` et servies publiquement depuis le bucket. L'URL est insérée en syntaxe Markdown `![alt](url)` dans le champ `description` existant — **aucune migration de schéma DB nécessaire**.

### Éditeur Markdown

Le textarea DSFR existant est remplacé par un composant `MarkdownEditor` (`src/dsfr/base/client/`) qui ajoute : toolbar, raccourcis clavier, preview live, drag & drop, paste image.

## Options envisagées

### Éditeur
- **Monaco Editor** — Utilisé sur un autre projet (legal-site) pour de l'édition MDX. Rejeté : ~2-3 MB de bundle, UX orientée développeur (IDE), inadapté pour des utilisateurs non-techniques écrivant des feature requests.
- **Tiptap** — Riche, mature, WYSIWYG. Rejeté : HTML-first (conversion markdown complexe), ~150 KB, CSS qui clash avec DSFR.
- **Milkdown** — ProseMirror, markdown-first. Rejeté : plus léger mais ajout d'une dépendance lourde pour un besoin couvert par l'approche textarea++.
- **Textarea amélioré** (retenu) — Zéro dépendance côté éditeur, intégration DSFR native, `react-markdown` déjà en place pour la preview. Pattern GitHub Issues : simple, efficace, léger.

### Upload
- **Presigned URL** — Le client upload directement vers S3, le serveur ne voit pas le fichier. Rejeté : complexité supplémentaire (CORS, signature), le fichier transite de toute façon par le réseau client.
- **Server action upload direct** (retenu) — Le serveur reçoit le fichier, valide, et upload à S3. Plus simple, permet la validation server-side, et cohérent avec le pattern d'actions du codebase.

## Conséquences

- **Positif** : les images dans les posts fonctionnent sans migration DB, le pattern storage provider est réutilisable pour logos/avatars futurs, le bundle reste léger.
- **Risque** : le MIME type est validé côté serveur via `file.type` (client-controlled), pas via magic bytes. Une dépendance `file-type` pourrait être ajoutée si une validation plus stricte est nécessaire.
- **Migration** : l'ajout de `IMAGE_UPLOAD` à l'enum `AuditAction` dans le schéma Prisma nécessite un `prisma db push` ou `prisma migrate` sur les environnements existants.

## Liens
- Issue #8 — feat(infra): service de stockage S3 pour images et logos
- Issue #52 — feat(editor): éditeur Markdown riche avec upload d'images
