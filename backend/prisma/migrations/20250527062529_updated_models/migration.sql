/*
  Warnings:

  - You are about to drop the column `barterType` on the `SwapProposal` table. All the data in the column will be lost.
  - You are about to drop the `InPersonBarter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnlineBarter` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('CANCELLED', 'SCHEDULED', 'RESHEDULED');

-- DropForeignKey
ALTER TABLE "InPersonBarter" DROP CONSTRAINT "InPersonBarter_swapProposalId_fkey";

-- DropForeignKey
ALTER TABLE "OnlineBarter" DROP CONSTRAINT "OnlineBarter_swapProposalId_fkey";

-- AlterTable
ALTER TABLE "SwapProposal" DROP COLUMN "barterType";

-- DropTable
DROP TABLE "InPersonBarter";

-- DropTable
DROP TABLE "OnlineBarter";

-- DropEnum
DROP TYPE "BarterType";

-- DropEnum
DROP TYPE "ShippingStatus";

-- CreateTable
CREATE TABLE "SwapInperson" (
    "id" SERIAL NOT NULL,
    "swapProposalId" INTEGER NOT NULL,
    "meetingLocation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "meetingStatus" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,

    CONSTRAINT "SwapInperson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwapInperson_swapProposalId_key" ON "SwapInperson"("swapProposalId");

-- AddForeignKey
ALTER TABLE "SwapInperson" ADD CONSTRAINT "SwapInperson_swapProposalId_fkey" FOREIGN KEY ("swapProposalId") REFERENCES "SwapProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
