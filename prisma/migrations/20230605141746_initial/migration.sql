/*
  Warnings:

  - You are about to drop the column `invoiceNumber` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `facturas` table. All the data in the column will be lost.
  - Added the required column `facturaNumber` to the `Facturas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proveedorId` to the `Facturas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_supplierId_fkey`;

-- AlterTable
ALTER TABLE `facturas` DROP COLUMN `invoiceNumber`,
    DROP COLUMN `supplierId`,
    ADD COLUMN `facturaNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `proveedorId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `restaurantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
