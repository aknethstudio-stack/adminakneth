
# AKNETH Studio Admin Panel


[![CI Status](https://github.com/aknethstudio-stack/adminakneth/actions/workflows/ci.yml/badge.svg)](https://github.com/aknethstudio-stack/adminakneth/actions)
[![Release](https://img.shields.io/github/v/release/aknethstudio-stack/adminakneth?label=release)](https://github.com/aknethstudio-stack/adminakneth/releases)
[![CodeFactor](https://www.codefactor.io/repository/github/aknethstudio-stack/adminakneth/badge)](https://www.codefactor.io/repository/github/aknethstudio-stack/adminakneth)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f72ff140ed804d7b95a981f5cbdd1014)](https://app.codacy.com/gh/aknethstudio-stack/adminakneth/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## Overview

This is the admin panel for the [AKNETH Studio website](https://akneth-studio.vercel.app) ([main repo](https://github.com/akneth-studio/akneth.studio)). It provides secure, admin-only management features for the studio's content and users.

- **Framework:** Next.js (App Router, React, TypeScript)
- **Styling:** Tailwind CSS, Sass
- **Auth:** Supabase (JWT, admin-only)
- **Testing:** Jest
- **CI/CD:** GitHub Actions

## Features
- Admin authentication (Supabase, email allowlist)
- Dashboard for managing studio content
- User management
- Secure API routes (admin-only)
- Responsive, modern UI

## Getting Started

1. **Clone the repo:**
	```bash
	git clone https://github.com/aknethstudio-stack/adminakneth.git
	cd adminakneth
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Configure environment:**
	- Copy `.env.example` to `.env.local` and fill in Supabase and admin config (see `AUTH_SETUP.md`).
4. **Run the dev server:**
	```bash
	npm run dev
	# or use scripts/devserv.sh (zsh shortcut)
	```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint code (ESLint)
- `npm run format` — Format code (Prettier)
- `npm run test` — Run tests (Jest)
- `npm run release` — Semantic release

## Project Structure
- `src/app/` — Next.js pages & API routes
- `src/components/` — Reusable UI components
- `src/lib/` — Utilities, auth logic, Supabase client
- `src/styles/` — Global styles (Sass, Tailwind)

## Contributing
- Uses Git Flow branching (see `CONTRIBUTING.md`)
- Conventional Commits enforced (`commitlint.config.cjs`)
- Linting, formatting, and tests required for PRs


## Release & Changelog
- Releases and changelog are managed automatically by [semantic-release](https://github.com/semantic-release/semantic-release).
- See [CHANGELOG.md](./CHANGELOG.md) and the [GitHub Releases tab](https://github.com/aknethstudio-stack/adminakneth/releases) for details.

## References
- [AKNETH Studio main site](https://akneth-studio.vercel.app)
- [Main repo](https://github.com/akneth-studio/akneth.studio)
- [Supabase](https://supabase.com/)
- See `AUTH_SETUP.md`, `GEMINI.md`, and `.github/copilot-instructions.md` for more details

---
Licensed under the Apache 2.0 License.
