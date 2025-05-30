-- CreateTable
CREATE TABLE "BoostedItem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "boostedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoostedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoostedItem_itemId_key" ON "BoostedItem"("itemId");

-- CreateIndex
CREATE INDEX "BoostedItem_userId_idx" ON "BoostedItem"("userId");

-- AddForeignKey
ALTER TABLE "BoostedItem" ADD CONSTRAINT "BoostedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostedItem" ADD CONSTRAINT "BoostedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
