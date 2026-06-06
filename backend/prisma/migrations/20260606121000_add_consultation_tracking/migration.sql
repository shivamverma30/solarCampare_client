-- Create consultation tracker status enum
CREATE TYPE "ConsultationTrackingStatus" AS ENUM (
  'CONSULTATION_REQUESTED',
  'REQUEST_REVIEWED',
  'VENDOR_ASSIGNED',
  'APPOINTMENT_SCHEDULED',
  'SITE_VISIT_COMPLETED',
  'PROPOSAL_SHARED',
  'NEGOTIATION',
  'PROJECT_CONFIRMED',
  'INSTALLATION_IN_PROGRESS',
  'INSTALLATION_COMPLETED'
);

-- Create tracker event table for consultation lifecycle updates
CREATE TABLE "consultation_tracking" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "vendorId" TEXT NOT NULL,
  "consultationId" TEXT NOT NULL,
  "status" "ConsultationTrackingStatus" NOT NULL,
  "notes" TEXT,
  "updatedBy" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "consultation_tracking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "consultation_tracking_userId_idx" ON "consultation_tracking"("userId");
CREATE INDEX "consultation_tracking_vendorId_idx" ON "consultation_tracking"("vendorId");
CREATE INDEX "consultation_tracking_consultationId_idx" ON "consultation_tracking"("consultationId");
CREATE INDEX "consultation_tracking_status_idx" ON "consultation_tracking"("status");

ALTER TABLE "consultation_tracking"
  ADD CONSTRAINT "consultation_tracking_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "consultation_tracking"
  ADD CONSTRAINT "consultation_tracking_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "consultation_tracking"
  ADD CONSTRAINT "consultation_tracking_consultationId_fkey"
  FOREIGN KEY ("consultationId") REFERENCES "vendor_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
