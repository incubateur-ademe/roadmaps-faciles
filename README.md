# Roadmaps Faciles

<img src="./public/img/roadmaps-faciles.png" alt="Roadmaps Faciles" width="120" align="left" />

Créer et exposer la Roadmap de sa Startup d'État n'a jamais été aussi facile.
Grâce à **Roadmaps Faciles**, regroupez facilement les avis et retours des usagers pour orienter efficacement la feuille de route de votre produit et améliorer votre **impact**.

Le projet accueille des contributions de développeur·euse·s bénévoles — merci 💚 ([Règle des 10%](https://doc.incubateur.net/communaute/solliciter-et-contribuer-a-la-communaute/la-regle-des-10-communaute))

---

## 🧱 Stack & décisions clés

- **Framework** : Next.js 15.5.x (App Router, Server Actions)  
- **Langage** : TypeScript strict  
- **Auth** : NextAuth relié à Prisma (table `User` existante)  
- **ORM** : Prisma (IDs en `uuid`, modèles multi-tenant)  
- **Validation** : Zod **v4** (schémas dans `lib/model`)  
- **UI** : Design System de l’État (DSFR) + classes `fr-*` via React DSFR + MUI , utilitaires Tailwind (ex: `sticky`)  
- **Multi-tenant** : sous-domaines, contenu servi selon le tenant (rewrite); domaines customs possibles 

Ces choix sont détaillés dans les ADR (Architecture Decision Records) / `docs/adr`.

---

## 🚀 Démarrer

> [!NOTE] 
> **Prérequis**
> - Node.js ≥ 22 (recommandé : activer Corepack) (cf. `.nvmrc`)  
> - PostgreSQL ≥ 15 (local ou conteneur via docker-compose)  

### Installation

```bash
# Cloner
git clone https://github.com/incubateur-ademe/roadmaps-faciles.git
cd roadmaps-faciles

# Installer deps
yarn install
```

### docker-compose (optionnel)

Uniquement pour PostgreSQL et Maildev.

```bash
# Démarrer PostgreSQL et Maildev
docker-compose up -d
```


### Variables d’environnement

Créer `.env.development.local` à partir de `.env.development` et renseigner si besoin :

- `DATABASE_URL` : URL Postgres

---

### Base de données

```bash
# Générer Prisma Client
yarn prisma generate

# Appliquer le schéma
yarn prisma migrate dev

# (optionnel) Seed
yarn seed
```

---

### Sous-domaine local (après seed)

Le seed crée un tenant local avec le sous-domaine `default`.  
Pour y accéder en local, ajouter dans `/etc/hosts` :

```
127.0.0.1	default.localhost:3000
```

---

### Lancer en dev

```bash
yarn dev
```

L’application est servie sur **http://localhost:3000** pour le site principal, et **http://default.localhost:3000** pour le tenant `default`.

---

## ⚙️ Scripts utiles

```bash
yarn lint                       # ESLint + format
yarn generateEnvDeclaration     # Générer env.d.ts à partir de .env.development

# Prisma
yarn prisma:studio              # Prisma Studio (http://localhost:5555/)
yarn prisma:reset               # Reset DB (migrations, pas de seed)
yarn run-script xx.ts           # Permet d'exécuter un script TS présent dans /scripts/xx.ts
```

---

## 🗂️ Structure de répertoires (extrait)

```
/docs/adr/                  # Architecture Decision Records
/prisma                     # Schéma Prisma + seed + migrations + views
/src/app                    # App Router (Next.js)
/src/app/(default)          # Site principal
/src/app/[domain]           # Multi-tenant
/src/lib/model              # Schémas Zod (v4) - objets métier & DTO
/src/lib/useCases           # Logique métier (use cases DDD)
/src/lib/repo               # Accès DB (Prisma) - fonctions CRUD
```

---

## 🧩 ADR (Architecture Decision Records)

Les ADR vivent dans `docs/adr/`.  
- Nouveau fichier : `docs/adr/00xx-<slug>.md` (numéro séquentiel)  
- Template : `docs/adr/0000-template.md`  
- Courtes, factuelles, datées, avec alternatives et conséquences.

---

## Licence
[Apache-2.0](./LICENSE) © ADEME / beta.gouv.fr
