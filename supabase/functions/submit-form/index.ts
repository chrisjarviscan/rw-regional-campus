import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const GATEWAY_SHEETS = "https://connector-gateway.lovable.dev/google_sheets/v4";
const GATEWAY_DRIVE = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

type Payload =
  | { type: "host_application"; data: Record<string, string> }
  | { type: "interest"; data: Record<string, string> }
  | { type: "business_case"; data: Record<string, unknown> }
  | { type: "purchase"; data: Record<string, string> };

const HOST_HEADERS = [
  "Submitted At", "Full Name", "Email", "Company", "City",
  "Venue Capacity", "Booking Lead Time", "Champion Readiness",
  "Interest Reason", "Contribution Level", "Preferred Quarter",
];
const INTEREST_HEADERS = [
  "Submitted At", "Full Name", "Email", "Company", "Campus", "Interest Type", "Excitement",
];
const BUSINESS_CASE_HEADERS = [
  "Submitted At", "Company", "Presenter Name", "Presenter Email", "Presenter Role",
  "Audience Role", "Decision Maker", "Preferred City", "Preferred Quarter",
  "Seats Requested", "Headcount Bracket", "Has Champions", "Has Formal Training",
  "Selected Challenges", "Desired Outcomes", "Sponsor Name", "Budget Range",
  "Primary Ask", "Extra Notes",
];
const PURCHASE_HEADERS = [
  "Submitted At", "Full Name", "Email", "Company", "Role",
  "Pack", "Preferred Campus", "Payment Method", "Seats Notes", "Extra Notes",
];

