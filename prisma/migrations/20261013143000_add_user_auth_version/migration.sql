-- Incremented whenever credentials or privileges change so existing JWTs can be invalidated.
ALTER TABLE "users"
ADD COLUMN "authVersion" INTEGER NOT NULL DEFAULT 0;
