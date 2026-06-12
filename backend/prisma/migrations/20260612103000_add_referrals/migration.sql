-- Create referral-related enums
CREATE TYPE "ReferralSignupStatus" AS ENUM (
  'DONE'
);

CREATE TYPE "ReferralInstallationStatus" AS ENUM (
  'IN_PROGRESS',
  'COMPLETED'
);

-- Create referrals table
CREATE TABLE "referrals" (
  "id" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredUserId" TEXT NOT NULL,
  "signupStatus" "ReferralSignupStatus" NOT NULL DEFAULT 'DONE',
  "installationStatus" "ReferralInstallationStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "referrals_referredUserId_key" ON "referrals"("referredUserId");
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");
CREATE INDEX "referrals_referredUserId_idx" ON "referrals"("referredUserId");

ALTER TABLE "referrals"
  ADD CONSTRAINT "referrals_referrerId_fkey"
  FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "referrals"
  ADD CONSTRAINT "referrals_referredUserId_fkey"
  FOREIGN KEY ("referredUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
