-- Step 1: Add PENDING_APPROVAL to UserStatus enum (in its own transaction)
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';

-- Step 2: Add new columns to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "approved_by" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "approved_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "rejection_reason" TEXT;

-- Step 3: Add foreign key constraint for approved_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_approved_by_fkey'
  ) THEN
    ALTER TABLE "users" 
    ADD CONSTRAINT "users_approved_by_fkey" 
    FOREIGN KEY ("approved_by") 
    REFERENCES "users"("id") 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;
