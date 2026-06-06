-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('MDX', 'MARKDOWN');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "contentFormat" "ContentFormat" NOT NULL DEFAULT 'MDX';
ALTER TABLE "BlogPost" ADD COLUMN "readingTimeMinutes" INTEGER NOT NULL DEFAULT 1;
