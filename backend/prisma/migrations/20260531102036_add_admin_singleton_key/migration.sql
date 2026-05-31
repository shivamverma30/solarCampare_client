/*
  Warnings:

  - A unique constraint covering the columns `[singletonKey]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "singletonKey" TEXT NOT NULL DEFAULT 'SOLE_ADMIN';

-- CreateIndex
CREATE UNIQUE INDEX "admins_singletonKey_key" ON "admins"("singletonKey");
