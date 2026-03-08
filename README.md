# Event Ticket App

Full-stack event ticketing platform. Spring Boot backend, React frontend.

## Environment

Backend defaults are safe for local dev and can be overridden via env vars:
- `SPRING_DATASOURCE_URL` (default: `jdbc:postgresql://localhost:5432/postgres`)
- `SPRING_DATASOURCE_USERNAME` (default: `postgres`)
- `SPRING_DATASOURCE_PASSWORD` (default: `postgres`)
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` (default: `http://localhost:9090/realms/event-ticket-platform`)

Frontend OIDC values can be overridden with Vite env vars:
- `VITE_OIDC_AUTHORITY` (default: `http://localhost:9090/realms/event-ticket-platform`)
- `VITE_OIDC_CLIENT_ID` (default: `event-ticket-platform-app`)
- `VITE_OIDC_REDIRECT_URI` (default: `http://localhost:5173/callback`)

## Local auth setup (Keycloak)

The frontend uses OIDC and expects this Keycloak config:
- Realm: `event-ticket-platform`
- Client: `event-ticket-platform-app`
- Protocol: `openid-connect`
- Public client (client authentication off)
- Web origin: `http://localhost:5173`
- Root URL: `http://localhost:5173`
- Redirect URI: `http://localhost:5173/callback`
- Post logout redirect URI: `http://localhost:5173`
- Realm roles: `ROLE_ORGANIZER`, `ROLE_ATTENDEE`, `ROLE_STAFF`

Seeded users from import:
- `organizer` / `organizer` -> `ROLE_ORGANIZER`
- `attendee` / `attendee` -> `ROLE_ATTENDEE`
- `staff` / `staff` -> `ROLE_STAFF`

This repo now auto-imports the realm/client on Keycloak start.

From `api/` run:

```bash
docker compose down -v
docker compose up -d
```

Then open Keycloak at `http://localhost:9090` (admin/admin) and verify the realm exists.

Note: because we use a persistent volume, re-import only happens cleanly after `docker compose down -v`.
