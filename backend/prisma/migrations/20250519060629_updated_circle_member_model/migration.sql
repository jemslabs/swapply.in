/*
  Warnings:

  - A unique constraint covering the columns `[userId,circleId]` on the table `CircleMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CircleMember_userId_circleId_key" ON "CircleMember"("userId", "circleId");
