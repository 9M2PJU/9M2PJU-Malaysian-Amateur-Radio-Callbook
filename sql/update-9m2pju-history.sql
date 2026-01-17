-- =====================================================
-- MANUAL UPDATE SCRIPT FOR 9M2PJU
-- =====================================================
-- Instructions:
-- 1. Go to your Supabase Dashboard.
-- 2. Navigate to the SQL Editor (icon on the left sidebar).
-- 3. Click "New Query".
-- 4. Paste the code below and click "Run".

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- 1. Look up the User ID for the specific email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = '9m2pju@hamradio.my';

    -- 2. Check if user exists
    IF target_user_id IS NOT NULL THEN
        -- 3. Update the specific callsign record
        UPDATE callsigns
        SET 
            -- Assign ownership to the found user
            user_id = target_user_id,
            
            -- Set dates to the very distinct past (Year 2000)
            -- This ensures it is always sorted as the "oldest" data
            created_at = '2000-01-01 00:00:00+00',
            added_date = '2000-01-01'
            
        WHERE callsign = '9M2PJU';
        
        RAISE NOTICE 'SUCCESS: Callsign 9M2PJU has been updated.';
        RAISE NOTICE ' Assigned User ID: %', target_user_id;
        RAISE NOTICE ' Date set to: 2000-01-01';
        
    ELSE
        RAISE EXCEPTION 'ERROR: User "9m2pju@hamradio.my" was NOT found in the auth.users table. Please ensure the user has signed up.';
    END IF;
END $$;
