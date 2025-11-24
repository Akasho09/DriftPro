/*
  Warnings:

  - Made the column `fromNum` on table `Requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toNum` on table `Requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "fromMsg" TEXT,
ADD COLUMN     "toMsg" TEXT,
ALTER COLUMN "fromNum" SET NOT NULL,
ALTER COLUMN "toNum" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Image" TEXT;
