# E2E Auth Tests Design

## Scope

Tests E2E couvrant tous les flows d'authentification hors OAuth :
- Magic link (email login) avec interception Maildev
- Auth bridge (root → tenant session transfer)
- Pre-login OTP (blocage uniquement)
- Cas d'erreur (token invalide/expiré, email inconnu, open redirect)

## Approach: Custom Playwright Fixtures (B)

Fixture `maildev` intégrée via `test.extend` dans fixtures.ts, exposant :
- `getLatestEmail(to)` — polling Maildev API avec retry
- `extractMagicLink(email)` — parse HTML pour extraire le lien de vérification
- `clearInbox()` — supprime tous les emails

## Infrastructure Changes

### CI: Maildev service
Ajout dans `.github/workflows/test.yml` :
```yaml
services:
  maildev:
    image: djfarrelly/maildev
    ports:
      - 1025:1025
      - 1080:1080
```

### Seed: User OTP
Ajout d'un 4e user dans `prisma/test-seed.ts` avec `otpSecret` + `otpVerifiedAt` configurés pour déclencher le pre-login OTP check.

## Test Specs

### auth-magic-link.spec.ts (5 tests)

| # | Test | Projet PW | Description |
|---|------|-----------|-------------|
| 1 | Magic link complet (root) | unauthenticated | email → Maildev → clic lien → session → redirect / |
| 2 | Magic link complet (tenant) | unauthenticated | idem sur e2e.localhost:3000/login |
| 3 | Email inconnu | unauthenticated | email non enregistré → comportement erreur |
| 4 | Token invalide/expiré | unauthenticated | visite callback avec token garbage → page erreur |
| 5 | Blocage pre-login OTP | unauthenticated | user OTP → formulaire affiche étape OTP |

**Flow happy path :**
1. `maildev.clearInbox()`
2. `page.goto("/login")`
3. Remplir email → submit
4. Attendre redirect `/login/verify-request`
5. `maildev.getLatestEmail("test-user@test.local")` (polling 10s)
6. `maildev.extractMagicLink(email)`
7. `page.goto(lien)`
8. Attendre redirect "/" + vérifier session

### auth-bridge.spec.ts (5 tests)

| # | Test | Projet PW | Description |
|---|------|-----------|-------------|
| 1 | Bridge complet root→tenant | root-auth | admin root → /api/auth-bridge → tenant session |
| 2 | Bridge sans redirect | root-auth | GET /api/auth-bridge sans param → redirect / |
| 3 | Bridge open redirect | root-auth | redirect=evil.com → bloqué, redirect / |
| 4 | Bridge non authentifié | unauthenticated | pas de session → redirect /login |
| 5 | Bridge token invalide | unauthenticated | /login?bridge_token=garbage → erreur |

**Flow bridge complet :**
1. `page.goto("/")` (root, admin auth via storage state)
2. Naviguer vers `/api/auth-bridge?redirect=http://e2e.localhost:3000/login`
3. Suivre redirects → BridgeAutoLogin process le token
4. `waitForURL` matche destination finale sur tenant
5. Vérifier accès page protégée tenant

## File Changes

| File | Action |
|------|--------|
| `tests/teste2e/fixtures.ts` | Extend with `maildev` fixture |
| `tests/teste2e/auth-magic-link.spec.ts` | Create — 5 magic link tests |
| `tests/teste2e/auth-bridge.spec.ts` | Create — 5 bridge tests |
| `playwright.config.ts` | Add specs to existing projects |
| `prisma/test-seed.ts` | Add OTP user |
| `.github/workflows/test.yml` | Add Maildev service |

## Technical Notes

- Maildev API: `GET http://localhost:1080/api/emails` (JSON array), `DELETE http://localhost:1080/api/emails`
- Polling: max 10s, 500ms interval pour l'arrivée de l'email
- Cross-domain: Playwright suit les redirects HTTP; le challenge est le `window.location.href` côté client dans BridgeAutoLogin → `waitForURL` avec pattern
- Le pre-login OTP test nécessite un user seedé avec TOTP secret valide
