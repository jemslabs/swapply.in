-- CreateEnum
CREATE TYPE "ProposerType" AS ENUM ('ITEM', 'SKILL');

-- CreateEnum
CREATE TYPE "ReceiverType" AS ENUM ('ITEM', 'SKILL');

-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SwapRequest" (
    "id" SERIAL NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "proposerItemId" INTEGER,
    "proposerSkillId" INTEGER,
    "proposerType" "ProposerType" NOT NULL,
    "receiverItemId" INTEGER,
    "receiverSkillId" INTEGER,
    "receiverType" "ReceiverType" NOT NULL,
    "status" "SwapStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SwapRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_proposerItemId_fkey" FOREIGN KEY ("proposerItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_proposerSkillId_fkey" FOREIGN KEY ("proposerSkillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_receiverItemId_fkey" FOREIGN KEY ("receiverItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_receiverSkillId_fkey" FOREIGN KEY ("receiverSkillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
