/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'COORDINATOR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "activeStatus" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Program_title_key" ON "Program"("title");
