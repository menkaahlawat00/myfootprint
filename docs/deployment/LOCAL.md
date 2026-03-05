# Local Development Setup

Guide for running My FootPrint on your local machine.

---

## Prerequisites

- **Node.js 20+** (check with `node --version`)
- **npm 10+** (check with `npm --version`)
- **Docker & Docker Compose** (only needed for local PostgreSQL)
- A [Clerk](https://clerk.com) account (free tier works for development)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/myfootprint.git
cd myfootprint
```

### 2. Copy environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Clerk keys. For local development, the database URL defaults to the Docker PostgreSQL instance:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myfootprint
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the local database

```bash
docker compose up db -d
```

This starts a PostgreSQL 16 container on port 5432 with:
- Database: `myfootprint`
- User: `postgres`
- Password: `postgres`

### 5. Run database migrations

```bash
npm run db:migrate
```

### 6. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Docker Full Stack

To run both the app and database as Docker containers:

### 1. Copy environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Clerk and Resend credentials.

### 2. Build and start all services

```bash
docker compose up --build
```

This will:
- Build the Next.js app as a multi-stage Docker image
- Start PostgreSQL with a health check
- Start the app (waits for database to be healthy)
- Expose the app on port 3000

To run in detached mode:

```bash
docker compose up --build -d
```

To stop all services:

```bash
docker compose down
```

To stop and remove all data (including the database volume):

```bash
docker compose down -v
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server with Turbopack |
| `build` | `npm run build` | Create production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `format` | `npm run format` | Format code with Prettier |
| `db:generate` | `npm run db:generate` | Generate Drizzle migration files from schema changes |
| `db:migrate` | `npm run db:migrate` | Apply pending migrations to the database |
| `db:studio` | `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `test` | `npm run test` | Run tests with Vitest |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `test:coverage` | `npm run test:coverage` | Run tests with coverage report |
| `docker:build` | `npm run docker:build` | Build Docker images via Compose |
| `docker:up` | `npm run docker:up` | Start Docker services in detached mode |
| `docker:down` | `npm run docker:down` | Stop Docker services |

---

## Database Management

### Schema changes workflow

1. Edit the schema in `src/lib/db/schema.ts`.
2. Generate a migration:
   ```bash
   npm run db:generate
   ```
3. Review the generated SQL in `src/lib/db/migrations/`.
4. Apply the migration:
   ```bash
   npm run db:migrate
   ```

### Drizzle Studio

To browse and edit your local database with a visual GUI:

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio`.

### Reset the database

To completely reset the local database (Docker):

```bash
docker compose down -v
docker compose up db -d
npm run db:migrate
```

---

## Testing

### Run all tests

```bash
npm run test
```

### Watch mode (re-runs on file changes)

```bash
npm run test:watch
```

### Coverage report

```bash
npm run test:coverage
```

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes | - |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes | - |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret | No (dev) | - |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path | Yes | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path | Yes | `/sign-up` |
| `RESEND_API_KEY` | Resend API key for sending emails | No (dev) | - |
| `EMAIL_FROM` | Sender email address | No | `My FootPrint <noreply@myfootprint.app>` |
| `CRON_SECRET` | Secret for protecting the cron endpoint | No (dev) | - |
