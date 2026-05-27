-- Backward-compatible phase 1 extensions

-- New enums
DO $$ BEGIN
    CREATE TYPE "VerificationPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "UploadPurpose" AS ENUM ('VENDOR_DOCUMENT', 'USER_DOCUMENT', 'LEAD_ATTACHMENT', 'QUOTE_ATTACHMENT', 'PROFILE_IMAGE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "UploadProvider" AS ENUM ('LOCAL', 'CLOUDINARY', 'S3');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "QuoteRequestStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'QUOTE_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'EMAIL_VERIFICATION';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PASSWORD_RESET';

-- Existing tables
ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);

UPDATE "admins" SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", CURRENT_TIMESTAMP);
UPDATE "users" SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", CURRENT_TIMESTAMP);
UPDATE "vendors" SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", CURRENT_TIMESTAMP);

ALTER TABLE "vendor_documents" ADD COLUMN IF NOT EXISTS "uploadAssetId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_documents_uploadAssetId_key" ON "vendor_documents"("uploadAssetId");

-- Service areas for vendor matching
CREATE TABLE IF NOT EXISTS "vendor_service_areas" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "district" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "coverageRank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "vendor_service_areas_pkey" PRIMARY KEY ("id")
);

-- Notification read state support
CREATE TABLE IF NOT EXISTS "notification_read_states" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "adminId" TEXT,
    "userId" TEXT,
    "vendorId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_read_states_pkey" PRIMARY KEY ("id")
);

-- Verification and password reset support
CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "purpose" "VerificationPurpose" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "vendorId" TEXT,
    "adminId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "email_verification_tokens_token_key" ON "email_verification_tokens"("token");

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "vendorId" TEXT,
    "adminId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- Quote requests
CREATE TABLE IF NOT EXISTS "quote_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "vendorId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "pincode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "projectType" TEXT,
    "monthlyBill" INTEGER,
    "roofSize" INTEGER,
    "notes" TEXT,
    "status" "QuoteRequestStatus" NOT NULL DEFAULT 'NEW',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

-- Upload metadata
CREATE TABLE IF NOT EXISTS "upload_assets" (
    "id" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT,
    "purpose" "UploadPurpose" NOT NULL DEFAULT 'OTHER',
    "provider" "UploadProvider" NOT NULL DEFAULT 'LOCAL',
    "userId" TEXT,
    "vendorId" TEXT,
    "publicId" TEXT,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT,
    "originalName" TEXT,
    "mimeType" TEXT,
    "sizeInBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "checksum" TEXT,
    "metadata" JSONB,
    "createdByAdminId" TEXT,
    "quoteRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "upload_assets_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "vendor_service_areas_vendorId_idx" ON "vendor_service_areas"("vendorId");
CREATE INDEX IF NOT EXISTS "vendor_service_areas_pincode_idx" ON "vendor_service_areas"("pincode");
CREATE INDEX IF NOT EXISTS "vendor_service_areas_city_idx" ON "vendor_service_areas"("city");
CREATE INDEX IF NOT EXISTS "vendor_service_areas_state_idx" ON "vendor_service_areas"("state");

CREATE INDEX IF NOT EXISTS "notification_read_states_notificationId_idx" ON "notification_read_states"("notificationId");
CREATE INDEX IF NOT EXISTS "notification_read_states_adminId_idx" ON "notification_read_states"("adminId");
CREATE INDEX IF NOT EXISTS "notification_read_states_userId_idx" ON "notification_read_states"("userId");
CREATE INDEX IF NOT EXISTS "notification_read_states_vendorId_idx" ON "notification_read_states"("vendorId");

CREATE INDEX IF NOT EXISTS "email_verification_tokens_email_idx" ON "email_verification_tokens"("email");
CREATE INDEX IF NOT EXISTS "email_verification_tokens_expiresAt_idx" ON "email_verification_tokens"("expiresAt");
CREATE INDEX IF NOT EXISTS "email_verification_tokens_purpose_idx" ON "email_verification_tokens"("purpose");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

CREATE INDEX IF NOT EXISTS "quote_requests_userId_idx" ON "quote_requests"("userId");
CREATE INDEX IF NOT EXISTS "quote_requests_vendorId_idx" ON "quote_requests"("vendorId");
CREATE INDEX IF NOT EXISTS "quote_requests_pincode_idx" ON "quote_requests"("pincode");
CREATE INDEX IF NOT EXISTS "quote_requests_status_idx" ON "quote_requests"("status");

CREATE INDEX IF NOT EXISTS "upload_assets_ownerType_ownerId_idx" ON "upload_assets"("ownerType", "ownerId");
CREATE INDEX IF NOT EXISTS "upload_assets_userId_idx" ON "upload_assets"("userId");
CREATE INDEX IF NOT EXISTS "upload_assets_vendorId_idx" ON "upload_assets"("vendorId");
CREATE INDEX IF NOT EXISTS "upload_assets_quoteRequestId_idx" ON "upload_assets"("quoteRequestId");
CREATE INDEX IF NOT EXISTS "upload_assets_purpose_idx" ON "upload_assets"("purpose");
CREATE INDEX IF NOT EXISTS "upload_assets_provider_idx" ON "upload_assets"("provider");
-- Foreign keys
ALTER TABLE "vendor_service_areas" ADD CONSTRAINT "vendor_service_areas_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification_read_states" ADD CONSTRAINT "notification_read_states_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_read_states" ADD CONSTRAINT "notification_read_states_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notification_read_states" ADD CONSTRAINT "notification_read_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notification_read_states" ADD CONSTRAINT "notification_read_states_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "upload_assets" ADD CONSTRAINT "upload_assets_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "upload_assets" ADD CONSTRAINT "upload_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "upload_assets" ADD CONSTRAINT "upload_assets_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "upload_assets" ADD CONSTRAINT "upload_assets_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "quote_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "vendor_documents" ADD CONSTRAINT "vendor_documents_uploadAssetId_fkey" FOREIGN KEY ("uploadAssetId") REFERENCES "upload_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
