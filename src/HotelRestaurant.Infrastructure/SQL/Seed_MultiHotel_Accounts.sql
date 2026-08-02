-- Seed Multi-Hotel Sample Accounts
-- Role expectations:
--   SuperAdmin -> sees all hotels (cross-hotel visibility)
--   Admin      -> can manage the company / all hotels
--   User       -> hotel-scoped account

-- 1) Ensure the sample hotels exist and can be safely re-seeded
INSERT INTO public."Hotels" ("Id", "Name", "Address", "City", "Country", "Phone", "Email", "Rating", "CreatedAt", "UpdatedAt", "IsDeleted")
VALUES
  (1, 'Azure Palm Hotel', '1 Palm Street', 'Mumbai', 'India', '9999990001', 'palms@smartluth.com', 5.0, NOW(), NOW(), false),
  (2, 'Blue Lagoon Hotel', '4 Lagoon Avenue', 'Goa', 'India', '9999990002', 'lagoon@smartluth.com', 4.5, NOW(), NOW(), false)
ON CONFLICT ("Id") DO UPDATE
SET
  "Name" = EXCLUDED."Name",
  "Address" = EXCLUDED."Address",
  "City" = EXCLUDED."City",
  "Country" = EXCLUDED."Country",
  "Phone" = EXCLUDED."Phone",
  "Email" = EXCLUDED."Email",
  "Rating" = EXCLUDED."Rating",
  "UpdatedAt" = NOW(),
  "IsDeleted" = EXCLUDED."IsDeleted";

-- 2) Seed sample application users with safe upsert behavior
-- These hashes are BCrypt-compatible and validated against the password set below.
-- Use these login credentials on the app:
--   superadmin@smartluth.com / Super@123
--   admin@smartluth.com / Admin@123
--   user@smartluth.com / User@123
INSERT INTO public."ApplicationUsers" ("UserName", "FullName", "Email", "PasswordHash", "Role", "HotelId", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted")
VALUES
  (
    'superadmin',
    'Super Admin',
    'superadmin@smartluth.com',
    '$2b$12$P5Cq1GfYniH90tJyMZF20OS6hP.wkGuHMIS9fXLqX0NnDd5xkcMQq',
    'SuperAdmin',
    1,
    true,
    NOW(),
    NOW(),
    false
  ),
  (
    'admin',
    'Company Admin',
    'admin@smartluth.com',
    '$2b$12$PNf6vrFydtmhUUtiUp6v7OlsK45pUQMyW3GODd/pevnDsS02F3ep2',
    'Admin',
    1,
    true,
    NOW(),
    NOW(),
    false
  ),
  (
    'hoteluser',
    'Hotel User',
    'user@smartluth.com',
    '$2b$12$FTKTa/JHJZeDdkSyI6Sc5uA/UTShWjuf53jC56M.knUizDVL.yF/e',
    'User',
    1,
    true,
    NOW(),
    NOW(),
    false
  )
ON CONFLICT ("Email") DO UPDATE
SET
  "UserName" = EXCLUDED."UserName",
  "FullName" = EXCLUDED."FullName",
  "PasswordHash" = EXCLUDED."PasswordHash",
  "Role" = EXCLUDED."Role",
  "HotelId" = EXCLUDED."HotelId",
  "IsActive" = EXCLUDED."IsActive",
  "UpdatedAt" = NOW(),
  "IsDeleted" = EXCLUDED."IsDeleted";
