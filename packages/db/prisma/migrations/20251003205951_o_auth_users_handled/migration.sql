/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'Google', 'Github');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider" NOT NULL,
ADD COLUMN     "providerAccountId" TEXT,
ALTER COLUMN "hashedPassword" DROP NOT NULL;
