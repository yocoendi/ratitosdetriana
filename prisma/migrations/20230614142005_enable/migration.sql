/*
  Warnings:

  - Made the column `date` on table `facturas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `facturas` MODIFY `date` DATETIME(3) NOT NULL;
