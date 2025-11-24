/*
  Warnings:

  - Added the required column `amount` to the `p2ptransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tTime` to the `p2ptransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "p2ptransactions" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "tTime" TIMESTAMP(3) NOT NULL;
