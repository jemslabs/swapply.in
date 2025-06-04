/*
  Warnings:

  - You are about to drop the column `views` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `profileVisits` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "views";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileVisits";

-- CreateTable
CREATE TABLE "ProPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProPlan_userId_key" ON "ProPlan"("userId");

-- CreateIndex
CREATE INDEX "ProPlan_userId_idx" ON "ProPlan"("userId");

-- AddForeignKey
ALTER TABLE "ProPlan" ADD CONSTRAINT "ProPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
