-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the license-reminder function to run daily at 8 AM MYT (midnight UTC)
-- This calls the Edge Function via HTTP
SELECT cron.schedule(
    'license-reminder-daily',  -- Job name
    '0 0 * * *',               -- Cron expression: daily at midnight UTC (8 AM MYT)
    $$
    SELECT net.http_post(
        url := 'https://cyhvmzreenhvxiwuqahb.supabase.co/functions/v1/license-reminder',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
            'Content-Type', 'application/json'
        ),
        body := '{}'::jsonb
    );
    $$
);

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the schedule later:
-- SELECT cron.unschedule('license-reminder-daily');
