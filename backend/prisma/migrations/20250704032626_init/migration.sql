/*
  Warnings:

  - You are about to drop the column `location` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `lookingFor` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('INR', 'USD');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONICS', 'CLOTHING', 'BOOKS', 'FURNITURE', 'TOYS', 'FOOTWEAR', 'BEAUTY', 'STATIONERY', 'OTHER');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('CANCELLED', 'SCHEDULED', 'RESHEDULED');

-- AlterEnum
ALTER TYPE "NotificationCategory" ADD VALUE 'CIRCLE';

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "location",
DROP COLUMN "lookingFor",
DROP COLUMN "price",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "currencyType" "CurrencyType" NOT NULL DEFAULT 'INR',
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "itemAge" INTEGER,
ADD COLUMN     "originalPrice" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "score" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- DropTable
DROP TABLE "Skill";

-- DropEnum
DROP TYPE "ItemCategory";

-- DropEnum
DROP TYPE "SkillCategory";

-- CreateTable
CREATE TABLE "BoostedItem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "boostedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoostedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwapProposal" (
    "id" SERIAL NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "proposedItemId" INTEGER NOT NULL,
    "receiverItemId" INTEGER NOT NULL,
    "message" TEXT,
    "status" "SwapStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwapProposal_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Circle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "circleId" INTEGER NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "CircleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleItem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "circleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoostedItem_itemId_key" ON "BoostedItem"("itemId");

-- CreateIndex
CREATE INDEX "BoostedItem_userId_idx" ON "BoostedItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SwapInperson_swapProposalId_key" ON "SwapInperson"("swapProposalId");

-- CreateIndex
CREATE UNIQUE INDEX "CircleMember_userId_circleId_key" ON "CircleMember"("userId", "circleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProPlan_userId_key" ON "ProPlan"("userId");

-- CreateIndex
CREATE INDEX "ProPlan_userId_idx" ON "ProPlan"("userId");

-- AddForeignKey
ALTER TABLE "BoostedItem" ADD CONSTRAINT "BoostedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostedItem" ADD CONSTRAINT "BoostedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_proposedItemId_fkey" FOREIGN KEY ("proposedItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_receiverItemId_fkey" FOREIGN KEY ("receiverItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapInperson" ADD CONSTRAINT "SwapInperson_swapProposalId_fkey" FOREIGN KEY ("swapProposalId") REFERENCES "SwapProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProPlan" ADD CONSTRAINT "ProPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
