-- =====================================================
-- RESTRICT READ ACCESS TO REGISTERED USERS ONLY
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Drop the existing public read policy
DROP POLICY IF EXISTS "Allow public read access" ON callsigns;

-- Step 2: Create a new Restricted Read policy
-- Only allows access if the user has a valid session (auth.uid() is not null)
CREATE POLICY "Allow registered users read access" ON callsigns
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL
    );

-- Done! Now only logged-in users can see the list.
