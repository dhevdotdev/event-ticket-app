# Event Ticket Platform

Full-stack event ticketing app with a Spring Boot API, React frontend, PostgreSQL, and Keycloak.

## Project Layout

- `api` - Spring Boot backend
- `client` - React + Vite frontend

## Prerequisites

- Java 21
- Node.js 20+
- PostgreSQL running on `localhost:5432`
- Docker

## Run Locally

1. Start Keycloak:

```bash
cd api
docker compose down -v
docker compose up -d
```

2. Start the backend:

```bash
cd api
./mvnw spring-boot:run
```

3. Start the frontend:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Auth

Keycloak is configured for local dev on `http://localhost:9090` and auto-imports the realm on startup.

- Realm: `event-ticket-platform`
- Client: `event-ticket-platform-app`
- Redirect URI: `http://localhost:5173/callback`

Seeded users:

- `organizer` / `organizer`
- `attendee` / `attendee`
- `staff` / `staff`

Keycloak admin:

- `http://localhost:9090`
- `admin` / `admin`

## Environment

Backend defaults:

- `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/postgres`
- `SPRING_DATASOURCE_USERNAME=postgres`
- `SPRING_DATASOURCE_PASSWORD=postgres`
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=http://localhost:9090/realms/event-ticket-platform`

Frontend defaults:

- `VITE_OIDC_AUTHORITY=http://localhost:9090/realms/event-ticket-platform`
- `VITE_OIDC_CLIENT_ID=event-ticket-platform-app`
- `VITE_OIDC_REDIRECT_URI=http://localhost:5173/callback`

## Notes

- If Keycloak changes are not showing up, rerun `docker compose down -v` before `docker compose up -d`.
- Organizer flows live under `/dashboard/events`.
- Attendee flows live under `/dashboard/tickets`.
- Staff validation lives under `/dashboard/validate-qr`.
