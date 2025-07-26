/*
  Warnings:

  - You are about to drop the column `adminId` on the `Categoria` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_adminId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "adminId";

-- CreateTable
CREATE TABLE "_PlatoCategorias" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlatoCategorias_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlatoCategorias_B_index" ON "_PlatoCategorias"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- AddForeignKey
ALTER TABLE "_PlatoCategorias" ADD CONSTRAINT "_PlatoCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatoCategorias" ADD CONSTRAINT "_PlatoCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "Plato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
