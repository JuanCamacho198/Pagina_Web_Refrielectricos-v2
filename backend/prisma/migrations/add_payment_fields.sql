-- Migration: Add ePayco payment fields to Order model
-- Run this migration with: pnpm prisma migrate dev --name add_payment_fields

-- Add payment-related columns to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentReference" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentApprovalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentResponseCode" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentResponseMessage" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentTransactionId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "isTestPayment" BOOLEAN NOT NULL DEFAULT false;
