-- Unschedule the daily license reminder job
-- Run this in the Supabase Dashboard SQL Editor

SELECT cron.unschedule('license-reminder-daily');

-- Verification: Check that the job is removed (result should be empty or not contain the job)
SELECT * FROM cron.job WHERE jobname = 'license-reminder-daily';
