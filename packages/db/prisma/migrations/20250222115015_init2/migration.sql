/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
ADD COLUMN     "mobile" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_key" ON "user"("mobile");
