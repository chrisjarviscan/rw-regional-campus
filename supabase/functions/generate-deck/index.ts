// Generates a personalized .pptx business case deck.
// Returns { filename, base64 } for client-side download.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
// @ts-ignore - npm specifier works in Deno deploy
import pptxgen from "npm:pptxgenjs@3.12.0";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

// Brand palette (hex, no #)
const C = {
  navy: "0B3552",
  orange: "EF6135",
  dteal: "4A89A2",
  lteal: "A2C1CD",
  cream: "F8F4EE",
  white: "FFFFFF",
  ink: "1A1A1A",
  muted: "5A6B78",
};

const FONT_HEAD = "Roboto";
const FONT_BODY = "Roboto";

const COPY_TOOL = {
  type: "function" as const,
  function: {
    name: "return_deck_copy",
    description: "Return tailored copy for the personalized slides of an RW Institute business case deck.",
    parameters: {
      type: "object",
      properties: {
        cover_subtitle: { type: "string", description: "One-line framing under the company name. ≤90 chars." },
        why_now_headline: { type: "string", description: "Why this matters now, framed for the audience role. ≤80 chars." },
        why_now_body: { type: "string", description: "2-3 sentences. Connect company's CSR posture to the moment." },
        situation_headline: { type: "string", description: "≤70 chars summarizing where the company's volunteer program sits today." },
        situation_bullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5, description: "Honest, specific observations. No fluff." },
        outcomes_headline: { type: "string", description: "≤70 chars. What success looks like." },
        outcomes_bullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
        ask_headline: { type: "string", description: "≤80 chars. The specific ask, tailored to audience role." },
        ask_body: { type: "string", description: "2-3 sentences answering: what we want, what it costs, what we'll bring back." },
      },
      required: [
        "cover_subtitle", "why_now_headline", "why_now_body",
        "situation_headline", "situation_bullets",
        "outcomes_headline", "outcomes_bullets",
        "ask_headline", "ask_body",
      ],
      additionalProperties: false,
    },
  },
};

const SYSTEM = `You are a senior strategist helping an internal champion build a business case for sending their team to the RW Institute campus — a 4-day program that trains corporate volunteer champions to facilitate transformative experiences (not just coordinate transactional events).

Voice rules — these are non-negotiable:
- Write like a thoughtful colleague, not a marketer. No staccato fragments, no "It's not X. It's Y." patterns, no "Imagine..." openers, no breathless hype.
- No emojis. No exclamation marks. No "unlock", "elevate", "transform your", "game-changing".
- Tailor framing to the audience role: a CFO needs cost/risk language; a CHRO needs talent/retention; a CSR lead needs community impact and reporting depth.
- Use specifics from the research and inputs. If a fact is missing, write around it — never invent.
- "Transformative Experiences" and "Transformative Volunteering" are RW's branded terms (capitalize). Refer to RW as "RW Institute".
- Keep sentences readable. One idea at a time.`;

