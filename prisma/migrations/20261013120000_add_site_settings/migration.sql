CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "storeName" TEXT NOT NULL DEFAULT 'HerStyle',
    "tagline" TEXT NOT NULL DEFAULT 'TRENDY • ELEGANT • YOU',
    "description" TEXT NOT NULL DEFAULT 'Discover fashionable women''s clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.',
    "storeEmail" TEXT NOT NULL DEFAULT 'hello@herstyle.com',
    "storePhone" TEXT NOT NULL DEFAULT '+233 20 123 4567',
    "storeAddress" TEXT NOT NULL DEFAULT 'Accra, Ghana',
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "heroTitle" TEXT NOT NULL DEFAULT 'Style for Every Occasion',
    "heroDescription" TEXT NOT NULL DEFAULT 'Discover fashionable women''s clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.',
    "heroImage" TEXT NOT NULL DEFAULT '/images/hero-1.jpg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
