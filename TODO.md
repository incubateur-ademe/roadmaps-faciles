- passkey / webauthn https://github.com/nextauthjs/next-auth-webauthn/blob/main/components/login.tsx
- refresh token https://github.com/nextauthjs/next-auth-refresh-token-example
- route /api/stats
- page /stats (nombre de tenants (Northstar), nombre d'utilisateurs, nombre de boards, nombre de cartes, nombre de commentaires, nombre de votes)
- page /budget (?)
- page /roadmap

## TODO
- [ ] gérer les custom domains avec l'api Scalingo

## Produit
- [ ] récupérer les insights, les commentaires, les réponses, depuis l'admin (ou en tant qu'admin)

## Login
- [x] ne sont autorisés au root login que les utilisateurs beta gouv
- [x] tenant login avec un utilisateur existant => ajout d'un nouveau UserOnTenant
- [x] tenant login avec un utilisateur inexistant mais betagouv => ajout utilisateur avec "isBetaGouvMember = true" + UserOnTenant
- [x] tenant login avec un utilisateur inexistant et non betagouv => ajout utilisateur normal + UserOnTenant
