-- SeedApartmentPlotProperties.sql
-- Inserts 6 open-plot property records and 1 apartment property record migrated
-- from the legacy PerfectJagah static site.
--
-- Idempotent: each block is guarded by a title check so re-running is safe.
-- Run in SSMS or:
--   sqlcmd -S SAGAR\SQLEXPRESS -d PerfectJagahDb -E -i SeedApartmentPlotProperties.sql

-- ─────────────────────────────────────────────────────────────────────────────
-- OPEN PLOTS (6 projects)
-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'SRINIVASAM by PROTEK Realty')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'SRINIVASAM by PROTEK Realty',
        '9-acre villa plots gated community layout on Shankerpally to Vikarabad Highway, '
        + 'Vattimeenapally Grampanchayat. DTCP Approved & RERA Certified. '
        + 'Very close proximity to Regional Ring Road. '
        + '5 mins from Telangana Mobility Valley (3000 acres Central & State Govt project), '
        + '2 mins from Nawabpet, 20 mins from Shankerpally, '
        + '40 mins from Neopolis (Kokapet). 70% bank loan available.',
        2400000.00,
        'Vattimeenapally, Shankerpally–Vikarabad Highway',
        'Plot',
        0,
        '100% Clear Title,CC Roads,24x7 Security,Underground Water Supply,Underground Drainage System,100% Vastu Plotting,Children Play Area,Electricity,Street Lights,Avenue Plantation',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: SRINIVASAM by PROTEK Realty';
END
ELSE
    PRINT 'Skipped (exists): SRINIVASAM by PROTEK Realty';

-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'Newmark Gardenia')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'Newmark Gardenia',
        '18-acre villa plots gated community layout at Thummaluru on Srisailam Highway, Hyderabad. '
        + 'DTCP Approved, RERA Certified & HMDA Approved. '
        + 'Price Rs. 27,000 per square yard. '
        + '5 mins to Pharma City, 10 mins to ORR, '
        + '15 mins to Fab City / Hardware Park / TCS Adibatla / Airport & GMR AERO City, '
        + '25 mins to Shamshabad, 40 mins to Financial City.',
        27000.00,
        'Thummaluru, Srisailam Highway, Hyderabad',
        'Plot',
        0,
        '100% Clear Title,CC Roads,24x7 Security,Underground Water Supply,Underground Drainage System,100% Vastu Plotting,Children Play Area,Electricity,Street Lights,Avenue Plantation',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: Newmark Gardenia';
END
ELSE
    PRINT 'Skipped (exists): Newmark Gardenia';

-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'SVG Flora')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'SVG Flora',
        '100-acre villa plots gated community with resort-style amenities on Jangaon, Warangal Highway, Telangana. '
        + 'RERA & HMDA Approved. Price Rs. 3,199 per square yard. '
        + '3 mins from Warangal Highway, 5 mins from Jangaon District, '
        + '30 mins from Rampur IT SEZ, 35 mins from Hanumakonda / Warangal, '
        + '40 mins from Yadadri Swamy Temple & Regional Ring Road.',
        3199.00,
        'Jangaon, Warangal Highway, Telangana',
        'Plot',
        0,
        'Grand Reception,Business Center,Mega Clubhouse,Swimming Pool,Meditation Center,Flower Garden,Internal Roads,Indoor Sports,Outdoor Sports,Restaurant & Dining,Sandpit Area',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: SVG Flora';
END
ELSE
    PRINT 'Skipped (exists): SVG Flora';

-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'RajaBhoomi Aananda')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'RajaBhoomi Aananda',
        '15+ acre green community with 165 premium villa plots near Shankarpally, under new HMDA limits. '
        + 'DTCP & RERA Approved. Starting from Rs. 39 Lakhs. '
        + 'Pre-engineered smart plots with water lines installed. '
        + 'Clubhouse, parks, central activity spaces with 50%+ landscaped green areas. '
        + 'Facing 100 ft road. 10 km from Shankarpally town, '
        + '33 mins from Neopolis IT SEZ. Bank loans available.',
        3900000.00,
        'Near Shankarpally, Hyderabad',
        'Plot',
        0,
        '100% Clear Title,CC Roads,24x7 Security,Underground Water Supply,Underground Drainage System,Vastu Plotting,Children Play Area,Electricity,Street Lights,Avenue Plantation,Clubhouse,Parks,Central Activity Spaces',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: RajaBhoomi Aananda';
