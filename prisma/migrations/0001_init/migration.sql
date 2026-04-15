-- CreateTable
CREATE TABLE `Patient` (
  `id` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `phoneNumber` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `Patient_phoneNumber_key`(`phoneNumber`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecurringSchedule` (
  `id` VARCHAR(191) NOT NULL,
  `patientId` VARCHAR(191) NOT NULL,
  `weekday` INTEGER NOT NULL,
  `startTime` VARCHAR(191) NOT NULL,
  `durationMinutes` INTEGER NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `RecurringSchedule_patientId_key`(`patientId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
  `id` VARCHAR(191) NOT NULL,
  `patientId` VARCHAR(191) NOT NULL,
  `recurringScheduleId` VARCHAR(191) NULL,
  `originalAppointmentId` VARCHAR(191) NULL,
  `startsAt` DATETIME(3) NOT NULL,
  `endsAt` DATETIME(3) NOT NULL,
  `status` ENUM('SCHEDULED', 'CONFIRMATION_PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULE_REQUESTED', 'RESCHEDULED') NOT NULL DEFAULT 'SCHEDULED',
  `source` ENUM('RECURRING', 'RESCHEDULE') NOT NULL DEFAULT 'RECURRING',
  `confirmationSentAt` DATETIME(3) NULL,
  `confirmedAt` DATETIME(3) NULL,
  `cancellationReason` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `Appointment_startsAt_endsAt_idx`(`startsAt`, `endsAt`),
  INDEX `Appointment_patientId_startsAt_idx`(`patientId`, `startsAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PsychologistAvailability` (
  `id` VARCHAR(191) NOT NULL,
  `weekday` INTEGER NOT NULL,
  `startTime` VARCHAR(191) NOT NULL,
  `endTime` VARCHAR(191) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `PsychologistAvailability_weekday_active_idx`(`weekday`, `active`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailabilityBlock` (
  `id` VARCHAR(191) NOT NULL,
  `startAt` DATETIME(3) NOT NULL,
  `endAt` DATETIME(3) NOT NULL,
  `reason` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `AvailabilityBlock_startAt_endAt_idx`(`startAt`, `endAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessageInteraction` (
  `id` VARCHAR(191) NOT NULL,
  `appointmentId` VARCHAR(191) NOT NULL,
  `kind` ENUM('CONFIRMATION', 'RESCHEDULE_OPTIONS') NOT NULL,
  `direction` ENUM('OUTBOUND', 'INBOUND') NOT NULL,
  `status` ENUM('SENT', 'RECEIVED', 'PROCESSED') NOT NULL,
  `provider` VARCHAR(191) NOT NULL DEFAULT 'mock',
  `channel` VARCHAR(191) NOT NULL DEFAULT 'whatsapp',
  `content` TEXT NOT NULL,
  `responseCode` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `MessageInteraction_appointmentId_createdAt_idx`(`appointmentId`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecurringSchedule` ADD CONSTRAINT `RecurringSchedule_patientId_fkey`
  FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey`
  FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_recurringScheduleId_fkey`
  FOREIGN KEY (`recurringScheduleId`) REFERENCES `RecurringSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_originalAppointmentId_fkey`
  FOREIGN KEY (`originalAppointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageInteraction` ADD CONSTRAINT `MessageInteraction_appointmentId_fkey`
  FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

