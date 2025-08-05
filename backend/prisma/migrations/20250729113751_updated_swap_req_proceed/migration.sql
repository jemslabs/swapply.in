/*
  Warnings:

  - You are about to drop the `SwapMeetup` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('ONLINE', 'INPERSON');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('CONFIRMED', 'PENDING');

-- DropForeignKey
ALTER TABLE "SwapMeetup" DROP CONSTRAINT "SwapMeetup_swapId_fkey";

-- DropTable
DROP TABLE "SwapMeetup";

-- DropEnum
DROP TYPE "SwapMeetupStatus";

-- CreateTable
CREATE TABLE "SwapMeeting" (
    "id" SERIAL NOT NULL,
    "swapId" INTEGER NOT NULL,
    "type" "MeetingType" NOT NULL,
    "location" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "MeetingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwapMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwapMeeting_swapId_key" ON "SwapMeeting"("swapId");

-- AddForeignKey
ALTER TABLE "SwapMeeting" ADD CONSTRAINT "SwapMeeting_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "SwapRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
