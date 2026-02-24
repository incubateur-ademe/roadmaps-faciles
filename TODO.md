## Idées / Backlog

- page /budget (?)

## TODO

- [ ] route /api/stats (#7)
- [ ] page /stats — nombre de tenants (Northstar), utilisateurs, boards, cartes, commentaires, votes (#7)
- [ ] page /roadmap (#14)
- [ ] Insights & analytics : dashboards tenant, root et utilisateur (#45)
- [ ] Responsive : support mobile et tablette (#46)
- [ ] Éditeur Markdown riche + upload image (#52)
- [ ] S3 Service (#8)
- [ ] Github Link + Github Project (#9)
- [ ] Système de clefs d'api (#13)
- [ ] Webhooks sortants (#17)
- [ ] New user onboarding (#22)
- [ ] Fix build cassé /doc/guides/board-views (#70)
- [ ] Dependabot : vulnérabilités dépendances (#71)
- [ ] Refactor SendInvitation : remplacer prisma direct par repos (#72)
- [ ] Notifications in-app et email, préférences par utilisateur (#74)
- [ ] Widget feedback embarquable SDK JS (#75)
- [ ] Framework d'intégrations : Notion, Trello, projets.numerique.gouv.fr (#76)
  - [x] Architecture provider-pattern (IIntegrationProvider, factory, types)
  - [x] Notion SDK v5.9.0 : provider complet (testConnection, syncOutbound, syncInbound, readPageContent)
  - [x] Encryption AES-256-GCM des clés API (scrypt, salt:iv:tag:ciphertext)
  - [x] Prisma models : TenantIntegration, IntegrationMapping, IntegrationSyncLog
  - [x] Repos + interfaces : IIntegrationRepo, IIntegrationMappingRepo, IIntegrationSyncLogRepo
  - [x] Use cases : Create, Update, Delete, List, Sync, ResolveSyncConflict, GetSyncLogs, TestConnection
  - [x] Admin UI : liste, wizard (connection → mapping → sync direction → confirm), page détail
  - [x] Cron route handler POST /api/cron/integrations (Bearer auth)
  - [x] Inbound readonly : double guard (UI canEdit/canDelete=false + server action reject)
  - [x] Badge "Voir sur Notion" avec lien pour moderators+
  - [x] Comment/like counts via PostCounts (IPostRepo.getPostCounts)
  - [x] Page content blocks (Notion page body → description markdown)
  - [x] Traductions fr/en (serverErrors.inboundPostReadonly, post.viewOnNotion, admin.integrations.*)
  - [x] Tests testu : encryption (7 tests)
  - [x] Tests testi : 7 fichiers, 46 tests (Create, Delete, Update, List, Sync, ResolveSyncConflict, GetSyncLogs)
  - [x] CI filter : ajout src/lib/integration-provider/** dans test-unit
  - [ ] Tests E2E : admin pages, inbound readonly guard, badge Notion, cron 401
  - [ ] Tests DB : repos Prisma (IntegrationRepoPrisma, IntegrationMappingRepoPrisma, IntegrationSyncLogRepoPrisma)
  - [ ] Wizard : step de sélection de la database Notion (listRemoteDatabases + getRemoteDatabaseSchema)
  - [ ] Sync bidirectionnel : UI de résolution de conflits dans la page détail
  - [ ] Cron manager : implémentation réelle (node-cron ou externe)
- [ ] Espace d'échange : discussions par tenant, conversion Discussion ↔ Post (#77)
- [ ] Chat opérateur + base de connaissance par tenant, intégration Chatwoot (#78)

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
- [x] Auth améliorée : passkey, refresh token, providers SSO tenants (#11)
- [x] Tests : unit, intégration et e2e (#47)
- [x] Vue liste compacte des posts, style GitHub Issues (#48)
- [x] Page /roadmap : dogfooding (#49)
- [x] Mode light embarquable : iframe / widget (#50)
- [x] Fix : checkbox dark/light theme non cochée (#51)
- [x] Templates GitHub : issues et PR (#53)
- [x] Site de documentation utilisateur /doc (#54)
- [x] Sous-sous-domaines DNS pour les zones (#66)
- [x] Créateur tenant = owner automatique (#67)
- [x] Super Admin inherit sur tous les tenants (#68)
