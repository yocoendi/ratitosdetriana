/*
  Warnings:

  - A unique constraint covering the columns `[cif]` on the table `Facturas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurantId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `restaurantId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Facturas_cif_key` ON `Facturas`(`cif`);

-- CreateIndex
CREATE UNIQUE INDEX `Restaurant_restaurantId_key` ON `Restaurant`(`restaurantId`);
