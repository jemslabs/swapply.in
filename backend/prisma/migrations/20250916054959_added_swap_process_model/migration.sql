/*
  Warnings:

  - The values [MEETING] on the enum `NotificationCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `SwapMeeting` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationCategory_new" AS ENUM ('SWAP', 'BADGE');
ALTER TABLE "Notification" ALTER COLUMN "category" TYPE "NotificationCategory_new" USING ("category"::text::"NotificationCategory_new");
ALTER TYPE "NotificationCategory" RENAME TO "NotificationCategory_old";
ALTER TYPE "NotificationCategory_new" RENAME TO "NotificationCategory";
DROP TYPE "NotificationCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "SwapMeeting" DROP CONSTRAINT "SwapMeeting_swapId_fkey";

-- DropTable
DROP TABLE "SwapMeeting";

-- DropEnum
DROP TYPE "MeetingStatus";

-- DropEnum
DROP TYPE "MeetingType";

-- CreateTable
CREATE TABLE "SwapProcess" (
    "id" SERIAL NOT NULL,
    "swapRequestId" INTEGER NOT NULL,
    "proposerPhoneNumber" TEXT,
    "receiverPhoneNumber" TEXT,
    "proposerSwapCode" TEXT NOT NULL,
    "receiverSwapCode" TEXT NOT NULL,
    "isProposerCodeVerified" BOOLEAN NOT NULL DEFAULT false,
    "isReceiverCodeVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwapProcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwapProcess_swapRequestId_key" ON "SwapProcess"("swapRequestId");

-- AddForeignKey
ALTER TABLE "SwapProcess" ADD CONSTRAINT "SwapProcess_swapRequestId_fkey" FOREIGN KEY ("swapRequestId") REFERENCES "SwapRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
