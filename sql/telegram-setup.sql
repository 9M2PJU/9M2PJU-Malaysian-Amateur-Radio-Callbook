-- =====================================================
-- TELEGRAM NOTIFICATION SETUP
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Add Telegram Chat ID column to callsigns table
ALTER TABLE callsigns ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Step 2: Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_callsigns_telegram ON callsigns(telegram_chat_id);

-- Step 3: Update reminders table to track notification channel
-- This allows us to send both email AND telegram without duplicates
ALTER TABLE license_reminders_sent ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'email';

-- Step 4: Update unique constraint to include channel
-- First, drop the old constraint
ALTER TABLE license_reminders_sent DROP CONSTRAINT IF EXISTS unique_reminder;

-- Then create new constraint that includes channel
ALTER TABLE license_reminders_sent 
ADD CONSTRAINT unique_reminder_channel UNIQUE(callsign, days_before, channel);

-- Done! Now you can:
-- 1. Deploy the updated Edge Function
-- 2. Add TELEGRAM_BOT_TOKEN to Supabase secrets
-- 3. Users can submit their Telegram Chat ID via the form
