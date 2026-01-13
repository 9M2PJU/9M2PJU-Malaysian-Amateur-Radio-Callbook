-- =====================================================
-- CREATE PUBLIC STATISTICS FUNCTION
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- This function allows unauthenticated users to see aggregate stats
-- without exposing personal data.
-- =====================================================

CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS JSON AS $$
DECLARE
    total_operators INTEGER;
    class_a_count INTEGER;
    class_b_count INTEGER;
    class_c_count INTEGER;
    recent_count INTEGER;
    top_locations JSON;
    result JSON;
BEGIN
    -- Total Operators
    SELECT count(*) INTO total_operators FROM callsigns;

    -- License Classes
    SELECT count(*) INTO class_a_count FROM callsigns WHERE callsign ILIKE '9M%';
    SELECT count(*) INTO class_b_count FROM callsigns WHERE callsign ILIKE '9W2%' OR callsign ILIKE '9W6%' OR callsign ILIKE '9W8%';
    SELECT count(*) INTO class_c_count FROM callsigns WHERE callsign ILIKE '9W3%';

    -- Recently Added (last 7 days)
    SELECT count(*) INTO recent_count FROM callsigns WHERE added_date >= CURRENT_DATE - INTERVAL '7 days';

    -- Top 3 Locations
    SELECT json_agg(t) INTO top_locations
    FROM (
        SELECT location, count(*) as count
        FROM callsigns
        GROUP BY location
        ORDER BY count DESC
        LIMIT 3
    ) t;

    -- Construct final JSON
    result := json_build_object(
        'total_operators', total_operators,
        'class_counts', json_build_object(
            'Class A', class_a_count,
            'Class B', class_b_count,
            'Class C', class_c_count
        ),
        'recent_count', recent_count,
        'top_locations', top_locations
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to both anonymous and authenticated users
GRANT EXECUTE ON FUNCTION get_public_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_public_stats() TO authenticated;
