-- =====================================================
-- CHECK TOTAL COUNT
-- =====================================================
-- Purpose: Check the true number of callsigns in the database.
-- Run this in the Supabase SQL Editor to verify if data is deleted or just hidden.

SELECT 
    count(*) as total_rows,
    count(user_id) as assigned_rows,
    count(*) - count(user_id) as unassigned_rows
FROM callsigns;
