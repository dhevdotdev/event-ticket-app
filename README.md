# Event Ticket App

Full-stack event ticketing platform. Spring Boot backend, React frontend.

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
