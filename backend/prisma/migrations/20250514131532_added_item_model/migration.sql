-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('INR', 'USD');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONICS', 'CLOTHING', 'BOOKS', 'FURNITURE', 'TOYS', 'FOOTWEAR', 'BEAUTY', 'STATIONERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'USED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "BarterType" AS ENUM ('INPERSON', 'ONLINE');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "originalPrice" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "currencyType" "CurrencyType" NOT NULL DEFAULT 'INR',
    "company" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "condition" "ItemCondition" NOT NULL,
    "barterType" "BarterType" NOT NULL DEFAULT 'ONLINE',
    "location" TEXT,
    "billImage" TEXT,
    "hasBill" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
