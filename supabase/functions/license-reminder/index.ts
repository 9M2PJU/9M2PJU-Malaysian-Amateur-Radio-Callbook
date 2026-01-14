import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CallsignRecord {
  callsign: string;
  name: string;
  email: string;
  expiry_date: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate dates (90 days = ~3 months before expiry)
    const today = new Date();
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);

    const todayStr = today.toISOString().split("T")[0];
    const threeMonthsStr = threeMonthsFromNow.toISOString().split("T")[0];

    // Find callsigns expiring in exactly 90 days that haven't been reminded
    const { data: expiringCallsigns, error: fetchError } = await supabase
      .from("callsigns")
      .select("callsign, name, email, expiry_date")
      .not("email", "is", null)
      .not("expiry_date", "is", null)
      .gte("expiry_date", todayStr)
      .lte("expiry_date", threeMonthsStr);

    if (fetchError) {
      throw new Error(`Failed to fetch callsigns: ${fetchError.message}`);
    }

    console.log(`Found ${expiringCallsigns?.length || 0} callsigns expiring within 3 months`);

    const results: { callsign: string; status: string; daysUntil: number }[] = [];

    for (const record of expiringCallsigns || []) {
      // Calculate days until expiry
      const expiryDate = new Date(record.expiry_date);
      const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Only send at specific intervals: 90, 60, 30, 14, 7, 3, 1 days
      const reminderDays = [90, 60, 30, 14, 7, 3, 1];
      if (!reminderDays.includes(daysUntil)) {
        continue;
      }

      // Check if reminder already sent for this interval
      const { data: alreadySent } = await supabase
        .from("license_reminders_sent")
        .select("id")
        .eq("callsign", record.callsign)
        .eq("days_before", daysUntil)
        .single();

      if (alreadySent) {
        console.log(`Reminder already sent for ${record.callsign} at ${daysUntil} days`);
        continue;
      }

      // Send email via Resend
      // Disabled to save quota
      const EMAIL_ENABLED = false;

      if (!EMAIL_ENABLED) {
        console.log(`[DISABLED] Skipping email to ${record.callsign} (${daysUntil} days)`);
        results.push({ callsign: record.callsign, status: "disabled", daysUntil });
        continue;
      }

      const emailResult = await sendReminderEmail(resendApiKey, record, daysUntil);

      if (emailResult.success) {
        // Record that we sent this reminder
        await supabase.from("license_reminders_sent").insert({
          callsign: record.callsign,
          email: record.email,
          days_before: daysUntil,
        });

        results.push({ callsign: record.callsign, status: "sent", daysUntil });
        console.log(`Sent reminder to ${record.callsign} (${daysUntil} days)`);
      } else {
        results.push({ callsign: record.callsign, status: `failed: ${emailResult.error}`, daysUntil });
        console.error(`Failed to send to ${record.callsign}: ${emailResult.error}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendReminderEmail(
  apiKey: string,
  record: CallsignRecord,
  daysUntil: number
): Promise<{ success: boolean; error?: string }> {
  const expiryDate = new Date(record.expiry_date).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const urgency = daysUntil <= 7 ? "🚨 URGENT" : daysUntil <= 30 ? "⚠️ REMINDER" : "📋 NOTICE";
  const subject = `${urgency}: Your Amateur Radio License (${record.callsign}) expires in ${daysUntil} days`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 40px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 24px; background: linear-gradient(to right, #4facfe, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        📻 MY-Callbook
      </h1>
      <p style="color: #888; margin: 8px 0 0;">Malaysian Amateur Radio Directory</p>
    </div>

    <div style="background: ${daysUntil <= 7 ? 'rgba(255,0,0,0.1)' : daysUntil <= 30 ? 'rgba(255,165,0,0.1)' : 'rgba(79,172,254,0.1)'}; border-left: 4px solid ${daysUntil <= 7 ? '#ff4444' : daysUntil <= 30 ? '#ffa500' : '#4facfe'}; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 8px; color: ${daysUntil <= 7 ? '#ff6666' : daysUntil <= 30 ? '#ffcc00' : '#4facfe'};">${urgency}</h2>
      <p style="margin: 0; font-size: 16px;">
        Your amateur radio license is expiring in <strong style="font-size: 20px;">${daysUntil} days</strong>
      </p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888;">Callsign</td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; font-weight: bold; color: #4facfe; font-size: 18px;">${record.callsign}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888;">Name</td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${record.name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #888;">Expiry Date</td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: ${daysUntil <= 7 ? '#ff6666' : '#e5e5e5'};">${expiryDate}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://espectra.mcmc.gov.my/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Renew at MCMC eSpectra
      </a>
    </div>

    <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 0;">
      Please visit the MCMC eSpectra portal to renew your amateur radio license before it expires.
    </p>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">

    <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
      This is an automated reminder from <a href="https://callbook.hamradio.my" style="color: #4facfe;">MY-Callbook</a>.<br>
      You received this because you registered your callsign with an expiry date.
    </p>
  </div>
</body>
</html>
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "MY-Callbook <reminder@callbook.hamradio.my>",
        to: [record.email],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || response.statusText };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
