-- Fix schema drift: add columns present in schema.prisma but missing from DB

-- admins: add lastLoginAt
ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

-- users: add lastLoginAt
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

-- vendors: add missing columns
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "certifications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "installationCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "warrantySupport" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "responseTimeHours" INTEGER;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
