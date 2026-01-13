-- =====================================================
-- MY-CALLBOOK DATABASE SETUP
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Create the callsigns table
CREATE TABLE IF NOT EXISTS callsigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    callsign TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    website TEXT,
    facebook TEXT,
    qrz TEXT,
    added_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE callsigns ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for public read access
-- Step 3: Create policy for authenticated read access (No Public Access)
CREATE POLICY "Allow registered users read access" ON callsigns
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL
    );

-- Step 4: Create policy for authenticated insert (users must be logged in)
CREATE POLICY "Allow authenticated insert" ON callsigns
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (user_id = auth.uid() OR user_id IS NULL)
    );

-- Step 5: Create policy for owner/admin update (users can only update their own entry, admin can update any)
CREATE POLICY "Allow owner or admin update" ON callsigns
    FOR UPDATE
    USING (
        auth.uid() = user_id
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    )
    WITH CHECK (
        auth.uid() = user_id
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

-- Step 6: Create policy for owner/admin delete
CREATE POLICY "Allow owner or admin delete" ON callsigns
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

-- Step 6: Import existing callsigns data
INSERT INTO callsigns (callsign, name, location, email, phone, address, website, facebook, qrz, added_date) VALUES
('9M2PJU', 'FAIZUL', 'KUALA LUMPUR', '9m2pju@hamradio.my', '+60123456789', '123, Jalan Radio, Bukit Antarabangsa, 68000 Ampang, Selangor', 'https://hamradio.my', 'https://facebook.com/9m2pju', 'https://www.qrz.com/db/9M2PJU', '2026-01-10'),
('9W2VVY', 'KHAIRUL AZLAN BIN UMAR', 'NEGERI SEMBILAN', 'dedamneo@gmail.con', '+60163357336', '', '', 'https://www.facebook.com/share/14QQrtuBPcc/?mibextid=wwXIfr', 'https://www.qrz.com/db/9W2VVY', '2026-01-12'),
('9W2NRD', 'NIK RAFIK DAUD', 'SABAH', 'nightvisionus@yahoo.com', '+60122021144', '', '', '', '', '2026-01-12'),
('9M2VVH', 'HUSSAIRY', 'SELANGOR', '9m2vvh.hussairy@gmail.com', '+60192585759', 'No 36 Jalan PP 2/3 Taman Padu Permai 45300 Sungai Besar Selangor', '', 'https://www.facebook.com/whoshy', 'https://www.qrz.com/db/9M2VVH', '2026-01-12'),
('9W2COY', 'MOHAMMAD SHAHARIL NIZZAM BIN BASIRON', 'SARAWAK', 'coyan78@gmail.com', '+60164404510', '', '', 'https://www.facebook.com/share/1C4nszhrJv/', 'https://www.qrz.com/db/9W2COY', '2026-01-12'),
('9M2IR', 'MOHD ARIS BIN BERNAWI', 'SELANGOR', '9m2ir@marts.org.my', '+60193331416', 'Lot 3026 off Jalan Embun, Kampung Kuala Ampang, 68000 Ampang, Selangor', 'http://www.marts.org.my/', 'https://www.facebook.com/Mohdarisbernawi', 'https://www.qrz.com/db/9M2IR', '2026-01-12'),
('9M2MT', 'AZMAN', 'KELANTAN', 'asi9m2mt@gmail.com', '', '', '', '', '', '2026-01-12'),
('9W2SQ', 'SABRI SAAD', 'KUALA LUMPUR', 'impiansabri@gmail.com', '', '', '', '', '', '2026-01-12');

-- Done! Your database is ready.
-- You should see 8 callsigns imported.
