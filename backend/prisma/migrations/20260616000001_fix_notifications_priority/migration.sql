-- Fix schema drift: add missing priority column to notifications table

-- Create the enum type if it doesn't already exist
DO $$ BEGIN
  CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Add the priority column with MEDIUM as default (matches schema.prisma)
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM';
