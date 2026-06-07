-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('CONTACT', 'HIRE_ME', 'CONSULTATION');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "timeline" TEXT,
ADD COLUMN     "preferredTime" TEXT,
ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'CONTACT',
ADD COLUMN     "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confirmationEmailSent" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");
