# GEMINI.md

## Project Overview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses the **App Router**, [React](https://reactjs.org/), and [TypeScript](https://www.typescriptlang.org/). The project appears to be a web-based admin panel.

**Key Technologies:**

- **Framework:** Next.js
- **UI Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Sass
- **Code Quality:** ESLint, Prettier
- **Git Hooks:** Husky, lint-staged

## Building and Running

To get the development server running:

```bash
npm run dev
```

To build the application for production:

```bash
npm run build
```

To start a production server:

```bash
npm run start
```

To lint the code:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

## Development Conventions

- **TypeScript:** The project uses TypeScript with strict type checking enabled. Refer to `tsconfig.json` for detailed compiler options.
- **Styling:** The project uses Tailwind CSS for utility-first styling and Sass for pre-processing CSS. Global styles are located in `src/styles/globals.scss`.
- **Linting & Formatting:** ESLint (using the new flat config format in `eslint.config.mjs`) is used for code quality, and Prettier is used for automatic code formatting. These are enforced via Husky pre-commit hooks using `lint-staged`.
- **Project Structure:** Source code is organized within the `src/` directory. Path aliases (e.g., `@/components`) are configured in `tsconfig.json` for easier imports.
- **License:** The project is licensed under Apache 2.0.
- **Editor Configuration:** `.editorconfig` is used to maintain consistent coding styles across different editors.
- **Git Configuration:** `.gitattributes` is used to ensure consistent line endings and file handling within the Git repository.
- **Contribution Guidelines:** (Not specified)
