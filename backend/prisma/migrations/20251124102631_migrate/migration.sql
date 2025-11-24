/*
  Warnings:

  - You are about to alter the column `structure` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `privacyType` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Room` MODIFY `structure` VARCHAR(191) NOT NULL,
    MODIFY `privacyType` VARCHAR(191) NOT NULL;
