# Copilot Instructions for AI Coding Agents

## Project Overview
- **Framework:** Next.js (App Router, React, TypeScript)
- **Purpose:** Web-based admin panel for AKNETH Studio
- **Key Technologies:** Tailwind CSS, Sass, Supabase (auth), ESLint, Prettier, Husky, lint-staged

## Architecture & Structure
- All source code is in `src/`:
  - `src/app/`: Next.js App Router pages and API routes (see `api/` for backend endpoints)
  - `src/components/`: Reusable React UI components
  - `src/lib/`: Utilities, authentication logic, Supabase client config
  - `src/styles/`: Global styles (`globals.scss`), variables (`_variables.scss`)
- Path aliases (e.g., `@/components`) are set in `tsconfig.json`.
- Authentication is handled via Supabase with JWT and admin-only access (see `AUTH_SETUP.md` for details).

## Developer Workflows
- **Start dev server:** `npm run dev` (or use `scripts/devserv.sh` for a zsh shortcut)
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`
- **Lint:** `npm run lint` (ESLint, config in `eslint.config.mjs`)
- **Format:** `npm run format` (Prettier)
- **Test:** `npm run test` (Jest, config in `jest.config.mjs`)
- **Release:** `npm run release` (semantic-release, see workflows)

## Conventions & Patterns
- **Branching:** Git Flow (see `CONTRIBUTING.md` for branch naming)
- **Commits:** Conventional Commits enforced via `commitlint.config.cjs`
- **Styling:** Use Tailwind for most styling, Sass for global styles/variables
- **Auth:** Use helpers in `src/lib/auth.ts` and `src/lib/auth-context.tsx` for authentication logic
- **API:** Place Next.js API routes in `src/app/api/` (see `AUTH_SETUP.md` for protected endpoints)
- **Environment:** Copy `.env.example` to `.env.local` and fill in required values for Supabase and admin config

## Integration Points
- **Supabase:** All authentication and user management (see `src/lib/supabase.ts` and `AUTH_SETUP.md`)
- **CI/CD:** GitHub Actions workflows for CI, release, and Gemini-based PR/issue triage (see `.github/workflows/`)
- **Code Quality:** Linting, formatting, and test coverage are enforced in CI

## Examples
- To add a new protected API route: create a file in `src/app/api/`, use Supabase auth helpers, and restrict access to admin emails
- To add a new UI component: place it in `src/components/`, use Tailwind for styling, and import via path alias

## References
- See `GEMINI.md` for more on conventions and project setup
- See `AUTH_SETUP.md` for authentication and environment setup
- See `CONTRIBUTING.md` for contribution and branching guidelines

---
For questions, see the issue template in `.github/ISSUE_TEMPLATE/` or ask in GitHub Discussions.
