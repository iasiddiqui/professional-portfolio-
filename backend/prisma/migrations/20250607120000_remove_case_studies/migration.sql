-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_caseStudyId_fkey";

-- DropIndex
DROP INDEX "Media_caseStudyId_idx";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "caseStudyId";

-- DropTable
DROP TABLE "CaseStudy";
