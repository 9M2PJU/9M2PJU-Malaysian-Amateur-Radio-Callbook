-- =====================================================
-- FIX RLS SECURITY - ADMIN OVERRIDE WITH JWT EMAIL CHECK
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Drop the current update policy
DROP POLICY IF EXISTS "Allow owner or admin update" ON callsigns;
DROP POLICY IF EXISTS "Allow owner update" ON callsigns;

-- Step 2: Create new update policy with admin override using JWT email
-- This is more reliable than subquery to auth.users
CREATE POLICY "Allow owner or admin update" ON callsigns
    FOR UPDATE
    USING (
        auth.uid() = user_id  -- Owner can update
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'  -- Admin can update any
    )
    WITH CHECK (
        auth.uid() = user_id
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

-- Done! Admin can now edit any callsign using JWT email check.
