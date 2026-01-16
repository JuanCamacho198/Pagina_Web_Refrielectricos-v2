-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" 
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "googleId" TEXT,
  ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN "avatar" TEXT,
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "emailVerifyToken" TEXT,
  ADD COLUMN "emailVerifyExpires" TIMESTAMP(3),
  ADD COLUMN "resetPasswordToken" TEXT,
  ADD COLUMN "resetPasswordExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifyToken_key" ON "User"("emailVerifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_provider_idx" ON "User"("provider");
