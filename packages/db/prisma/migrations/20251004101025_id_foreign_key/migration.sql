/*
  Warnings:

  - You are about to drop the column `fromNum` on the `p2ptransactions` table. All the data in the column will be lost.
  - You are about to drop the column `toNum` on the `p2ptransactions` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `p2ptransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `p2ptransactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "p2ptransactions" DROP CONSTRAINT "p2ptransactions_fromNum_fkey";

-- DropForeignKey
ALTER TABLE "p2ptransactions" DROP CONSTRAINT "p2ptransactions_toNum_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mobile" DROP NOT NULL;

-- AlterTable
ALTER TABLE "p2ptransactions" DROP COLUMN "fromNum",
DROP COLUMN "toNum",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
