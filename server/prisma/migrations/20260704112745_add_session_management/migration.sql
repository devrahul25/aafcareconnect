/*
  Warnings:

  - Added the required column `family_id` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionRevokedReason" AS ENUM ('ROTATED', 'LOGOUT', 'LOGOUT_ALL', 'REUSE_DETECTED', 'ADMIN_REVOKED', 'EXPIRED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_CREATED';
ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_REFRESHED';
ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_REVOKED';
ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_ROTATED';
ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_EXPIRED';
ALTER TYPE "AuditEventType" ADD VALUE 'TOKEN_REUSE_DETECTED';

-- AlterTable
ALTER TABLE "user_sessions" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "family_id" TEXT NOT NULL,
ADD COLUMN     "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "operating_system" TEXT,
ADD COLUMN     "parent_session_id" TEXT,
ADD COLUMN     "revoked_reason" "SessionRevokedReason";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "session_version" INTEGER NOT NULL DEFAULT 1;
