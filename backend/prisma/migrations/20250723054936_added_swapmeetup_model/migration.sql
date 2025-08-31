-- CreateEnum
CREATE TYPE "SwapMeetupStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'RESHEDULED');

-- AlterEnum
ALTER TYPE "SwapStatus" ADD VALUE 'COMPLETED';

-- CreateTable
CREATE TABLE "SwapMeetup" (
    "id" SERIAL NOT NULL,
    "swapId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "SwapMeetupStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SwapMeetup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwapMeetup_swapId_key" ON "SwapMeetup"("swapId");

-- AddForeignKey
ALTER TABLE "SwapMeetup" ADD CONSTRAINT "SwapMeetup_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "SwapRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
