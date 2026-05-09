-- CreateTable
CREATE TABLE "RegistrationTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "regNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "qrData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationTicket_ticketId_key" ON "RegistrationTicket"("ticketId");
