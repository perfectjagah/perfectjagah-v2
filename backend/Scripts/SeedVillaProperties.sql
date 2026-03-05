-- SeedVillaProperties.sql
-- Inserts 6 villa property records migrated from the legacy PerfectJagah static site.
-- Idempotent: the entire block is skipped if any Villa-type property already exists.
-- Run in SSMS or: sqlcmd -S SAGAR\SQLEXPRESS -d PerfectJagahDb -E -i SeedVillaProperties.sql

IF NOT EXISTS (SELECT 1 FROM Properties WHERE PropertyType = 'Villa')
BEGIN

    INSERT INTO Properties
        (Title, Description, Price, Location, PropertyType, AreaSqFt, Amenities, CreatedAt, IsActive)
    VALUES

    -- 1. West County Villas (project4)
    (
        'West County Villas',
        '100-acre premium gated community villa plots on Jangaon–Warangal Highway, Nandigama. '
        + 'RERA & HMDA Approved. Price starting from Rs. 6,500 per sq.ft. '
        + '3 mins from ORR Exit 3 (Muttangi), 3 km from ODF Shopping Complex, '
        + '7 mins from Kondakal IT SEZ, 5 mins from Gadium International School, '
        + '20 mins from IT Financial District, 30 mins from Airport.',
        6500.00,
        'Nandigama',
        'Villa',
        0,
        'Grand Reception,Business Center,Mega Clubhouse,Swimming Pool,Meditation Center,Flower Garden,Internal Roads,Indoor Sports,Outdoor Sports,Restaurant & Dining,Sandpit Area',
        GETUTCDATE(),
        1
    ),

    -- 2. Mayfair Sunrise (project5)
    (
        'Mayfair Sunrise',
        '66-acre luxury gated community in Kollur with 589 premium 4 & 5 BHK villas. '
        + 'Plot sizes 300–500 sq.yds, built-up area 3,888–6,111 sq.ft. Starting from Rs. 5 Crore. '
        + 'RERA & HMDA Approved. '
        + 'Amenities include a 1,00,000 sq.ft clubhouse, 38,000 sq.ft open party lawn, '
        + '6 km jogging track, 14 parks, 11,000 sq.ft fully equipped gym, swimming pool & jacuzzi, '
        + 'EV charging, solar panels and heat pumps. '
        + '5 mins to RR7, 10 mins to ORR Exits 2 & 3, 15 mins to Financial District, 25 mins to Airport.',
        50000000.00,
        'Kollur, Hyderabad',
        'Villa',
        6111,
        '1,00,000 sft Clubhouse,38,000 sft Open Party Lawn,6 KM Jogging Track,14 Parks,11,000 sft Fully Equipped Gym,Swimming Pool & Jacuzzi,Box Cricket Area,EV Charging,Solar Panels,Heat Pumps',
        GETUTCDATE(),
        1
    ),

    -- 3. APR Praveen's Eterno (project8)
    (
        'APR Praveen''s Eterno',
        '10-acre gated community at Patighanpur, Hyderabad with 112 G+2 triplex 4 BHK luxury villas. '
        + 'Plot 222–266 sq.yds, built-up 3,420–3,860 sq.ft. Individual lift in each villa. '
        + 'Premium finishes: vitrified tiles, teak wood, UPVC windows. '
        + 'Home Theatre & Bar Lounge. 24/7 solar-fenced security. '
        + 'RERA P01100006126 & DTCP Approved. '
        + '5 mins to RR7, 10 mins to ORR Exits 2 & 3, 10 mins to Gaudium School, '
        + '15 mins to Financial District, 25 mins to Airport.',
        35000000.00,
        'Patighanpur, Hyderabad',
        'Villa',
        3860,
        'Clubhouse with Swimming Pool & Gym,100% Power Backup,Full Water Supply,Well-lit Avenues,24/7 Security with Solar Fencing,Home Theatre & Bar Lounge,Individual Lift in Each Villa,Children Play Area,Avenue Plantation',
        GETUTCDATE(),
        1
    ),

    -- 4. SSLR's Suprabhatha (project10)
    (
        'SSLR''s Suprabhatha',
        'Premium gated community G+2 villas with individual lift at Kollur, Hyderabad. '
        + 'Plot 180–200 sq.yds, built-up 2,960–3,690 sq.ft, 2/3 BHK, east & west facing options. '
        + 'Starting from Rs. 2.4 Crore. RERA P01100009349 & DTCP Approved. '
        + 'Direct access to Shankarpalli–Patancheru 150 ft Road, Vishakha 200 ft Road and Mumbai Highway.',
        24000000.00,
        'Kollur, Hyderabad',
        'Villa',
        3690,
        'Clubhouse,Swimming Pool,Individual Lift in Each Villa,Landscaped Parks,24/7 Security,Underground Drainage,Pooja Room,Multiple Lounges,Home Theatre',
        GETUTCDATE(),
        1
    ),

    -- 5. Makuta Green Woods (project12)
    (
        'Makuta Green Woods',
        '3.5-acre exclusive gated community with 46 lavish G+2 triplex 5 BHK villas at '
        + 'Gundlapochampally, Kompally. Plot 171–263 sq.yds, built-up 2,800–4,069 sq.ft. '
        + 'Price Rs. 7,999 per sq.ft. 6,000 sq.ft clubhouse with rooftop swimming pool. '
        + '40 ft main road and 30 ft internal roads. RERA & DTCP Approved. '
        + '2 mins to Ayodhya Circle, 10 mins to MLR Institute, 7 mins to HITAM, '
        + '14 mins to Kandlakoya IT Park, 16 mins to Tech Mahindra SEZ, 30 mins to Secunderabad.',
        7999.00,
        'Gundlapochampally, Kompally',
        'Villa',
        4069,
        'Rooftop Swimming Pool,Designer Landscaped Park,Reception Desk,Gym/Yoga Room,Multi-purpose Hall,Indoor Games,Party Lawn,Children''s Play Area,Jogging Track,Badminton Court,Avenue Plantation',
        GETUTCDATE(),
        1
    ),

    -- 6. Janapriya Olive County (project13)
    (
        'Janapriya Olive County',
        '15.5-acre European-style gated community at Sri Rangavaram, Kompally with 178 G+1 duplex villas. '
        + 'Plot 133–400 sq.yds, built-up 1,440–4,920 sq.ft, 3/4/5 BHK. Starting from Rs. 79 Lakhs. '
        + 'Janapriya CBSE School on campus. 100% Vastu Compliant. '
        + 'HMDA & TG RERA P02200008493 Approved. Possession: December 2027. '
        + '15 km to Pulla Reddy Institute, 4 km / 9 mins to Air Force Hospital, '
        + '8 km / 15 mins to Medchal Railway Station, 12–13 km to ORR Exits 5 & 6.',
        7900000.00,
        'Sri Rangavaram, Kompally',
        'Villa',
        4920,
        'PLAYSCAPES Activity Zones,Grand Clubhouse with Swimming Pool,Janapriya CBSE School,Gated Security,Landscaped Parks,Jogging Track,Sports Courts,Avenue Plantation,100% Vastu Compliance',
        GETUTCDATE(),
        1
    );

    PRINT 'SUCCESS: Inserted 6 villa properties.';

END
ELSE
BEGIN
    PRINT 'SKIPPED: Villa properties already exist in the database.';
END
