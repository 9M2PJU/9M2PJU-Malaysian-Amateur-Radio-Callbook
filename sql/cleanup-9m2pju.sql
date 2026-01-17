-- =====================================================
-- CLEANUP SCRIPT FOR 9M2PJU
-- =====================================================
-- Purpose: Remove all callsigns owned by 9m2pju@hamradio.my EXCEPT '9M2PJU'.
-- Instructions: Run this in the Supabase SQL Editor.

DO $$
DECLARE
    target_user_id UUID;
    deleted_count INTEGER;
BEGIN
    -- 1. Get the User ID
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = '9m2pju@hamradio.my';

    -- 2. Perform Delete if user exists
    IF target_user_id IS NOT NULL THEN
        WITH deleted_rows AS (
            DELETE FROM callsigns 
            WHERE user_id = target_user_id 
            AND callsign != '9M2PJU'
            RETURNING *
        )
        SELECT count(*) INTO deleted_count FROM deleted_rows;
        
        RAISE NOTICE 'Cleanup complete.';
        RAISE NOTICE 'User ID: %', target_user_id;
        RAISE NOTICE 'Callsigns deleted: %', deleted_count;
        
    ELSE
        RAISE EXCEPTION 'User 9m2pju@hamradio.my not found.';
    END IF;
END $$;
