# Setup Guide

## 1. Firebase Administration Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable Authentication (Email/Password & Social Providers).
4. Go to **Project Settings** > **Service Accounts**.
5. Generate a new private key and download the JSON.
6. Open `server/.env` and insert the values:
   ```env
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

## 2. PostgreSQL Setup
1. Install PostgreSQL locally, or spin up a Docker container:
   ```bash
   docker run --name careconnect-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```
2. Update `server/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careconnect?schema=public"
   ```

## 3. AWS Services (Optional for local dev)
1. Add IAM User with S3 access.
2. Provide `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
3. Provide `AWS_S3_BUCKET`.
