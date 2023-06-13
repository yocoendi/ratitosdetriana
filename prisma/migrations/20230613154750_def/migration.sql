/*
  Warnings:

  - You are about to drop the column `proveedorId` on the `facturas` table. All the data in the column will be lost.
  - Added the required column `cif` to the `Facturas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_proveedorId_fkey`;

-- AlterTable
ALTER TABLE `facturas` DROP COLUMN `proveedorId`,
    ADD COLUMN `cif` VARCHAR(191) NOT NULL;