END
ELSE
    PRINT 'Skipped (exists): RajaBhoomi Aananda';

-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'Shree Samprada')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'Shree Samprada',
        'DTCP Approved Layout & RERA Approved villa plots at Atmakur, Sadashivpet on Mumbai Highway. '
        + 'Project by Happy Blooms. Starting from Rs. 21 Lakhs. Bank loans available. '
        + '15 mins to IIT Hyderabad, 15 mins to Woxsen Business School, '
        + '20 mins to GITAM University, 5 mins to MRF, 15 mins to Toshiba Factory, '
        + '20 mins to Mahindra, 15 mins to Sangareddy District HQ. '
        + 'Near Regional Ring Road, 25 mins to Outer Ring Road.',
        2100000.00,
        'Atmakur, Sadashivpet, Mumbai Highway',
        'Plot',
        0,
        '100% Clear Title with Vastu,CC Roads,Footpath with Walking Tiles,Underground Drainage System,Cabled Electricity,Street Lights,Compound Wall,Gateway Entrance',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: Shree Samprada';
END
ELSE
    PRINT 'Skipped (exists): Shree Samprada';

-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'ANTARVANA - Hillock The Nature Retreat')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'ANTARVANA - Hillock The Nature Retreat',
        '400+ acre gated farmland community in Mominpet, near Ananthagiri Hills, '
        + 'adjacent to 10,000 acres of reserved forest. Farm plots of 303–605 sq.yds. '
        + 'Price Rs. 12,000 per sq.yard. Award Winner 2022 (Best Service Award). '
        + 'Secure, appreciating investment with peace, fun, and nature. '
        + '60 mins from Kokapet ORR, 20 km from NH65. '
        + 'Ideal for weekend homes, nature retreats, or pure investment.',
        12000.00,
        'Mominpet, near Ananthagiri Hills, Hyderabad',
        'Plot',
        605,
        '20+ Fruit Plantations per Plot,Adventure Zone (Kayaking, Trekking, Cycling),Luxury Resort & Cottages,Organic Farming & Goshala,Corporate Events Venue,Fishing & Water Activities,Scenic Environment',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: ANTARVANA - Hillock The Nature Retreat';
END
ELSE
    PRINT 'Skipped (exists): ANTARVANA - Hillock The Nature Retreat';

-- ─────────────────────────────────────────────────────────────────────────────
-- APARTMENTS (1 project)
-- ─────────────────────────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = 'MVV Lake Breeze')
BEGIN
    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES
    (
        'MVV Lake Breeze',
        'First Mega Project from MVV Housing (30+ years experience) in Hyderabad. '
        + '6.25-acre premium gated community at Bachupally. '
        + '1,520 premium 3 BHK flats across 4 towers (4 Cellars + G + 30 floors each). '
        + 'Built-up area 1,768–2,432 sq.ft. Price Rs. 4,600 per sq.ft. RERA & DTCP Approved. '
        + '8 km to JNTU Metro Station & Outer Ring Road, 15 km to HITEC City, '
        + '48 km to International Airport. Strategic location in high-demand Bachupally.',
        4600.00,
        'Bachupally, Hyderabad',
        'Apartment',
        2432,
        '50+ Premium Amenities,Children Play Area,Sports Facilities,Covered Parking,24x7 Security,Water Supply,Drainage System,Landscaped Gardens,Clubhouse,Swimming Pool,Gymnasium',
        GETUTCDATE(),
        1
    );
    PRINT 'Inserted: MVV Lake Breeze';
END
ELSE
    PRINT 'Skipped (exists): MVV Lake Breeze';
