# Codeverse: Local CI/CD & Deployment helper

This folder contains helper configuration to run the application stack locally using Docker Compose and Caddy as a reverse proxy.

How it routes on the deployed port (Caddy):

- `/docs` -> backend Swagger (proxied to `backend:8080`)
- `/api` -> backend API (proxied to `backend:8080`)
- `/` -> frontend (proxied to `frontend:3000`)

Quickstart (requires Docker & Docker Compose):

````bash
# build and run all services
docker compose up --build

# stop and remove
docker compose down
# Codeverse: Local CI/CD & Deployment helper

This folder contains helper configuration to run the application stack locally using Docker Compose and Caddy as a reverse proxy.

How it routes on the deployed port (Caddy):

- `/docs` -> backend Swagger (proxied to `backend:8080`)
- `/api` -> backend API (proxied to `backend:8080`)
- `/` -> frontend (proxied to `frontend:3000`)

Quickstart (requires Docker & Docker Compose):

```bash
# build and run all services
docker compose up --build

# stop and remove
docker compose down
````

Notes:

- The `Caddyfile` is at `./caddy/Caddyfile` and mounted into the official `caddy:2` image.
- For production, consider using a managed reverse proxy / load balancer and TLS termination (Caddy can do automatic TLS when a hostname is provided).
- To publish images to a registry, use the supplied GitHub Actions workflow template or create your own pipeline that builds and pushes images to your registry.

Running locally with DB

- The compose file now includes a `db` (MySQL) service. The backend reads `DATABASE_URL` from `backend/.env` by default. Update `backend/.env` if you want to point to an external DB instead.

Recommended commands:

```bash
# build and run (remove orphan containers if you renamed services previously)
docker compose up --build --remove-orphans
```

If you prefer not to run a DB in compose, set `DATABASE_URL` in `backend/.env` to your external database and ensure connectivity.
