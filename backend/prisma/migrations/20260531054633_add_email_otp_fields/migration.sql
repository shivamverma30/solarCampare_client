-- AlterTable
ALTER TABLE "email_verification_tokens" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpHash" TEXT,
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "resendCount" INTEGER NOT NULL DEFAULT 0;
