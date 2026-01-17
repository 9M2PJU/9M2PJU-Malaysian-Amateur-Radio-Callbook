-- =====================================================
-- VERIFICATION SCRIPT
-- =====================================================
-- Purpose: List all callsigns for 9m2pju@hamradio.my that are NOT '9M2PJU'.
-- Run this BEFORE the cleanup script to see what will be deleted.

SELECT 
    c.id, 
    c.callsign, 
    c.name, 
    c.created_at
FROM callsigns c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = '9m2pju@hamradio.my'
AND c.callsign != '9M2PJU';
