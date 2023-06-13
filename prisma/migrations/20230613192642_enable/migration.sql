/*
  Warnings:

  - You are about to drop the column `proveedorId` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `proveedores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cif]` on the table `Proveedores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_proveedorId_fkey`;

-- DropIndex
DROP INDEX `Proveedores_proveedorId_key` ON `proveedores`;

-- AlterTable
ALTER TABLE `facturas` DROP COLUMN `proveedorId`;

-- AlterTable
ALTER TABLE `proveedores` DROP COLUMN `proveedorId`;

-- CreateIndex
CREATE UNIQUE INDEX `Proveedores_cif_key` ON `Proveedores`(`cif`);

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_cif_fkey` FOREIGN KEY (`cif`) REFERENCES `Proveedores`(`cif`) ON DELETE RESTRICT ON UPDATE CASCADE;
