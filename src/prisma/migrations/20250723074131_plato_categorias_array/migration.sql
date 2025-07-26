/*
  Warnings:

  - You are about to drop the `_PlatoCategorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlatoCategorias" DROP CONSTRAINT "_PlatoCategorias_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlatoCategorias" DROP CONSTRAINT "_PlatoCategorias_B_fkey";

-- AlterTable
ALTER TABLE "Plato" ADD COLUMN     "categoriaIds" TEXT[];

-- DropTable
DROP TABLE "_PlatoCategorias";
