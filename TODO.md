## Idées / Backlog

- page /budget (?)

## TODO

- [ ] route /api/stats (#7)
- [ ] page /stats — nombre de tenants (Northstar), utilisateurs, boards, cartes, commentaires, votes (#7)
- [ ] page /roadmap (#14)
- [ ] Insights & analytics : dashboards tenant, root et utilisateur (#45)
- [ ] Responsive : support mobile et tablette (#46)
- [ ] Tests : unit, intégration et e2e (#47)
- [ ] Vue liste compacte des posts, style GitHub Issues (#48)
- [ ] Page /roadmap : dogfooding (#49)
- [ ] Mode light embarquable : iframe / widget (#50)
- [ ] Fix : checkbox dark/light theme non cochée (#51)
- [ ] Éditeur Markdown riche + upload image (#52)
- [ ] Templates GitHub : issues et PR (#53)
- [ ] S3 Service (#8)
- [ ] Github Link + Github Project (#9)
- [ ] Auth améliorée : passkey, refresh token, providers SSO tenants (#11)
- [ ] Système de clefs d'api (#13)
- [ ] Webhooks sortants (#17)
- [ ] New user onboarding (#22)

## À spécifier / à discuter

- [ ] Espace d'échange : type forum, discussions, support ; lié aux tickets.
- [ ] "Crisp" like : base de connaissance et chat en direct pour support et échanges entre utilisateurs, lié à l'espace d'échange et aux tickets. Avec IA pour suggérer des réponses et articles de la base de connaissances, suggérer des tickets existants, ou aider à rédiger un ticket à partir d'un besoin exprimé en langage naturel.
- [ ] Système de notifications : notifications in-app et par email pour les activités importantes (nouveaux tickets, réponses, mentions, etc.). Avec préférences de notification personnalisables par l'utilisateur. (en plus des webhooks sortants)
- [ ] Link avec des tableaux Notion
- [ ] Link avec Trello
- [ ] Link avec projets.numerique.gouv.fr (demander une API ?)
- [ ] Outil de feedback rapide : widget de feedback sur les sites des utilisateurs, pour recueillir des retours directement depuis l'interface utilisateur finale. Avec IA pour analyser les feedbacks et suggérer des actions (ex: créer un ticket, répondre automatiquement, etc.)

## Fait

- [x] gérer les custom domains avec l'api Scalingo (#12)
- [x] ne sont autorisés au root login que les utilisateurs beta gouv
- [x] tenant login avec un utilisateur existant => ajout d'un nouveau UserOnTenant
- [x] tenant login avec un utilisateur inexistant mais betagouv => ajout utilisateur avec "isBetaGouvMember = true" + UserOnTenant
- [x] tenant login avec un utilisateur inexistant et non betagouv => ajout utilisateur normal + UserOnTenant
- [x] Tenant Admin Page (#10)
- [x] Création de card / posts anonymes + modération (#16, PR #32)
- [x] Audit log + observability (PR #23)
- [x] Internationalisation next-intl fr/en (PR #21)
- [x] Admin root, profil utilisateur, SSO bridge, custom domains (PR #20)
- [x] Doc sous-domaine seed local dev (#15)
