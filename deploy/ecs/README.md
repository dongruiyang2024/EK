# EK ECS deployment

- Host: `101.37.90.139` (`i-bp1cgr3znqcdryh1beuw`).
- Public origin: `https://ek.syncmind.cn`.
- Server directory: `/data/services/ek`.
- Uploaded repository snapshot: `eecfe4b3`.
- Runtime: official WeKnora `v0.8.3` release images, release revision
  `3e22822c1d2397be730c458c7539d0eb8c113a24`. The uploaded newer source snapshot
  is retained for maintenance; it is not a locally compiled runtime.
- Services: frontend, app, docreader, ParadeDB, Redis.
- Docker/containerd storage is on the server's `/data` disk.

## Verified state — 2026-10-21 00:13 Asia/Shanghai

- All five containers are running; app, docreader, and database health checks pass.
- Nginx frontend HTML and built JavaScript/CSS return HTTP 200.
- Administrator login, knowledge-base/model/system APIs, and Redis authentication pass.
- Public registration is invitation-only; unauthenticated protected API calls are rejected.
- Database migration version is 118, with `dirty=false`; `vector=0.8.4` and
  `pg_search=0.25.11` are installed.
- A real Word document was successfully parsed through Docreader's gRPC API.
- Initial backup: `/data/services/ek/backups/20261021-001152`.
- Initial idle memory across the five containers is approximately 426 MiB.
  This does not predict document-processing peaks.
- Data disk has approximately 52 GiB available after removing installation archives.
- Existing SyncMind and Gitea HTTPS endpoints still return HTTP 200.
- **Pending:** no model API credentials were supplied; AI/embedding calls were not tested.

## HTTPS verified — 2026-10-21 08:31 Asia/Shanghai

- DNS resolves `ek.syncmind.cn` to `101.37.90.139`, with no AAAA record.
- HTTPS returns HTTP 200 from the local computer, with successful certificate verification.
- HTTP redirects to HTTPS with status 301.
- Let's Encrypt certificate is valid through 2027-01-18 23:30:02 UTC.
- HTTPS frontend assets, administrator login, protected APIs, registration policy,
  and Redis authentication all pass the deployment smoke checks.
- All five containers remain running; app, docreader, and database are healthy.
- Initial TLS bootstrap timer has disabled itself; `certbot.timer` is active for renewal.

## Operations

```sh
ssh root@101.37.90.139
/data/services/ek/ekctl ps
/data/services/ek/ekctl logs --tail=100 app
/data/services/ek/ekctl up -d --no-build --pull never
```

The effective Compose configuration is the combination of
`source/docker-compose.yml` and `source/compose.override.yml`. The override
pins verified official image digests, limits CPU/memory, rotates Docker logs,
and persists Redis data in a named volume. Configuration secrets are in
`source/.env` (mode `0600`); keep its `SYSTEM_AES_KEY` for restores.

Only loopback ports are published:

- `127.0.0.1:8086`: frontend.
- `127.0.0.1:8087`: backend.

The host Nginx virtual host is `/etc/nginx/sites-available/ek.syncmind.cn`.
API proxying disables buffering and allows WebSocket upgrades.

## Administrator

The bootstrap account is `admin@ek.syncmind.cn` (username `ekadmin`).
Its generated password is stored only in the server's root-readable file:

```sh
cat /data/services/ek/admin-credentials.json
```

Public registration is disabled after account initialization. Use the
administrator UI to manage users. No model API credentials are supplied by
this repository; configure a model provider before testing AI answers,
embeddings, or model-assisted document processing.

## DNS and HTTPS

DNS must contain an A record `ek.syncmind.cn -> 101.37.90.139`.
Do not add an AAAA record unless IPv6 is separately configured.

The initial certificate was issued successfully on 2026-10-21. The
`ek-tls-bootstrap.timer` has stopped and disabled itself after HTTPS verification.
Normal certificate renewal uses the active `certbot.timer`.

```sh
systemctl status certbot.timer
journalctl -u ek-tls-bootstrap.service --no-pager -n 30
cat /data/services/ek/ops/tls-ready
```

For private maintenance access, an SSH tunnel is also available:

```sh
ssh -N -L 18086:127.0.0.1:8086 root@101.37.90.139
# Open http://127.0.0.1:18086
```

## Backup

Run `/data/services/ek/ops/ek-backup.sh` to save a PostgreSQL dump, uploaded
files, deployment configuration, and bootstrap credentials under
`/data/services/ek/backups`. Backups contain secrets and are root-readable.
This is a manual backup script, not a scheduled backup service. For a
consistent backup during active document writes, stop the app first and
restart it after the backup. Copy backups off the ECS for disaster recovery.

Do not run `docker compose down -v`: that deletes the application's data
volumes. Stop only this project with `/data/services/ek/ekctl stop`.

## EK branding release — 2026-10-21

The `codex/ek-brand-v0.8.3` branch starts at the exact deployed v0.8.3 release
revision, not the newer main branch. This avoids a frontend/backend API mismatch
and requires no database migration. The backend, Docreader, and data services
continue to use the pinned official release images described above.

The frontend now provides an EK public home at `/`, authentication at `/login`,
and local help at `/help`. It uses a muted blue-grey palette, an EK wordmark and
favicon, with matching workspace and dark-mode accents. Upstream marketing,
source-repository links, cloud-service promotion, and branded extension/CLI/skill
installation pages are removed from the product navigation. Existing compatibility
identifiers (storage keys, API fields, widget protocol) and license notices remain
intact. Public registration remains invitation-only.

To build on a machine with Node.js 24+:

```sh
cd frontend
npm ci --no-audit --no-fund
VITE_IS_DOCKER=true VITE_FRONTEND_COMMIT="$(git rev-parse --short HEAD)" npm run build
# Transfer only dist/ and Dockerfile.ecs to an ECS release directory, then:
docker build --pull=false --build-arg EK_REVISION=GIT_COMMIT -f Dockerfile.ecs -t ek-ui:GIT_COMMIT .
```

On the ECS, each frontend release is saved under
`/data/services/ek/releases/`. The previous Compose override and image remain
available there for rollback. Update only `services.frontend.image` in
`source/compose.override.yml`, then run:

```sh
/data/services/ek/ekctl up -d --no-deps --no-build --pull never frontend
python3 /data/services/ek/ops/ek-smoke.py
```

Rollback: restore the previous frontend image from the saved override and run the
same `up` command for `frontend` only. Do not replace `.env` or restart databases.

Validation: production build, TypeScript checks, route/help/registration-policy
tests, real administrator sign-in, public home/help/login at desktop and mobile
sizes, primary settings pages, light/dark theme, and HTTPS API smoke checks.
