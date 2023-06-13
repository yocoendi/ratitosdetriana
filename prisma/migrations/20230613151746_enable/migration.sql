/*
  Warnings:

  - You are about to drop the column `cif` on the `facturas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[proveedorId]` on the table `Proveedores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `proveedorId` to the `Proveedores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_cif_fkey`;

-- DropIndex
DROP INDEX `Proveedores_cif_key` ON `proveedores`;

-- AlterTable
ALTER TABLE `facturas` DROP COLUMN `cif`,
    ADD COLUMN `proveedorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `proveedores` ADD COLUMN `proveedorId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Proveedores_proveedorId_key` ON `Proveedores`(`proveedorId`);

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedores`(`proveedorId`) ON DELETE SET NULL ON UPDATE CASCADE;
