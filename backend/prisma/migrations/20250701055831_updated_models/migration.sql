/*
  Warnings:

  - The values [CIRCLE] on the enum `NotificationCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `company` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `currencyType` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `currentPrice` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `itemAge` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `BoostedItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Circle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CircleItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CircleMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SwapInperson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SwapProposal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lookingFor` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('ELECTRONICS', 'CLOTHING', 'BOOKS', 'FURNITURE', 'TOYS', 'FOOTWEAR', 'BEAUTY', 'STATIONERY', 'OTHER');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('TECH', 'MUSIC', 'ART', 'TUTORING', 'COOKING', 'FITNESS', 'DIY', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationCategory_new" AS ENUM ('SWAP', 'MEETING');
ALTER TABLE "Notification" ALTER COLUMN "category" TYPE "NotificationCategory_new" USING ("category"::text::"NotificationCategory_new");
ALTER TYPE "NotificationCategory" RENAME TO "NotificationCategory_old";
ALTER TYPE "NotificationCategory_new" RENAME TO "NotificationCategory";
DROP TYPE "NotificationCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "BoostedItem" DROP CONSTRAINT "BoostedItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "BoostedItem" DROP CONSTRAINT "BoostedItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "CircleItem" DROP CONSTRAINT "CircleItem_circleId_fkey";

-- DropForeignKey
ALTER TABLE "CircleItem" DROP CONSTRAINT "CircleItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "CircleItem" DROP CONSTRAINT "CircleItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_circleId_fkey";

-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProPlan" DROP CONSTRAINT "ProPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "SwapInperson" DROP CONSTRAINT "SwapInperson_swapProposalId_fkey";

-- DropForeignKey
ALTER TABLE "SwapProposal" DROP CONSTRAINT "SwapProposal_proposedItemId_fkey";

-- DropForeignKey
ALTER TABLE "SwapProposal" DROP CONSTRAINT "SwapProposal_proposerId_fkey";

-- DropForeignKey
ALTER TABLE "SwapProposal" DROP CONSTRAINT "SwapProposal_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "SwapProposal" DROP CONSTRAINT "SwapProposal_receiverItemId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "company",
DROP COLUMN "currencyType",
DROP COLUMN "currentPrice",
DROP COLUMN "description",
DROP COLUMN "itemAge",
DROP COLUMN "originalPrice",
DROP COLUMN "rating",
DROP COLUMN "score",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "lookingFor" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 1,
DROP COLUMN "category",
ADD COLUMN     "category" "ItemCategory" NOT NULL;

-- DropTable
DROP TABLE "BoostedItem";

-- DropTable
DROP TABLE "Circle";

-- DropTable
DROP TABLE "CircleItem";

-- DropTable
DROP TABLE "CircleMember";

-- DropTable
DROP TABLE "ProPlan";

-- DropTable
DROP TABLE "SwapInperson";

-- DropTable
DROP TABLE "SwapProposal";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "CurrencyType";

-- DropEnum
DROP TYPE "MeetingStatus";

-- DropEnum
DROP TYPE "MemberRole";

-- DropEnum
DROP TYPE "SwapStatus";

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL,
    "lookingFor" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