const SHEET_TABS = {
  host_application: { title: "HostApplications", headers: HOST_HEADERS },
  interest: { title: "InterestSubmissions", headers: INTEREST_HEADERS },
  business_case: { title: "BusinessCaseSubmissions", headers: BUSINESS_CASE_HEADERS },
  purchase: { title: "PurchaseInquiries", headers: PURCHASE_HEADERS },
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

async function ensureTab(sheetId: string, tab: { title: string; headers: string[] }) {
  // Try to read row 1 — if the tab is missing this 400s. Add the tab + headers in that case.
  try {
    await gw(`${GATEWAY_SHEETS}/spreadsheets/${sheetId}/values/${tab.title}!A1`);
    return;
  } catch (_) {
    await gw(`${GATEWAY_SHEETS}/spreadsheets/${sheetId}:batchUpdate`, {
      method: "POST",
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab.title } } }] }),
    });
    await gw(
      `${GATEWAY_SHEETS}/spreadsheets/${sheetId}/values/${tab.title}!A1?valueInputOption=RAW`,
      { method: "PUT", body: JSON.stringify({ values: [tab.headers] }) },
    );
  }
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
    } else if (payload.type === "business_case") {
      const d = payload.data as Record<string, unknown>;
      const arr = (v: unknown) => Array.isArray(v) ? v.join("; ") : "";
      const s = (v: unknown) => v == null ? "" : String(v);
      const insert: Record<string, unknown> = {
        company_name: s(d.company_name),
        presenter_name: d.presenter_name || null,
        presenter_email: d.presenter_email || null,
        presenter_role: d.presenter_role || null,
        audience_role: d.audience_role || null,
        decision_maker: d.decision_maker || null,
        preferred_city: d.preferred_city || null,
        preferred_quarter: d.preferred_quarter || null,
        seats_requested: d.seats_requested || null,
        headcount_bracket: d.headcount_bracket || null,
        has_champions: d.has_champions || null,
        has_formal_training: d.has_formal_training || null,
        selected_challenges: Array.isArray(d.selected_challenges) ? d.selected_challenges : [],
        desired_outcomes: Array.isArray(d.desired_outcomes) ? d.desired_outcomes : [],
        sponsor_name: d.sponsor_name || null,
        budget_range: d.budget_range || null,
        primary_ask: d.primary_ask || null,
        extra_notes: d.extra_notes || null,
        research_snapshot: d.research_snapshot || null,
      };
      table = "business_case_drafts";
      const { error } = await supabase.from(table).insert(insert);
      if (error) throw new Error(`DB insert: ${error.message}`);
      row = [
        submittedAt, s(d.company_name), s(d.presenter_name), s(d.presenter_email), s(d.presenter_role),
        s(d.audience_role), s(d.decision_maker), s(d.preferred_city), s(d.preferred_quarter),
        s(d.seats_requested), s(d.headcount_bracket), s(d.has_champions), s(d.has_formal_training),
        arr(d.selected_challenges), arr(d.desired_outcomes), s(d.sponsor_name), s(d.budget_range),
        s(d.primary_ask), s(d.extra_notes),
      ];
    } else if (payload.type === "purchase") {
      const d = payload.data;
      const insert = {
        full_name: d.full_name, email: d.email, company: d.company, role: d.role || null,
        pack: d.pack, preferred_campus: d.preferred_campus || null,
        payment_method: d.payment_method,
        seats_notes: d.seats_notes || null, extra_notes: d.extra_notes || null,
      };
      table = "purchase_inquiries";
      const { error } = await supabase.from(table).insert(insert);
      if (error) throw new Error(`DB insert: ${error.message}`);
      row = [
        submittedAt, d.full_name, d.email, d.company, d.role || "",
        d.pack, d.preferred_campus || "", d.payment_method,
        d.seats_notes || "", d.extra_notes || "",
      ];
    } else {
      return new Response(JSON.stringify({ error: "unknown type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mirror to sheet (don't fail submission if sheet write fails)
    try {
      const sheetId = await ensureSpreadsheet(supabase);
      const tab = SHEET_TABS[payload.type];
      await ensureTab(sheetId, tab);
      await appendRow(sheetId, tab.title, row);
    } catch (sheetErr) {
      console.error("Sheet mirror failed:", sheetErr);
    }

    // Send transactional emails (don't fail submission if email send fails)
    try {
      const send = async (templateName: string, recipientEmail: string, templateData: Record<string, unknown>, idempotencyKey: string) => {
        const { error } = await supabase.functions.invoke("send-transactional-email", {
          body: { templateName, recipientEmail, templateData, idempotencyKey },
        });
        if (error) console.error(`email ${templateName} failed:`, error);
      };

      const id = crypto.randomUUID();

      if (payload.type === "interest") {
        const d = payload.data;
        await Promise.all([
          send("interest-confirmation", d.email, { full_name: d.full_name, campus: d.campus }, `interest-confirm-${id}`),
          send("interest-notification", "nichole@realizedworth.com", {
            full_name: d.full_name, email: d.email, company: d.company,
            campus: d.campus, interest_type: d.interest_type, excitement: d.excitement || "",
          }, `interest-notify-${id}`),
        ]);
      } else if (payload.type === "host_application") {
        const d = payload.data;
        await Promise.all([
          send("host-confirmation", d.email, { full_name: d.full_name, city: d.city }, `host-confirm-${id}`),
          send("host-notification", "campus@realizedworth.com", {
            full_name: d.full_name, email: d.email, company: d.company, city: d.city || "",
            venue_capacity: d.venue_capacity, booking_lead_time: d.booking_lead_time,
            champion_readiness: d.champion_readiness, contribution_level: d.contribution_level,
            preferred_quarter: d.preferred_quarter, interest_reason: d.interest_reason || "",
          }, `host-notify-${id}`),
        ]);
      } else if (payload.type === "business_case") {
        const d = payload.data as Record<string, unknown>;
        const s = (v: unknown) => v == null ? "" : String(v);
        const arr = (v: unknown) => Array.isArray(v) ? v.join("; ") : "";
        const presenterEmail = s(d.presenter_email);
        const sendOps: Promise<unknown>[] = [
          send("business-case-notification", "nichole@realizedworth.com", {
            company_name: s(d.company_name), presenter_name: s(d.presenter_name),
            presenter_email: presenterEmail, presenter_role: s(d.presenter_role),
            audience_role: s(d.audience_role), decision_maker: s(d.decision_maker),
            preferred_city: s(d.preferred_city), preferred_quarter: s(d.preferred_quarter),
            seats_requested: s(d.seats_requested), headcount_bracket: s(d.headcount_bracket),
            has_champions: s(d.has_champions), has_formal_training: s(d.has_formal_training),
            selected_challenges: arr(d.selected_challenges), desired_outcomes: arr(d.desired_outcomes),
            sponsor_name: s(d.sponsor_name), budget_range: s(d.budget_range),
            primary_ask: s(d.primary_ask), extra_notes: s(d.extra_notes),
          }, `bc-notify-${id}`),
        ];
        if (presenterEmail) {
          sendOps.push(send("business-case-confirmation", presenterEmail, {
            presenter_name: s(d.presenter_name), company_name: s(d.company_name),
          }, `bc-confirm-${id}`));
        }
        await Promise.all(sendOps);
      }
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
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
