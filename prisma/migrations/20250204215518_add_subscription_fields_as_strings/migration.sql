/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionTier` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "customerId",
DROP COLUMN "subscriptionTier",
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'FREE';

-- DropEnum
DROP TYPE "SubscriptionTier";
