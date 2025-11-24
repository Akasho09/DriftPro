/*
  Warnings:

  - You are about to drop the `P2PTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "P2PTransaction" DROP CONSTRAINT "P2PTransaction_fromNum_fkey";

-- DropForeignKey
ALTER TABLE "P2PTransaction" DROP CONSTRAINT "P2PTransaction_toNum_fkey";

-- DropTable
DROP TABLE "P2PTransaction";

-- CreateTable
CREATE TABLE "p2ptransactions" (
    "id" SERIAL NOT NULL,
    "fromNum" TEXT NOT NULL,
    "toNum" TEXT NOT NULL,
    "tTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "p2ptransactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_fromNum_fkey" FOREIGN KEY ("fromNum") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_toNum_fkey" FOREIGN KEY ("toNum") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
