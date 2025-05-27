/*
  Warnings:

  - You are about to drop the column `barterType` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "barterType";

-- AlterTable
ALTER TABLE "SwapProposal" ADD COLUMN     "barterType" "BarterType" NOT NULL DEFAULT 'ONLINE';
