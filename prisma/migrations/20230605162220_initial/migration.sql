/*
  Warnings:

  - You are about to drop the column `firstName` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `cliente` table. All the data in the column will be lost.
  - Added the required column `name` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `surname` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `state` VARCHAR(191) NULL,
    MODIFY `zipCode` VARCHAR(191) NULL;
