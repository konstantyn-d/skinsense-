-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `skinType` ENUM('DRY', 'OILY', 'COMBINATION', 'NORMAL', 'SENSITIVE') NULL,
    `skinHealthProblems` VARCHAR(191) NULL,
    `otherHealthProblems` VARCHAR(191) NULL,
    `recommendationsNote` VARCHAR(191) NULL,

    UNIQUE INDEX `UserProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkinScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagePath` VARCHAR(191) NOT NULL,
    `rawResultJson` VARCHAR(191) NULL,
    `scoreAcne` DOUBLE NULL,
    `scoreWrinkles` DOUBLE NULL,
    `scoreRedness` DOUBLE NULL,
    `scoreDarkSpots` DOUBLE NULL,
    `scorePores` DOUBLE NULL,
    `summary` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecommendationItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `linkUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScanRecommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` INTEGER NOT NULL,
    `recommendationId` INTEGER NOT NULL,

    UNIQUE INDEX `ScanRecommendation_scanId_recommendationId_key`(`scanId`, `recommendationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareRoutine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoutineItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routineId` INTEGER NOT NULL,
    `recommendationId` INTEGER NOT NULL,
    `stepOrder` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkinScan` ADD CONSTRAINT `SkinScan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScanRecommendation` ADD CONSTRAINT `ScanRecommendation_scanId_fkey` FOREIGN KEY (`scanId`) REFERENCES `SkinScan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScanRecommendation` ADD CONSTRAINT `ScanRecommendation_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `RecommendationItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareRoutine` ADD CONSTRAINT `CareRoutine_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineItem` ADD CONSTRAINT `RoutineItem_routineId_fkey` FOREIGN KEY (`routineId`) REFERENCES `CareRoutine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineItem` ADD CONSTRAINT `RoutineItem_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `RecommendationItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
