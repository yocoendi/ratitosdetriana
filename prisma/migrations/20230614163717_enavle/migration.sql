/*
  Warnings:

  - You are about to drop the column `state` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `state`;

-- AlterTable
ALTER TABLE `proveedores` DROP COLUMN `state`;

-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `state`;
