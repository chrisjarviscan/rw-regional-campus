import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const GATEWAY_SHEETS = "https://connector-gateway.lovable.dev/google_sheets/v4";
const GATEWAY_DRIVE = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

type Payload =
  | { type: "host_application"; data: Record<string, string> }
  | { type: "interest"; data: Record<string, string> };

const HOST_HEADERS = [
  "Submitted At", "Full Name", "Email", "Company", "City",
  "Venue Capacity", "Booking Lead Time", "Champion Readiness",
  "Interest Reason", "Contribution Level", "Preferred Quarter",
];
const INTEREST_HEADERS = [
  "Submitted At", "Full Name", "Email", "Company", "Campus", "Interest Type", "Excitement",
];

const SHEET_TABS = {
  host_application: { title: "HostApplications", headers: HOST_HEADERS },
  interest: { title: "InterestSubmissions", headers: INTEREST_HEADERS },
};

async function gw(url: string, init: RequestInit = {}) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  const SHEETS_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY")!;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SHEETS_KEY,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Gateway ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function ensureSpreadsheet(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase.from("app_settings").select("value").eq("key", "submissions_sheet_id").maybeSingle();
  if (data?.value) return data.value as string;

  const created = await gw(`${GATEWAY_SHEETS}/spreadsheets`, {
    method: "POST",
    body: JSON.stringify({
      properties: { title: "RW Institute — Form Submissions" },
      sheets: [
        { properties: { title: SHEET_TABS.host_application.title } },
        { properties: { title: SHEET_TABS.interest.title } },
      ],
    }),
  });
  const sheetId = created.spreadsheetId as string;

  // Write header rows
  for (const tab of Object.values(SHEET_TABS)) {
    await gw(
      `${GATEWAY_SHEETS}/spreadsheets/${sheetId}/values/${tab.title}!A1?valueInputOption=RAW`,
      { method: "PUT", body: JSON.stringify({ values: [tab.headers] }) },
    );
  }

  await supabase.from("app_settings").upsert({ key: "submissions_sheet_id", value: sheetId });
  return sheetId;
}

async function appendRow(sheetId: string, tabTitle: string, row: string[]) {
  await gw(
    `${GATEWAY_SHEETS}/spreadsheets/${sheetId}/values/${tabTitle}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [row] }) },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const payload = (await req.json()) as Payload;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const submittedAt = new Date().toISOString();
    let row: string[];
    let table: string;

    if (payload.type === "host_application") {
      const d = payload.data;
      const insert = {
        full_name: d.full_name, email: d.email, company: d.company, city: d.city || null,
        venue_capacity: d.venue_capacity, booking_lead_time: d.booking_lead_time,
        champion_readiness: d.champion_readiness, interest_reason: d.interest_reason || null,
        contribution_level: d.contribution_level, preferred_quarter: d.preferred_quarter,
      };
      table = "host_applications";
      const { error } = await supabase.from(table).insert(insert);
      if (error) throw new Error(`DB insert: ${error.message}`);
      row = [
        submittedAt, d.full_name, d.email, d.company, d.city || "",
        d.venue_capacity, d.booking_lead_time, d.champion_readiness,
        d.interest_reason || "", d.contribution_level, d.preferred_quarter,
      ];
    } else if (payload.type === "interest") {
      const d = payload.data;
      const insert = {
        full_name: d.full_name, email: d.email, company: d.company,
        campus: d.campus, interest_type: d.interest_type, excitement: d.excitement || null,
      };
      table = "interest_submissions";
      const { error } = await supabase.from(table).insert(insert);
      if (error) throw new Error(`DB insert: ${error.message}`);
      row = [submittedAt, d.full_name, d.email, d.company, d.campus, d.interest_type, d.excitement || ""];
    } else {
      return new Response(JSON.stringify({ error: "unknown type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mirror to sheet (don't fail submission if sheet write fails)
    try {
      const sheetId = await ensureSpreadsheet(supabase);
      const tab = SHEET_TABS[payload.type].title;
      await appendRow(sheetId, tab, row);
    } catch (sheetErr) {
      console.error("Sheet mirror failed:", sheetErr);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("submit-form error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
