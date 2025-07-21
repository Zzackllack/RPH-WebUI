# AGENTS.PROJECT.md

## Project Overview

This repository is a full-stack Minecraft Resource Pack Hosting Platform, consisting of two main applications:

- **Backend:** Java Spring Boot REST API (located in `apps/backend`)
- **Frontend:** Next.js/React/TypeScript web UI (located in `apps/frontend`)

### Directory Structure

- `apps/backend/` — Java Spring Boot backend
- `apps/frontend/` — Next.js/React/TypeScript frontend
- `README.md` — Project documentation
- `CONTRIBUTING.md` — Contribution guidelines
- `LICENSE` — BSD 3-Clause License

## Integration

- The frontend connects to the backend API using the `NEXT_PUBLIC_API_URL` environment variable.
- Resource pack files are uploaded via the frontend and managed by the backend.
- Conversion jobs are handled asynchronously by the backend and surfaced in the frontend dashboard.

## Coding Standards

- Backend: See `agents.backend.md` for Java/Spring Boot conventions.
- Frontend: See `agents.frontend.md` for Next.js/React/TypeScript conventions.

## Code Quality Scripts

All contributors and AI agents should use the following scripts before submitting changes to any part of the project:

### Format

Formats all supported files (Java, JavaScript, TypeScript, CSS) using Prettier:

```bash
pnpm run format
```

### Lint

Lints frontend source files using ESLint:

```bash
pnpm run lint
```

## Build & Run

- See individual agents.md files for build/run/test instructions for each app.

## Documentation

- All documentation files use Markdown and follow the standards in `.github/instructions/Markdown.instructions.md`.

## For AI Agents

- Use the agents.md files to understand project structure, coding standards, and integration points.
- Always check for environment variables and configuration files in each app.
- Refer to the README and CONTRIBUTING files for additional context.

---

For more details, see the respective agents.md files for backend and frontend.
