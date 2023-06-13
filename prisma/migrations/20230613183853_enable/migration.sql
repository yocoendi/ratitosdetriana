/*
  Warnings:

  - Added the required column `proveedorId` to the `Facturas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `facturas` ADD COLUMN `proveedorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedores`(`proveedorId`) ON DELETE RESTRICT ON UPDATE CASCADE;
