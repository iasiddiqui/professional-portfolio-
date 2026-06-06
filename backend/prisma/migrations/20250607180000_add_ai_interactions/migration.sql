-- CreateEnum
CREATE TYPE "AiFeatureType" AS ENUM ('ASK_ISHAN', 'PROJECT_ESTIMATOR');

-- CreateTable
CREATE TABLE "AiInteraction" (
    "id" TEXT NOT NULL,
    "feature" "AiFeatureType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "metadata" JSONB,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "model" TEXT,
    "tokensUsed" INTEGER,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiInteraction_feature_idx" ON "AiInteraction"("feature");
CREATE INDEX "AiInteraction_sessionId_idx" ON "AiInteraction"("sessionId");
CREATE INDEX "AiInteraction_createdAt_idx" ON "AiInteraction"("createdAt");
CREATE INDEX "AiInteraction_ipAddress_idx" ON "AiInteraction"("ipAddress");
