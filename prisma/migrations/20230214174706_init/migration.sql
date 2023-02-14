-- CreateTable
CREATE TABLE `Users` (
    `Userid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `surname` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `pass` VARCHAR(255) NULL,
    `user` VARCHAR(255) NULL,

    PRIMARY KEY (`Userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
