# Development Guide

## Workflow Overview
1. **Pull Latest Changes**: Always ensure you are on `master` and pull the latest changes before branching.
2. **Branch Naming**: See `CONTRIBUTING.md`.
3. **Commit Setup**: Ensure you have run `npm run setup` locally.

## Scripts & Automation
We use a centralized approach using `npm --prefix` and `concurrently` from the root directory.

### Running the App
- `npm run dev` starts both client and server.
- The terminal output is prefixed with `[CLIENT]` (cyan) and `[SERVER]` (blue).
- Crashing one server will automatically terminate the other.

### Validating Code
Before committing, always run:
```bash
npm run check
```
*(Alternatively, run `npm run lint` and `npm run typecheck` from the root).*

## Editor Configuration
We strongly recommend **VS Code**. 
- On first opening the repository, accept the prompt to install **Workspace Recommended Extensions**.
- Prettier and ESLint are configured to format and fix automatically on save.

## Troubleshooting
Run `npm run doctor` to pinpoint local configuration issues.
