-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isSwapped" BOOLEAN NOT NULL DEFAULT false;

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

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_proposedItemId_fkey" FOREIGN KEY ("proposedItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapProposal" ADD CONSTRAINT "SwapProposal_receiverItemId_fkey" FOREIGN KEY ("receiverItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
