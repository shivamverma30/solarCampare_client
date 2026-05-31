-- Safe additive migration for multi-role profile/location fields and vendor-owned products.
ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pincode" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "pincode" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "vendorId" TEXT;
ALTER TABLE "products" ALTER COLUMN "adminId" DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_vendorId_fkey'
  ) THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "products_vendorId_fkey"
      FOREIGN KEY ("vendorId") REFERENCES "vendors"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS "products_vendorId_idx" ON "products"("vendorId");
CREATE INDEX IF NOT EXISTS "products_adminId_idx" ON "products"("adminId");
CREATE INDEX IF NOT EXISTS "users_pincode_idx" ON "users"("pincode");
CREATE INDEX IF NOT EXISTS "vendors_pincode_idx" ON "vendors"("pincode");
