-- AlterTable
ALTER TABLE "Media" ADD COLUMN "isThumbnail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Media_isThumbnail_idx" ON "Media"("isThumbnail");
