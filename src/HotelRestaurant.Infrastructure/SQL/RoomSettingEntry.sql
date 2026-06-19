-- ===========================================================================
-- 1. SEED DATA ENTRIES FOR BED TYPES
-- ===========================================================================
INSERT INTO "BedTypes" ("Id", "BedName", "Description", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted") VALUES 
(1, 'Standard Double', 'Two interconnected standard matrices suitable for family accommodations or shared business setups.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(2, 'Queen Bed', 'Standard continuous medium-profile queen sizing framework.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(3, 'King Bed', 'Premium executive large configuration master structural bed frame.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(4, 'Single Bed', 'Standard individual layout design structure for compact studio room formats.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Sync sequence tracker
SELECT setval(pg_get_serial_sequence('"BedTypes"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BedTypes";


-- ===========================================================================
-- 2. SEED DATA ENTRIES FOR BOOKING TYPE LIST
-- ===========================================================================
INSERT INTO "BookingTypes" ("Id", "TypeName", "Remarks", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted") VALUES 
(1, 'Online Travel Agent (OTA)', 'Reservations routed through global digital API merchant systems and channel managers.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(2, 'Local Travel Agent (LTA)', 'Offline corporate partnerships and regional destination management aggregators.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(3, 'Counter Booking', 'Direct on-premise walk-in arrivals handling manual terminal ledgers.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(4, 'Back Office', 'Internal administrative distribution management entries and corporate group assignments.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Sync sequence tracker
SELECT setval(pg_get_serial_sequence('"BookingTypes"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BookingTypes";


-- ===========================================================================
-- 3. SEED DATA ENTRIES FOR BOOKING SOURCES
-- ===========================================================================
INSERT INTO "BookingSources" ("Id", "SourceName", "Details", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted") VALUES 
(1, 'Booking.com', 'OTA Pipeline Integration Group — Linked under channel classification lookup group 1.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(2, 'MakeMyTrip', 'OTA Pipeline Integration Group — Linked under channel classification lookup group 1.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(3, 'Goibibo', 'OTA Pipeline Integration Group — Linked under channel classification lookup group 1.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(4, 'Destiny Travels', 'OTA Corporate Brokerage Link — Linked under channel classification lookup group 1.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(5, 'Direct Walk-In', 'Front office desk lobby registration channel fallback context.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Sync sequence tracker
SELECT setval(pg_get_serial_sequence('"BookingSources"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BookingSources";


-- ===========================================================================
-- 1. SEED DATA ONLY FOR THE EMPTY "Complementaries" TABLE
-- ===========================================================================
INSERT INTO "Complementaries" ("Id", "ItemName", "Description", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted") VALUES 
(1, 'Welcome Drink on Arrival', 'Complimentary refreshing seasonal fresh fruit juice mocktails provided inside lobby workspace zones during registration checklists.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(2, 'High-Speed Premium Wi-Fi', 'Unrestricted individual corporate fiber network token passwords providing connectivity maps up to 50Mbps per node.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(3, 'Buffet Dining Breakfast', 'Complimentary continental multi-cuisine inclusion served daily inside the Central Restaurant Hub between 07:00 AM - 10:30 AM.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(4, 'Gym and Wellness Spa Access', 'Free admission credentials into health club locker rooms, cross-fit bays, and steam pool saunas.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);


-- ===========================================================================
-- 2. SEED DATA ONLY FOR THE EMPTY "FloorPlans" TABLE
-- ===========================================================================
INSERT INTO "FloorPlans" ("Id", "FloorName", "Remarks", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted") VALUES 
(1, 'Ground Floor Lobby Block', 'Hosts central reservation counters, storage bays, main lounges, and executive business pods.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(2, 'First Floor Premium Wing', 'Assigned primarily to standard dual interconnected room blocks and deluxe terrace modules.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(3, 'Second Floor Executive Level', 'Restricted corporate level mapping configuration including private dining suites and boardrooms.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(4, 'Penthouse Rooftop Sector', 'Exclusive luxury villa assets, rooftop dining spaces, and overflow open-sky infinity pool access maps.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);


-- ===========================================================================
-- 3. SYNCHRONIZE SEQUENCE COUNTERS FOR ALL TABLES 
-- (Prevents future unique constraint errors when adding from Angular UI)
-- ===========================================================================
SELECT setval(pg_get_serial_sequence('"BedTypes"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BedTypes";
SELECT setval(pg_get_serial_sequence('"BookingTypes"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BookingTypes";
SELECT setval(pg_get_serial_sequence('"BookingSources"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "BookingSources";
SELECT setval(pg_get_serial_sequence('"Complementaries"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "Complementaries";
SELECT setval(pg_get_serial_sequence('"FloorPlans"', 'Id'), COALESCE(MAX("Id"), 1)) FROM "FloorPlans";

