# Déploiement Caddy — On-Demand TLS pour domaines custom

## Principe

Caddy provisionne automatiquement les certificats TLS via [on-demand TLS](https://caddyserver.com/docs/automatic-https#on-demand-tls). Avant d'émettre un certificat, Caddy interroge un endpoint `ask` pour vérifier que le domaine est autorisé.

```
Client ──HTTPS──▶ Caddy ──ask──▶ /api/domains/check?domain=example.com
                    │                        │
                    │◀──── 200 OK ───────────┘
                    │
                    ▼
              App (Next.js :3000)
```

## Combinaisons de déploiement

| App | DNS/TLS | Config | Notes |
|-----|---------|--------|-------|
| Scalingo | Scalingo API | `DOMAIN_PROVIDER=scalingo` | Domaines gérés via l'API Scalingo |
| Scalingo | Caddy externe | `DOMAIN_PROVIDER=caddy` | Caddy devant Scalingo (VPS/compose/kube) |
| Clever Cloud | Clever Cloud API | `DOMAIN_PROVIDER=clevercloud` | Domaines gérés via l'API CC (OAuth 1) |
| Clever Cloud | Caddy externe | `DOMAIN_PROVIDER=caddy` | Caddy devant Clever Cloud |
| VPS / compose / kube | Caddy colocalisé | `DOMAIN_PROVIDER=caddy` | Caddy sur la même infra |

## Variables d'environnement

### Commun

```bash
DOMAIN_PROVIDER="caddy"  # ou "scalingo", "clevercloud", "noop"
```

### Caddy

```bash
DOMAIN_CADDY_ADMIN_URL=http://localhost:2019  # URL de l'API admin Caddy (health check)
DOMAIN_CADDY_ASK_URL=http://app:3000/api/domains/check  # URL de l'endpoint de validation
DOMAIN_CADDY_UPSTREAM=app:3000  # Adresse de l'app Next.js
```

### Scalingo

```bash
DOMAIN_SCALINGO_API_TOKEN=tk-xxx
DOMAIN_SCALINGO_API_URL=https://api.osc-fr1.scalingo.com
DOMAIN_SCALINGO_APP_ID=my-app-id
```

### Clever Cloud

```bash
DOMAIN_CLEVERCLOUD_CONSUMER_KEY=xxx
DOMAIN_CLEVERCLOUD_CONSUMER_SECRET=xxx
DOMAIN_CLEVERCLOUD_TOKEN=xxx
DOMAIN_CLEVERCLOUD_TOKEN_SECRET=xxx
DOMAIN_CLEVERCLOUD_APP_ID=app_xxx
```

## Docker Compose

```bash
docker compose -f docs/deploy/caddy/docker-compose.caddy.yml up -d
```

Variables à configurer :
- `DOMAIN_CADDY_ASK_URL` — URL complète de l'endpoint de validation (accessible depuis le container Caddy)
- `DOMAIN_CADDY_UPSTREAM` — adresse de l'app Next.js (nom du service Docker ou IP)

## Kubernetes

```bash
kubectl apply -f docs/deploy/caddy/k8s/
```

Les manifests incluent :
- `configmap.yaml` — Caddyfile monté en volume
- `deployment.yaml` — Pod Caddy avec volumes pour les certs
- `service.yaml` — Service LoadBalancer exposant 80/443

Adapter les variables `DOMAIN_CADDY_ASK_URL` et `DOMAIN_CADDY_UPSTREAM` dans le deployment.

## VPS (systemd)

1. Installer Caddy : https://caddyserver.com/docs/install
2. Copier le Caddyfile :
   ```bash
   sudo cp docs/deploy/caddy/Caddyfile /etc/caddy/Caddyfile
   ```
3. Configurer les variables d'environnement dans `/etc/caddy/environment` :
   ```bash
   DOMAIN_CADDY_ASK_URL=http://localhost:3000/api/domains/check
   DOMAIN_CADDY_UPSTREAM=localhost:3000
   ```
4. Démarrer Caddy :
   ```bash
   sudo systemctl enable --now caddy
   ```

## Endpoint de validation

`GET /api/domains/check?domain=example.com`

- `200 OK` — domaine autorisé (existe en DB comme custom domain ou sous-domaine)
- `404 Not Found` — domaine non autorisé (Caddy ne provisionnera pas de certificat)
- `400 Bad Request` — paramètre `domain` manquant

## DNS

Pour chaque domaine custom, le client doit configurer un enregistrement DNS :

```
example.com.  CNAME  votre-caddy-server.example.com.
```

Pour les sous-domaines, un wildcard DNS pointant vers Caddy suffit :

```
*.roadmaps.example.com.  CNAME  votre-caddy-server.example.com.
```
