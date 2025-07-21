# AGENTS.FRONTEND.md

## Frontend Overview

This is the Next.js/React/TypeScript web UI for Minecraft Resource Pack Hosting.

### Location

- Directory: `apps/frontend/`

### Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- pnpm (recommended)

## Project Structure

- `src/app/` — Main app code (pages, components, contexts, types)
- `src/app/components/` — UI components (auth, dashboard, home, packs, ui)
- `src/app/contexts/` — React context providers (Auth, Theme, Toast)
- `src/app/types/` — TypeScript types/interfaces
- `public/` — Static assets
- `globals.css` — Global styles (Minecraft theme, Tailwind)
- `tailwind.config.ts` — Tailwind configuration
- `package.json` — Project dependencies and scripts

## Code Quality Scripts

All contributors and AI agents should use the following scripts before submitting changes to the frontend:

### Format

Formats all supported files (JavaScript, TypeScript, CSS) using Prettier:

```bash
pnpm run format
```

### Lint

Lints frontend source files using ESLint:

```bash
pnpm run lint
```

## Build & Run

- **Install dependencies:**

  ```pwsh
  pnpm install
  ```

- **Start development server:**

  ```pwsh
  pnpm dev
  ```

## Environment & Configuration

- API URL: Set `NEXT_PUBLIC_API_URL` in your environment for backend connection.
- Tailwind and PostCSS configs are in the root of `apps/frontend`.

## Coding Standards

- Follow Next.js, React, and TypeScript best practices (see `.github/instructions/Next.js-Tailwind-Development-Instructions.instructions.md` and `.github/instructions/ReactJS-Development-Instructions.md`).
- Use functional components and hooks.
- Use Tailwind CSS for styling.
- Organize code by feature (components, contexts, types).
- Write tests for new features and components.

## For AI Agents

- Main entry: `src/app/page.tsx`
- Packs details: `src/app/packs/[id]/page.tsx`
- Types/interfaces: `src/app/types/index.ts`
- Global styles: `src/app/globals.css`
- Use Tailwind utility classes for styling.
- All API calls use the URL from `NEXT_PUBLIC_API_URL`.
- See `.github/instructions/Performance-Optimization-Best-Practices.instructions.md` for optimization tips.

---

For more details, see the README and CONTRIBUTING files.
