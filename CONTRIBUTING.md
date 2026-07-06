# Contributing to CareConnect

## Branching Strategy
We follow Git Flow lightly.
- `master`: Production-ready code.
- `feature/*`: New features (e.g., `feature/course-management`).
- `bugfix/*`: Bug fixes.

## Pull Requests
1. All PRs must target `master`.
2. PR titles should be clear and descriptive.
3. CI checks (Lint, Typecheck, Build, Test) MUST pass. You can verify this locally using `npm run check`.
4. Do NOT commit `.env` files.

## Coding Standards
- We strictly use ESLint and Prettier. Run `npm run format` and `npm run lint` before committing.
- Do not bypass TypeScript errors with `@ts-ignore` unless absolutely necessary and documented.
