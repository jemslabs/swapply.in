-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "Circle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "circleId" INTEGER NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "CircleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleItem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "circleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CircleItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleItem" ADD CONSTRAINT "CircleItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
