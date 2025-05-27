/*
  Warnings:

  - You are about to drop the column `meetingLocation` on the `SwapProposal` table. All the data in the column will be lost.
  - You are about to drop the column `proposerShippingAddress` on the `SwapProposal` table. All the data in the column will be lost.
  - You are about to drop the column `receiverShippingAddress` on the `SwapProposal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('NOT_SHIPPED', 'SHIPPED', 'ON_THE_WAY', 'DELIVERED');

-- AlterTable
ALTER TABLE "SwapProposal" DROP COLUMN "meetingLocation",
DROP COLUMN "proposerShippingAddress",
DROP COLUMN "receiverShippingAddress";

-- CreateTable
CREATE TABLE "OnlineBarter" (
    "id" SERIAL NOT NULL,
    "swapProposalId" INTEGER NOT NULL,
    "proposerShippingAddress" TEXT NOT NULL,
    "receiverShippingAddress" TEXT NOT NULL,
    "proposerShippingStatus" "ShippingStatus" NOT NULL DEFAULT 'NOT_SHIPPED',
    "receiverShippingStatus" "ShippingStatus" NOT NULL DEFAULT 'NOT_SHIPPED',
    "proposerItemTrackingLink" TEXT,
    "receiverItemTrackingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineBarter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InPersonBarter" (
    "id" SERIAL NOT NULL,
    "swapProposalId" INTEGER NOT NULL,
    "meetingLocation" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InPersonBarter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnlineBarter_swapProposalId_key" ON "OnlineBarter"("swapProposalId");

-- CreateIndex
CREATE UNIQUE INDEX "InPersonBarter_swapProposalId_key" ON "InPersonBarter"("swapProposalId");

-- AddForeignKey
ALTER TABLE "OnlineBarter" ADD CONSTRAINT "OnlineBarter_swapProposalId_fkey" FOREIGN KEY ("swapProposalId") REFERENCES "SwapProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InPersonBarter" ADD CONSTRAINT "InPersonBarter_swapProposalId_fkey" FOREIGN KEY ("swapProposalId") REFERENCES "SwapProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
