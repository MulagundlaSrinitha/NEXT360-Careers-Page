# NEXT360-Careers-Page

The Next360 careers site: a public careers portal plus an internal admin dashboard for
running recruitment. Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4,
and Prisma on PostgreSQL.

## Features

**Public careers site (`/careers`)**

- Landing page, "About", "Life at Next360", "Early Careers", "Teams", "FAQ"
- Job search with department / location / experience / work-mode filters, sorting, pagination
- Job detail pages and an application form
- Candidate-facing application tracker (`/careers/applications`)

**Admin dashboard (`/admin/careers`)**

- Overview dashboard with recruiting metrics
- Job CRUD (create, edit, publish, archive)
- Candidate and application review with status transitions
- Interview scheduling and notes
- Team management
- Platform settings

## Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)            |
| UI         | React 19, Tailwind CSS v4, TypeScript         |
| Data       | Prisma 7 with the `@prisma/adapter-pg` driver |
| Database   | PostgreSQL                                    |
| Lint       | ESLint 9 with `eslint-config-next`            |

## Requirements

- Node.js 20+
- A PostgreSQL database

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

   The `postinstall` hook runs `prisma generate`, so the Prisma Client is always in sync
   with `prisma/schema.prisma`.

2. Configure the database connection. Copy the template and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/next360_careers?schema=public"
   ```

3. Apply the database schema and seed data:

   ```bash
   npm run prisma:migrate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The root route redirects to
   `/careers`.

## Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the dev server                           |
| `npm run build`         | Production build                               |
| `npm start`             | Serve the production build                     |
| `npm run lint`          | Run ESLint                                     |
| `npm run typecheck`     | Run `tsc --noEmit`                             |
| `npm run prisma:generate` | Regenerate the Prisma Client                 |
| `npm run prisma:migrate`  | Apply pending migrations                     |

## Data model

`prisma/schema.prisma` defines three models:

- **Job** — a posting, including team, skills, responsibilities, qualifications, benefits,
  and status (`Draft` / `Published` / …).
- **Application** — a candidate's application for a job, including profile details, resume
  metadata, and interview scheduling fields.
- **Team** — a team taxonomy record used to group jobs and describe team areas.

Migrations live in `prisma/migrations`. The `seed_teams` migration inserts the seven
Next360 team records idempotently.

## Project structure

```
prisma/
  schema.prisma          # Data model
  migrations/            # Versioned SQL migrations
src/
  app/
    careers/             # Public careers site
    admin/careers/       # Admin dashboard pages
    api/careers/         # Public API routes
    api/admin/careers/   # Admin API routes
  components/
    careers/             # Public site components
    admin/               # Admin dashboard components
  lib/prisma.ts          # Prisma client singleton
patches/braces/          # Locally patched dependency (see below)
```

## Vendored dependency patch

`patches/braces` is a local build of `braces@3.0.3` with a maximum brace nesting depth
guard, applied via the `overrides` field in `package.json`.

Upstream `braces` has no released fix for [CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
(gh advisory `GHSA-vfj7-8cjw-p6xm`): deeply nested brace patterns can exhaust the call stack
in the recursive AST walkers. The patch enforces a depth limit in `parse()` and adds depth
guards to the `compile()` and `expand()` walkers, so the vulnerability is fixed at the
source rather than only in the downstream walker.

To verify the patch, run:

```bash
npm run test:vendor
```

This checks that the patched package is the one actually resolved, that normal expansion,
ranges, and compilation are unchanged, that deeply nested patterns are rejected instead of
overflowing the stack, and (when an upstream copy is available via `UPSTREAM_BRACES_DIR`)
that output matches upstream `braces@3.0.3` byte for byte.

Once upstream ships a fixed release, remove the `overrides` entry and the `patches/braces`
directory, then delete `fill-range` from `devDependencies`.

## Deploying

The app is a standard Next.js application and deploys to any platform that supports it.
Vercel is the path of least resistance:

```bash
npx vercel
```

### 1. Provision a reachable PostgreSQL database

The database must be reachable **from the deployed app**, so a local PostgreSQL instance
will not work. Use a managed provider such as Neon, Supabase, Vercel Postgres, Railway, or
Amazon RDS.

### 2. Set `DATABASE_URL`

In Vercel: **Project → Settings → Environment Variables**, add `DATABASE_URL` with the
connection string, and enable it for **Production**, **Preview**, and **Development** as
needed. Do not commit the value to the repository.

### 3. Apply the schema

Run the migrations against the deployed database once:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

`prisma migrate deploy` applies any pending migrations and seeds the seven team records.

### 4. Deploy

Push to `main` (or run `npx vercel`). The build runs `npm install` (which generates the
Prisma Client) followed by `next build`.

### Build-time vs. runtime database access

The build **does not** require a reachable database. Every route that reads from PostgreSQL
is marked `export const dynamic = "force-dynamic"` and is rendered on request, so
`next build` succeeds even when `DATABASE_URL` is not set in the build environment. This
avoids the `Can't reach database server` prerender failure that a static route hitting the
database would cause on hosted platforms.

`DATABASE_URL` is still required at runtime — if it is missing, the app responds with an
explicit error explaining that it must be set rather than failing with an opaque connection
error.