async function callAI(payload: Record<string, unknown>): Promise<any> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const userPrompt = `Build tailored deck copy for this case.

COMPANY: ${payload.company_name}
PRESENTER: ${payload.presenter_name || "—"} (${payload.presenter_role || "—"})
AUDIENCE: ${payload.audience_role || "—"}; budget approver: ${payload.decision_maker || "—"}
CITY/TIMING: ${payload.preferred_city || "—"}, seats: ${payload.seats_requested || "—"}
HEADCOUNT: ${payload.headcount_bracket || "—"}
CHAMPIONS: ${payload.has_champions || "—"}; formal training: ${payload.has_formal_training || "—"}
TOP CHALLENGES: ${(payload.selected_challenges || []).join("; ") || "—"}
DESIRED OUTCOMES: ${(payload.desired_outcomes || []).join("; ") || "—"}
SPONSOR: ${payload.sponsor_name || "—"}; budget: ${payload.budget_range || "—"}
THEIR ASK (raw): ${payload.primary_ask || "—"}
EXTRA NOTES: ${payload.extra_notes || "—"}

RESEARCH SNAPSHOT (may be partial; use only what's confirmed):
${JSON.stringify(payload.research_snapshot || {}, null, 2)}

Now return tailored copy via the return_deck_copy tool.`;

  const resp = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      tools: [COPY_TOOL],
      tool_choice: { type: "function", function: { name: "return_deck_copy" } },
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${t}`);
  }
  const data = await resp.json();
  const tc = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) throw new Error("No tool call in AI response");
  return JSON.parse(tc.function.arguments);
}

/** Friendly labels (mirror frontend) */
const CITY_LABELS: Record<string, string> = {
  detroit: "Detroit · August 2026",
  washington_dc: "Washington DC · September 2026",
  atlanta: "Atlanta · October 2026",
  seattle: "Seattle · Fall 2026",
  future: "Philadelphia or Minneapolis · future cohort",
  request_other: "City to be confirmed",
  flexible: "Open to options",
};
const SEAT_LABELS: Record<string, string> = {
  "2_5": "2–5 seats", "6_12": "6–12 seats", "13_18": "13–18 seats",
  "19_30": "19–30 seats", "30_plus": "30+ seats", exploring: "Exploring",
};
const AUD_LABELS: Record<string, string> = {
  ceo: "CEO", chro: "CHRO", cfo: "CFO", csr_lead: "CSR Leadership",
  hr_director: "HR Director", dei_lead: "DEI Leadership", comms_lead: "Communications",
  manager: "Manager", committee: "Working Group", other: "Leadership",
};

function buildDeck(input: any, copy: any): any {
  const pres = new (pptxgen as any)();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = `RW Institute · Business Case · ${input.company_name}`;
  pres.author = "RW Institute";

  const W = 13.333;
  const H = 7.5;

  const audience = AUD_LABELS[input.audience_role] || "Leadership";
  const city = CITY_LABELS[input.preferred_city] || "Campus to be confirmed";
  const seats = SEAT_LABELS[input.seats_requested] || "Seats TBD";

  // Helper: title block
  const addTitleBar = (s: any, title: string, eyebrow?: string) => {
    if (eyebrow) {
      s.addText(eyebrow.toUpperCase(), {
        x: 0.6, y: 0.45, w: 12, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 11, bold: true, color: C.orange, charSpacing: 4,
      });
    }
    s.addText(title, {
      x: 0.6, y: eyebrow ? 0.85 : 0.55, w: 12, h: 1.0,
      fontFace: FONT_HEAD, fontSize: 30, bold: true, color: C.navy,
    });
    s.addShape("line", {
      x: 0.6, y: eyebrow ? 1.85 : 1.55, w: 0.9, h: 0,
      line: { color: C.orange, width: 3 },
    });
  };

  // Slide 1 — Cover (navy bg)
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("RW INSTITUTE · BUSINESS CASE", {
      x: 0.6, y: 0.5, w: 12, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C.orange, charSpacing: 6,
    });
    s.addText(input.company_name, {
      x: 0.6, y: 2.1, w: 12, h: 1.3,
      fontFace: FONT_HEAD, fontSize: 54, bold: true, color: C.white,
    });
    s.addText(copy.cover_subtitle || "A case for sending our team to the campus.", {
      x: 0.6, y: 3.5, w: 11, h: 1.1,
      fontFace: FONT_BODY, fontSize: 22, color: C.lteal, italic: true,
    });
    s.addShape("line", { x: 0.6, y: 5.0, w: 0.9, h: 0, line: { color: C.orange, width: 3 } });
    s.addText(
      [
        { text: "Prepared by ", options: { color: C.lteal } },
        { text: `${input.presenter_name || "—"}${input.presenter_role ? `, ${input.presenter_role}` : ""}\n`, options: { color: C.white, bold: true } },
        { text: "For ", options: { color: C.lteal } },
        { text: `${audience}${input.decision_maker ? ` · ${input.decision_maker}` : ""}`, options: { color: C.white, bold: true } },
      ],
      { x: 0.6, y: 5.2, w: 12, h: 1.5, fontFace: FONT_BODY, fontSize: 14 },
    );
    s.addText(`${city}  ·  ${seats}`, {
      x: 0.6, y: 6.7, w: 12, h: 0.4,
      fontFace: FONT_BODY, fontSize: 12, color: C.lteal,
    });
  }

  // Slide 2 — Why now
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, copy.why_now_headline || "Why now", "Why now");
    s.addText(copy.why_now_body || "", {
      x: 0.6, y: 2.3, w: 9, h: 4,
      fontFace: FONT_BODY, fontSize: 18, color: C.ink, lineSpacingMultiple: 1.4,
    });
    s.addShape("rect", { x: 10.0, y: 2.3, w: 2.7, h: 4, fill: { color: C.cream }, line: { color: C.cream } });
    s.addText("Audience", {
      x: 10.2, y: 2.5, w: 2.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 10, bold: true, color: C.dteal, charSpacing: 3,
    });
    s.addText(audience, {
      x: 10.2, y: 2.9, w: 2.5, h: 0.6,
      fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.navy,
    });
    if (input.decision_maker) {
      s.addText("Approver", {
        x: 10.2, y: 4.0, w: 2.5, h: 0.4,
        fontFace: FONT_HEAD, fontSize: 10, bold: true, color: C.dteal, charSpacing: 3,
      });
      s.addText(input.decision_maker, {
        x: 10.2, y: 4.4, w: 2.5, h: 0.8,
        fontFace: FONT_BODY, fontSize: 14, color: C.ink,
      });
    }
  }

  // Slide 3 — The shift (fixed)
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };
    addTitleBar(s, "From transactional events to Transformative Experiences", "The shift");
    const col = (x: number, label: string, items: string[], color: string) => {
      s.addText(label, {
        x, y: 2.3, w: 5.8, h: 0.5,
        fontFace: FONT_HEAD, fontSize: 14, bold: true, color, charSpacing: 3,
      });
      s.addText(items.map((t) => ({ text: t, options: { bullet: { code: "25CF" } } })), {
        x, y: 2.9, w: 5.8, h: 4,
        fontFace: FONT_BODY, fontSize: 16, color: C.ink, paraSpaceAfter: 8,
      });
    };
    col(0.6, "TODAY — TRANSACTIONAL", [
      "One-off events, low repeat participation",
      "Champions act as coordinators",
      "Impact reported in hours, not depth",
      "Hard to connect to retention or culture",
    ], C.muted);
    col(7.0, "WITH RW INSTITUTE — TRANSFORMATIVE", [
      "Designed experiences with intentional reflection",
      "Champions facilitate, not just organize",
      "Outcomes leadership recognizes",
      "A practice the team can teach others",
    ], C.orange);
  }

  // Slide 4 — What is the campus
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, "What the RW Institute campus is", "The program");
    s.addText(
      [
        { text: "Four days. One cohort of up to 40 participants from up to eight companies. ", options: { bold: true, color: C.navy } },
        { text: "No single company holds more than a third of the seats — diversity of context is part of how the practice transfers.\n\n", options: { color: C.ink } },
        { text: "Participants leave with: ", options: { bold: true, color: C.navy } },
        { text: "a methodology for designing Transformative Experiences, the language to teach it inside their own organization, and a peer cohort to keep learning from after the campus ends.", options: { color: C.ink } },
      ],
      { x: 0.6, y: 2.3, w: 12, h: 4.5, fontFace: FONT_BODY, fontSize: 18, lineSpacingMultiple: 1.4 },
    );
  }

  // Slide 5 — Who attends (capacity)
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, "Who attends", "Capacity by design");
    const stat = (x: number, big: string, label: string) => {
      s.addText(big, {
        x, y: 2.6, w: 4.0, h: 1.6,
        fontFace: FONT_HEAD, fontSize: 80, bold: true, color: C.orange, align: "center",
      });
      s.addText(label, {
        x, y: 4.3, w: 4.0, h: 0.8,
        fontFace: FONT_BODY, fontSize: 14, color: C.navy, align: "center",
      });
    };
    stat(0.6, "~40", "Participants per campus");
    stat(4.7, "8", "Companies maximum");
    stat(8.7, "1/3", "Cap per single organization");
  }

  // Slide 6 — Your situation (personalized)
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, copy.situation_headline || "Where we are today", `Where ${input.company_name} stands`);
    const bullets = (copy.situation_bullets || []).map((t: string) => ({ text: t, options: { bullet: { code: "25CF" } } }));
    s.addText(bullets, {
      x: 0.6, y: 2.3, w: 9, h: 4.5,
      fontFace: FONT_BODY, fontSize: 17, color: C.ink, paraSpaceAfter: 10, lineSpacingMultiple: 1.3,
    });
    // Right rail: selected challenges
    s.addShape("rect", { x: 9.9, y: 2.3, w: 2.9, h: 4.5, fill: { color: C.lteal }, line: { color: C.lteal } });
    s.addText("Challenges we picked", {
      x: 10.1, y: 2.45, w: 2.7, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 10, bold: true, color: C.navy, charSpacing: 3,
    });
    const ch = (input.selected_challenges || []).slice(0, 5);
    s.addText(ch.length ? ch.map((t: string) => ({ text: t, options: { bullet: { code: "25A0" } } })) : "—", {
      x: 10.1, y: 2.85, w: 2.7, h: 3.9,
      fontFace: FONT_BODY, fontSize: 12, color: C.navy, paraSpaceAfter: 6,
    });
  }

  // Slide 7 — The methodology
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };
    addTitleBar(s, "The methodology champions take home", "Practice, not theory");
    const items = [
      ["Design", "Build experiences with intent — not just logistics."],
      ["Facilitate", "Hold space so people can reflect, not just attend."],
      ["Connect", "Tie the work to the partner's mission and the participant's life."],
      ["Sustain", "Create a practice teams can repeat without burning out leaders."],
    ];
    items.forEach(([k, v], i) => {
      const x = 0.6 + (i % 2) * 6.4;
      const y = 2.3 + Math.floor(i / 2) * 2.3;
      s.addShape("rect", { x, y, w: 6.0, h: 2.0, fill: { color: C.white }, line: { color: C.lteal, width: 1 } });
      s.addText(k, { x: x + 0.3, y: y + 0.2, w: 5.6, h: 0.5, fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.orange });
      s.addText(v, { x: x + 0.3, y: y + 0.8, w: 5.6, h: 1.1, fontFace: FONT_BODY, fontSize: 14, color: C.ink });
    });
  }

  // Slide 8 — From coordinators to facilitators
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, "From coordinators to facilitators", "What changes for champions");
    s.addText(
      [
        { text: "Most volunteer champions inherit the role. They become event organizers — booking venues, managing sign-ups, sending reminders.\n\n", options: { color: C.ink } },
        { text: "RW Institute trains them as facilitators of experience. ", options: { bold: true, color: C.navy } },
        { text: "They learn to design moments, hold reflection, and build the kind of program that retains both volunteers and partners.\n\n", options: { color: C.ink } },
        { text: "That is the gap most CSR programs cannot close on their own — and the reason this campus exists.", options: { italic: true, color: C.dteal } },
      ],
      { x: 0.6, y: 2.3, w: 12, h: 4.5, fontFace: FONT_BODY, fontSize: 18, lineSpacingMultiple: 1.4 },
    );
  }

  // Slide 9 — Outcomes (personalized)
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, copy.outcomes_headline || "What success looks like", "What we'd bring back");
    const bullets = (copy.outcomes_bullets || []).map((t: string) => ({ text: t, options: { bullet: { code: "25CF" } } }));
    s.addText(bullets, {
      x: 0.6, y: 2.3, w: 12, h: 4.5,
      fontFace: FONT_BODY, fontSize: 18, color: C.ink, paraSpaceAfter: 12, lineSpacingMultiple: 1.4,
    });
  }

  // Slide 10 — Pricing
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };
    addTitleBar(s, "Investment", "Pricing for the 2026 cohort");
    const tiers = [
      ["Individual", "$2,100", "1 seat"],
      ["6-pack", "$12,000", "Save $600"],
      ["12-pack", "$22,800", "Save $2,400"],
      ["18-pack", "$32,130", "Save $5,670"],
    ];
    tiers.forEach(([n, p, sub], i) => {
      const x = 0.6 + i * 3.15;
      s.addShape("rect", { x, y: 2.5, w: 2.95, h: 3.6, fill: { color: C.white }, line: { color: C.lteal, width: 1 } });
      s.addText(n, { x, y: 2.7, w: 2.95, h: 0.5, align: "center", fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.dteal });
      s.addText(p, { x, y: 3.4, w: 2.95, h: 1.0, align: "center", fontFace: FONT_HEAD, fontSize: 30, bold: true, color: C.navy });
      s.addText(sub, { x, y: 4.6, w: 2.95, h: 0.5, align: "center", fontFace: FONT_BODY, fontSize: 12, color: C.muted });
    });
    s.addText(
      "Pricing reflects 2026 cohort tiers. Final invoicing follows seat confirmation.",
      { x: 0.6, y: 6.4, w: 12, h: 0.4, align: "center", fontFace: FONT_BODY, fontSize: 11, italic: true, color: C.muted },
    );
  }

  // Slide 11 — The ask (personalized)
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("THE ASK", {
      x: 0.6, y: 0.5, w: 12, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C.orange, charSpacing: 6,
    });
    s.addText(copy.ask_headline || "Approval to send our team", {
      x: 0.6, y: 1.4, w: 12, h: 1.6,
      fontFace: FONT_HEAD, fontSize: 36, bold: true, color: C.white,
    });
    s.addShape("line", { x: 0.6, y: 3.2, w: 0.9, h: 0, line: { color: C.orange, width: 3 } });
    s.addText(copy.ask_body || "", {
      x: 0.6, y: 3.5, w: 11.5, h: 2.5,
      fontFace: FONT_BODY, fontSize: 18, color: C.lteal, lineSpacingMultiple: 1.4,
    });
    if (input.primary_ask) {
      s.addText(`In our words: "${input.primary_ask}"`, {
        x: 0.6, y: 6.2, w: 12, h: 0.7,
        fontFace: FONT_BODY, fontSize: 14, italic: true, color: C.lteal,
      });
    }
  }

  // Slide 12 — Next steps
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTitleBar(s, "Next steps", "If we're a go");
    const steps = [
      ["1", "Confirm seats and campus city with RW Institute"],
      ["2", "Identify champion candidates and brief them"],
      ["3", "Block the four campus days on calendars"],
      ["4", "Plan the post-campus rollout inside our team"],
    ];
    steps.forEach(([n, t], i) => {
      const y = 2.3 + i * 0.95;
      s.addShape("ellipse", { x: 0.6, y, w: 0.7, h: 0.7, fill: { color: C.orange }, line: { color: C.orange } });
      s.addText(n, { x: 0.6, y, w: 0.7, h: 0.7, align: "center", valign: "middle", fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.white });
      s.addText(t, { x: 1.6, y: y + 0.05, w: 11, h: 0.6, fontFace: FONT_BODY, fontSize: 17, color: C.ink });
    });
    s.addText("Contact: Nichole Giller · nichole@realizedworth.com", {
      x: 0.6, y: 6.7, w: 12, h: 0.4,
      fontFace: FONT_BODY, fontSize: 12, color: C.dteal,
    });
  }

  return pres;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const input = await req.json();
    if (!input?.company_name) {
      return new Response(JSON.stringify({ error: "company_name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let copy: any;
    try {
      copy = await callAI(input);
    } catch (err) {
      console.error("AI copy failed, using fallbacks:", err);
      copy = {
        cover_subtitle: "A case for bringing our team to the campus.",
        why_now_headline: "Why now",
        why_now_body: "Our volunteer program has reached the limit of what events alone can do. The next gain comes from changing how our champions lead.",
        situation_headline: "Where we are today",
        situation_bullets: input.selected_challenges?.length ? input.selected_challenges : ["We have a program but limited methodology.", "Champions are organizing rather than facilitating.", "We can't yet tie volunteering to retention or culture."],
        outcomes_headline: "What success looks like",
        outcomes_bullets: input.desired_outcomes?.length ? input.desired_outcomes : ["A trained set of facilitators we can scale.", "Deeper, longer nonprofit partnerships.", "Reporting that reflects real impact."],
        ask_headline: "Approval to send our team to the RW Institute campus",
        ask_body: input.primary_ask || "We are asking for sponsorship to send our champions to the campus, and the time off-site to attend.",
      };
    }

    const pres = buildDeck(input, copy);
    const base64 = await pres.write({ outputType: "base64" });

    const safeCompany = String(input.company_name).replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 40);
    const filename = `RW_Institute_Business_Case_${safeCompany}.pptx`;

    return new Response(JSON.stringify({ filename, base64 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-deck error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
