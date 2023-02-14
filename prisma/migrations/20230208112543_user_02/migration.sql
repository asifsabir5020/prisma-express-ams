/*
  Warnings:

  - You are about to drop the column `activeStatue` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeStatue",
ADD COLUMN     "activeStatus" BOOLEAN NOT NULL DEFAULT false;
