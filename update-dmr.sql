-- Add dmr_id column to callsigns table
ALTER TABLE callsigns ADD COLUMN IF NOT EXISTS dmr_id TEXT;

-- Run this in Supabase SQL Editor to update your table!
