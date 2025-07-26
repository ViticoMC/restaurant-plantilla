-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plato" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ingredientes" TEXT[],
    "foto" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Plato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_key" ON "Admin"("admin");

-- AddForeignKey
ALTER TABLE "Plato" ADD CONSTRAINT "Plato_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
