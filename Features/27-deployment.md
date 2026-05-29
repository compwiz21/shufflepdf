# 27 — Deployment Runbook

## Files in repo
- `Dockerfile`
- `docker-compose.yml`
- `nginx/shufflepdf.conf`
- `README.md` — quickstart section

## Dockerfile (multi-stage)
- Stage 1 `deps`: `node:20-alpine`, `npm ci`
- Stage 2 `builder`: copy src, `npm run build` (Next.js standalone output)
- Stage 3 `runner`: `node:20-alpine`, copy `.next/standalone`, `.next/static`, `public/`
- `EXPOSE 3000`, `CMD ["node", "server.js"]`
- Runs as non-root `node` user.

## next.config.ts
```ts
export default { output: 'standalone', poweredByHeader: false };
```

## docker-compose.yml
```yaml
services:
  web:
    build: .
    container_name: shufflepdf-web
    restart: unless-stopped
    ports:
      - "127.0.0.1:3010:3000"
```

## nginx site (initially HTTP only — certbot will add HTTPS blocks in place)
File: `/etc/nginx/sites-available/shufflepdf`

```
server {
    listen 80;
    listen [::]:80;
    server_name shufflepdf.com www.shufflepdf.com;

    client_max_body_size 100m;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## One-time setup
```bash
cd /opt/apps/ShufflePDF
docker compose build
docker compose up -d
sudo cp nginx/shufflepdf.conf /etc/nginx/sites-available/shufflepdf
sudo ln -sf /etc/nginx/sites-available/shufflepdf /etc/nginx/sites-enabled/shufflepdf
sudo nginx -t && sudo systemctl reload nginx

# Once DNS A records for shufflepdf.com + www.shufflepdf.com resolve to this server:
sudo certbot --nginx -d shufflepdf.com -d www.shufflepdf.com \
  --non-interactive --agree-tos -m deployitfast@gmail.com --redirect
```

## Updates
```bash
cd /opt/apps/ShufflePDF
git pull
docker compose build
docker compose up -d
```

## Health checks
- `curl -sI http://127.0.0.1:3010` → 200
- `curl -sI -H 'Host: shufflepdf.com' http://127.0.0.1` → 200
- After certbot: `curl -sI https://shufflepdf.com` → 200 with valid cert
