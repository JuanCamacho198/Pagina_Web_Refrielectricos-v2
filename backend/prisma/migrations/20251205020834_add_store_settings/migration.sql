-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'store-settings',
    "storeName" TEXT NOT NULL DEFAULT 'Refrielectricos G&E',
    "supportEmail" TEXT NOT NULL DEFAULT 'contacto@refrielectricos.com',
    "phoneNumber" TEXT NOT NULL DEFAULT '+57 300 123 4567',
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "freeShippingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "freeShippingBannerText" TEXT NOT NULL DEFAULT 'Envío gratis en Curumaní desde $100,000',
    "freeShippingEmoji" TEXT NOT NULL DEFAULT '🚚',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);
