-- Add marts_id column to callsigns table
ALTER TABLE callsigns ADD COLUMN IF NOT EXISTS marts_id TEXT;

-- Run this in Supabase SQL Editor to update your table!
