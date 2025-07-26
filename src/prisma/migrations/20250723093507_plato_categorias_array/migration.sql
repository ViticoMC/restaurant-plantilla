/*
  Warnings:

  - You are about to drop the column `adminId` on the `Plato` table. All the data in the column will be lost.
  - Added the required column `key_word` to the `Plato` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plato" DROP CONSTRAINT "Plato_adminId_fkey";

-- AlterTable
ALTER TABLE "Plato" DROP COLUMN "adminId",
ADD COLUMN     "key_word" TEXT NOT NULL;
