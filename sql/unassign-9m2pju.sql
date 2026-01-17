-- =====================================================
-- UNASSIGN SCRIPT FOR 9M2PJU
-- =====================================================
-- Purpose: Unassign (detach) all callsigns from 9m2pju@hamradio.my EXCEPT '9M2PJU'.
-- This sets user_id to NULL, keeping the callsigns in the database but removing them from the user's "My Callsigns".
-- Instructions: Run this in the Supabase SQL Editor.

DO $$
DECLARE
    target_user_id UUID;
    updated_count INTEGER;
BEGIN
    -- 1. Get the User ID
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = '9m2pju@hamradio.my';

    -- 2. Perform Update if user exists
    IF target_user_id IS NOT NULL THEN
        WITH updated_rows AS (
            UPDATE callsigns 
            SET user_id = NULL
            WHERE user_id = target_user_id 
            AND callsign != '9M2PJU'
            RETURNING *
        )
        SELECT count(*) INTO updated_count FROM updated_rows;
        
        RAISE NOTICE 'Unassign complete.';
        RAISE NOTICE 'User ID: %', target_user_id;
        RAISE NOTICE 'Callsigns unassigned: %', updated_count;
        
    ELSE
        RAISE EXCEPTION 'User 9m2pju@hamradio.my not found.';
    END IF;
END $$;
