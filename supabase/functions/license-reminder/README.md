# License Reminder Edge Function

Sends automated license expiry reminders via **Telegram** and **Email** to users who have registered their callsign with an expiry date.

## Features

- **Telegram Notifications**: Sends reminders via Telegram Bot API
- **Email Notifications**: Sends HTML email reminders via Resend API
- **Duplicate Prevention**: Tracks sent reminders per channel to avoid spam
- **Graduated Urgency**: Different message styling based on days until expiry

## Notification Schedule

Reminders are sent at these intervals before expiry:
- 90 days (Notice)
- 60 days (Notice)
- 30 days (Reminder)
- 14 days (Reminder)
- 7 days (Urgent)
- 3 days (Urgent)
- 1 day (Urgent)

## Environment Variables

Set these in Supabase Dashboard > Edge Functions > Secrets:

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot token from @BotFather |
| `RESEND_API_KEY` | Resend.com API key (optional - email disabled by default) |

## Database Requirements

Run `sql/telegram-setup.sql` to add required columns:
- `telegram_chat_id` column in `callsigns` table
- `channel` column in `license_reminders_sent` table

## Deployment

```bash
# Deploy the function
supabase functions deploy license-reminder

# Set secrets
supabase secrets set TELEGRAM_BOT_TOKEN=your_bot_token
```

## Manual Testing

```bash
curl -X POST https://your-project.supabase.co/functions/v1/license-reminder \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

## Scheduled Execution

The function is scheduled to run daily at 8 AM MYT via pg_cron.
See `sql/schedule-license-reminder.sql` for the cron configuration.
