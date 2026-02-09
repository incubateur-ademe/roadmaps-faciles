# ADR 0011 — SSO Bridge cross-domain (root → tenant)
- **Date**: 2026-02-09
- **Statut**: Accepted

## Contexte
Les sessions auth sont isolées par domaine (cookies HTTP scopés). Un utilisateur connecté sur le root (`localhost:3000`) ne l'est pas sur un tenant (`default.localhost:3000` ou `custom-domain.com`). Le partage de cookies entre domaines custom est impossible. Il faut un mécanisme de transfert d'authentification sans magic link ni email.

## Décision
Un **bridge token signé HMAC-SHA256** permet de transférer l'authentification du root vers un tenant.

### Flow
1. Page login tenant → lien "Se connecter via {brand.name}"
2. Redirige vers `{config.host}/api/auth-bridge?redirect={tenantLoginUrl}`
3. Root vérifie la session :
   - **Non connecté** → redirige vers le login root (`/login`)
   - **Connecté** → crée un bridge token (userId, expiry 5 min), redirige vers `{redirect}?bridge_token={token}`
4. Page login tenant détecte `bridge_token` dans les searchParams → rend `BridgeAutoLogin` (composant client qui auto-submit un formulaire)
5. Server action `bridgeSignIn` appelle `signIn("bridge", { token })` → Credentials provider NextAuth vérifie le token → session tenant créée → redirect `/`
6. Le callback `signIn` de NextAuth crée la membership `UserOnTenant` (rôle `INHERITED`) si nécessaire

### Sécurité
- Token HMAC-SHA256 signé avec `config.security.auth.secret`, vérifié via `crypto.timingSafeEqual`
- Expiry 5 minutes
- Protection open redirect : validation protocol (http/https) + host (même domaine root ou sous-domaine via `config.rootDomain`)
- Toutes les URLs root construites avec `config.host` (jamais `request.url` qui peut refléter le domaine tenant)

### Contrainte Next.js critique
`signIn()` de NextAuth utilise `cookies().set()` en interne. Cette API est **read-only** pendant le render RSC — il est impossible d'appeler `signIn()` dans un Server Component. Le bridge utilise un composant client (`BridgeAutoLogin`) qui auto-submit un `<form>` vers un Server Action (`bridgeSignIn`), reproduisant le pattern de `LoginForm`.

## Options envisagées
### Option A — Cookie partagé (wildcard domain)
- ❌ Incompatible avec les domaines custom (CNAME).

### Option B — Magic link par email
- ❌ Friction utilisateur, latence email.

### Option C — Bridge token HMAC (**choisi**)
- ✅ Instantané, sans email.
- ✅ Fonctionne avec domaines custom.
- ✅ Même pattern HMAC que le lien Espace Membre (`src/lib/espaceMembre.ts`).
- ⚠️ Token à usage multiple pendant la fenêtre de 5 min (améliorable avec nonce Redis).

## Conséquences
- Nouveau Credentials provider `"bridge"` dans NextAuth (`src/lib/next-auth/auth.ts`).
- Le callback `signIn` gère 3 providers : `nodemailer`, `espace-membre`, `bridge`.
- Les Route Handlers doivent utiliser `NextResponse.redirect()` (pas `redirect()` de `next/navigation`).
- La membership `UserOnTenant` créée via bridge a le rôle `INHERITED` (pas `USER` comme les invitations).

## Liens
- `src/lib/authBridge.ts` (création/vérification token)
- `src/app/(default)/api/auth-bridge/route.ts` (endpoint root)
- `src/app/[domain]/(domain)/login/BridgeAutoLogin.tsx` (composant client auto-submit)
- `src/app/[domain]/(domain)/login/bridgeSignIn.ts` (server action)
- `src/lib/next-auth/auth.ts` (Credentials provider + signIn callback)
- ADR 0002 (auth NextAuth), ADR 0003 (multi-tenant)
