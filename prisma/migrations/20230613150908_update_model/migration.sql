-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_cif_fkey`;

-- AlterTable
ALTER TABLE `facturas` MODIFY `cif` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_cif_fkey` FOREIGN KEY (`cif`) REFERENCES `Proveedores`(`cif`) ON DELETE SET NULL ON UPDATE CASCADE;
