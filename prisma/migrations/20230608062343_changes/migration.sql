/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dni]` on the table `Empleados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cif]` on the table `Proveedores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `Empleados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cif` to the `Proveedores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `dni` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `empleados` ADD COLUMN `dni` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `proveedores` ADD COLUMN `cif` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_dni_key` ON `Admin`(`dni`);

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_email_key` ON `Cliente`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Empleados_dni_key` ON `Empleados`(`dni`);

-- CreateIndex
CREATE UNIQUE INDEX `Proveedores_cif_key` ON `Proveedores`(`cif`);
