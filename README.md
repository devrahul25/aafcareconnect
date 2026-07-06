# CareConnect 🚀

CareConnect is a comprehensive platform facilitating management and coordination for care organizations.

## 🛠 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (>= v20.0.0)
- **NPM** (>= v10)
- **PostgreSQL** (Running locally or hosted)

## 🚀 Quick Setup

This repository is designed for a seamless developer experience.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aafcareconnect
   ```

2. **Run the automated setup:**
   ```bash
   npm run setup
   ```
   *This command will install all dependencies, generate the Prisma client, apply database migrations, and copy `.env.example` to `.env` in the server folder.*

3. **Configure Environment Variables:**
   - Open `server/.env` and update `DATABASE_URL` with your PostgreSQL credentials.
   - Update `FIREBASE_PROJECT_ID` and `FIREBASE_PRIVATE_KEY` with your Firebase Admin credentials.

4. **Start Development Servers:**
   ```bash
   npm run dev
   ```
   *This single command starts both the Vite frontend and the Express backend simultaneously.*

## 🩺 Health Check
If you encounter issues, run the doctor script to automatically diagnose missing environment variables, port conflicts, or version mismatches:
```bash
npm run doctor
```

## 📁 Folder Structure
- `/` - Root orchestrator & Vite frontend.
- `/src` - React frontend application code.
- `/server` - Express/Node.js backend, Prisma schema, and API routes.
- `/scripts` - Cross-platform Node.js automation scripts.

## 📜 Available Scripts (Run from Root)
| Command | Description |
|---------|-------------|
| `npm run dev` | Starts frontend & backend concurrently. |
| `npm run build` | Builds both frontend and backend for production. |
| `npm run lint` | Lints the entire monorepo. |
| `npm run typecheck` | Runs TypeScript checks for client and server. |
| `npm run setup` | Initializer for fresh clones. |
| `npm run doctor` | Health check for dev environment. |
| `npm run clean` | Removes all `node_modules` and `dist` folders. |
| `npm run studio` | Opens Prisma Studio for the backend database. |
| `npm run reset-db` | Resets the PostgreSQL database and applies migrations. |

## 📚 Further Documentation
For detailed guides on workflows, architecture, and contribution standards, please refer to:
- [SETUP.md](./SETUP.md) - Deep dive into Firebase and AWS configuration.
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Internal workflow rules, formatting, and linting.
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - System architecture diagram and module details.
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Branching rules and PR guidelines.
