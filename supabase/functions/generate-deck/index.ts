// Generates a brand-faithful business case as both a .pptx and a self-contained .html.
// Returns { pptx: { filename, base64 }, html: { filename, base64 } } for client-side download.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
// @ts-ignore - npm specifier works in Deno deploy
import pptxgen from "npm:pptxgenjs@3.12.0";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

// ======================================================================
// RW Brand tokens — pulled from official colors_and_type.css
// (No leading '#' — pptxgenjs wants raw hex.)
// ======================================================================
const C = {
  orange: "EC5C2A",        // Hero Orange — CTAs, accent rules
  orangeBurnt: "DE5123",   // H1
  orangeDark: "A73B19",    // accent on dark
  navy: "0A3454",          // Hero Navy — covers, footers
  navyDeep: "062136",      // deeper navy variant
  charcoal: "3C3F44",      // primary headings (light bg)
  ink: "404040",           // body
  muted: "6B6B6F",         // captions, footnotes
  dteal: "4491A9",         // links, highlights
  lteal: "7FB5C2",         // alt rows, soft accent
  aqua: "B8D8DC",          // ring/halo
  burgundy: "981C20",      // data viz, "missing" callouts
  mustard: "F59328",
  greyLight: "C2C2C6",     // borders
  bgSoft: "F6F7F8",        // page wash
  white: "FFFFFF",
};

const FONT_HEAD = "Roboto";
const FONT_BODY = "Roboto";
const FONT_COND = "Roboto Condensed";

// ======================================================================
// Audience-tailored copy schema (expanded)
// ======================================================================
const COPY_TOOL = {
  type: "function" as const,
  function: {
    name: "return_deck_copy",
    description: "Return tailored copy for the personalized slides of an Realized Worth business case deck.",
    parameters: {
      type: "object",
      properties: {
        cover_subtitle: { type: "string", description: "≤90 chars. One-line framing under the company name." },
        situation_paragraph: { type: "string", description: "Slide 2 'Where {Company} is now'. 4-6 sentences. Honest, specific, grounded in research. No hype." },
        situation_pullquote: { type: "string", description: "≤140 chars. The single sentence that captures the diagnosis." },
        champions_intro: { type: "string", description: "Slide 5 intro. 2 sentences framing what trained champions do at this specific company." },
        ripple_headline: { type: "string", description: "Slide 7 headline. ≤90 chars. The 'small group → shift' framing for THIS company." },
        ripple_body: { type: "string", description: "Slide 7 body. 3-4 sentences explaining how trained champions ripple at the company's scale." },
        getback_intro: { type: "string", description: "Slide 11 intro. 2 sentences framing what the company gets back, tailored to audience role." },
        ask_headline: { type: "string", description: "Slide 12 headline. ≤80 chars. The specific ask." },
        ask_body: { type: "string", description: "Slide 12 body. 2-3 sentences: what we want, what it costs, what we'll bring back." },
      },
      required: [
        "cover_subtitle", "situation_paragraph", "situation_pullquote",
        "champions_intro", "ripple_headline", "ripple_body",
        "getback_intro", "ask_headline", "ask_body",
      ],
      additionalProperties: false,
    },
  },
};

const SYSTEM = `You are a senior strategist helping an internal champion build a business case for sending their team to the Realized Worth Regional Campus — a 2-day program that trains corporate volunteer champions to facilitate Transformative Experiences (not just coordinate transactional events).

Voice rules — non-negotiable:
- Write like a thoughtful colleague, not a marketer. No staccato fragments. No "It's not X. It's Y." patterns. No "Imagine..." openers. No breathless hype.
- No emojis. No exclamation marks. No "unlock", "elevate", "transform your", "game-changing", "leverage", "synergy".
- Tailor framing to the audience role: a CFO needs cost/risk language; a CHRO needs talent/retention; a CSR lead needs community impact and reporting depth; a CEO needs strategic narrative.
- Use specifics from the research and inputs. If a fact is missing, write around it — never invent.
- "Transformative Experiences" and "Transformative Volunteering" are RW's branded terms (capitalize). Refer to RW as "Realized Worth".
- Keep sentences readable. One idea at a time.
- For research-grounded slides (situation_paragraph), be honest about what the research shows: scale, structure, gaps. Do not flatter.`;

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
TOP CHALLENGES: ${(payload.selected_challenges as string[] || []).join("; ") || "—"}
DESIRED OUTCOMES: ${(payload.desired_outcomes as string[] || []).join("; ") || "—"}
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

// ======================================================================
// Friendly labels (mirror frontend)
// ======================================================================
const CITY_LABELS: Record<string, string> = {
  detroit: "Detroit · August 2026",
  washington_dc: "Washington DC · September 2026",
  atlanta: "Atlanta · October 2026",
  seattle: "Seattle · Coming 2027",
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

// Map seat tier to pricing row index for highlight
function seatToTierIndex(seats?: string): number {
  if (!seats) return -1;
  if (seats === "2_5") return 0;          // Individual / small
  if (seats === "6_12") return 1;         // 6-pack
  if (seats === "13_18") return 2;        // 12-pack range
  if (seats === "19_30" || seats === "30_plus") return 3; // 18-pack
  return -1;
}

// ======================================================================
// Citations (fixed — never hallucinated)
// ======================================================================
const CITATIONS = [
  { n: 1, text: "Harris, L.T. & Fiske, S.T. (2006). Dehumanizing the Lowest of the Low. Psychological Science, 17(10).", url: "https://doi.org/10.1111/j.1467-9280.2006.01793.x" },
  { n: 2, text: "McGaugh, J.L. (2000). Memory: A Century of Consolidation. Science, 287.", url: "https://doi.org/10.1126/science.287.5451.248" },
  { n: 3, text: "Klimecki et al. (2014). Differential plasticity after compassion vs empathy training. SCAN, 9(6).", url: "https://doi.org/10.1093/scan/nst060" },
  { n: 4, text: "Mezirow, J. (1991). Transformative Dimensions of Adult Learning.", url: "https://www.wiley.com/en-us/Transformative+Dimensions+of+Adult+Learning-p-9780470857953" },
  { n: 5, text: "Penner et al. (2005). Prosocial Behavior: Multilevel Perspectives. Annual Review of Psychology, 56.", url: "https://doi.org/10.1146/annurev.psych.56.091103.070141" },
  { n: 6, text: "Tajfel & Turner (1979). An Integrative Theory of Intergroup Conflict.", url: "https://doi.org/10.1016/S0065-2601(05)37005-5" },
  { n: 8, text: "Haslam, S.A. (2004). Psychology in Organizations: The Social Identity Approach.", url: "https://doi.org/10.4135/9781446278819" },
  { n: 9, text: "Kolb, D.A. (1984). Experiential Learning.", url: "https://www.pearson.com/en-us/subject-catalog/p/experiential-learning-experience-as-the-source-of-learning-and-development/P200000003115" },
  { n: 10, text: "Grant, A.M. (2008). The Significance of Task Significance. Journal of Applied Psychology, 93(1).", url: "https://doi.org/10.1037/0021-9010.93.1.108" },
  { n: 11, text: "Mitchell, T.D. (2008). Traditional vs. Critical Service-Learning. MJCSL, 14(2).", url: "https://quod.lib.umich.edu/m/mjcsl/3239521.0014.205" },
  { n: 12, text: "Pettigrew & Tropp (2006). Meta-Analytic Test of Intergroup Contact Theory. JPSP, 90(5).", url: "https://doi.org/10.1037/0022-3514.90.5.751" },
  { n: 13, text: "Aquino & Reed (2002). The Self-Importance of Moral Identity. JPSP, 83(6).", url: "https://doi.org/10.1037/0022-3514.83.6.1423" },
  { n: 14, text: "Rodell, J.B. (2013). Finding Meaning through Volunteering. AMJ, 56(5).", url: "https://doi.org/10.5465/amj.2012.0611" },
  { n: 17, text: "Lally, P., et al. (2010). How Are Habits Formed. EJSP, 40(6).", url: "https://doi.org/10.1002/ejsp.674" },
  { n: 18, text: "Cepeda, N.J., et al. (2006). Distributed Practice in Verbal Recall Tasks. Psychological Bulletin, 132(3).", url: "https://doi.org/10.1037/0033-2909.132.3.354" },
  { n: 19, text: "Centola, D., et al. (2018). Tipping Points in Social Convention. Science, 360.", url: "https://doi.org/10.1126/science.aas8827" },
];

// ======================================================================
// PPTX BUILDER
// ======================================================================
function buildDeck(input: any, copy: any): any {
  const pres = new (pptxgen as any)();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = `Realized Worth · Business Case · ${input.company_name}`;
  pres.author = "Realized Worth";

  const W = 13.333;
  const H = 7.5;
  const company = input.company_name;
  const audience = AUD_LABELS[input.audience_role] || "Leadership";
  const city = CITY_LABELS[input.preferred_city] || "Campus to be confirmed";
  const seats = SEAT_LABELS[input.seats_requested] || "Seats TBD";
  const tierIdx = seatToTierIndex(input.seats_requested);

  let slideNum = 0;
  const newSlide = (bg: string = C.white) => {
    slideNum++;
    const s = pres.addSlide();
    s.background = { color: bg };
    return s;
  };

  // Footer (skipped on cover, references)
  const addFooter = (s: any, isDark = false) => {
    const fg = isDark ? C.lteal : C.muted;
    s.addShape("line", {
      x: 0.6, y: H - 0.55, w: W - 1.2, h: 0,
      line: { color: isDark ? C.orange : C.greyLight, width: 0.5 },
    });
    s.addText("Realized Worth · Regional Campus Series", {
      x: 0.6, y: H - 0.45, w: 8, h: 0.3,
      fontFace: FONT_COND, fontSize: 9, color: fg, charSpacing: 2,
    });
    s.addText(String(slideNum), {
      x: W - 1, y: H - 0.45, w: 0.4, h: 0.3,
      fontFace: FONT_COND, fontSize: 9, color: fg, align: "right",
    });
  };

  const addEyebrow = (s: any, txt: string) =>
    s.addText(txt.toUpperCase(), {
      x: 0.6, y: 0.5, w: 12, h: 0.35,
      fontFace: FONT_HEAD, fontSize: 10, bold: true, color: C.orange, charSpacing: 4,
    });

  const addTitle = (s: any, txt: string, opts: any = {}) =>
    s.addText(txt, {
      x: 0.6, y: 0.95, w: 12, h: 1.05,
      fontFace: FONT_HEAD, fontSize: opts.size || 28, bold: true, color: C.charcoal,
      ...opts,
    });

  const addRule = (s: any, y = 2.05) =>
    s.addShape("line", { x: 0.6, y, w: 1.0, h: 0, line: { color: C.orange, width: 3 } });

  // ---------- Slide 1 — Cover ----------
  {
    const s = newSlide(C.navy);
    // Orange accent bar
    s.addShape("rect", { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.orange }, line: { color: C.orange } });
    // Aqua decorative ring (motif from RW icon)
    s.addShape("ellipse", {
      x: W - 4.5, y: -1.5, w: 6, h: 6,
      fill: { type: "solid", color: C.navy }, line: { color: C.aqua, width: 2 },
    });
    s.addShape("ellipse", {
      x: W - 4.0, y: -1.0, w: 5, h: 5,
      fill: { type: "solid", color: C.navy }, line: { color: C.dteal, width: 1 },
    });

    s.addText("BUSINESS CASE", {
      x: 0.9, y: 1.4, w: 12, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.orange, charSpacing: 8,
    });
    s.addText("Regional Campus Series", {
      x: 0.9, y: 1.95, w: 12, h: 0.6,
      fontFace: FONT_HEAD, fontSize: 22, color: C.aqua,
    });
    s.addText(company, {
      x: 0.9, y: 3.0, w: 11, h: 1.6,
      fontFace: FONT_HEAD, fontSize: 56, bold: true, color: C.white,
    });
    s.addText(copy.cover_subtitle || "A proposal prepared for your direct manager.", {
      x: 0.9, y: 4.7, w: 11, h: 0.8,
      fontFace: FONT_BODY, fontSize: 18, italic: true, color: C.aqua,
    });
    s.addShape("line", { x: 0.9, y: 5.7, w: 1.0, h: 0, line: { color: C.orange, width: 3 } });
    s.addText(
      [
        { text: "Prepared by ", options: { color: C.aqua } },
        { text: `${input.presenter_name || "—"}${input.presenter_role ? `, ${input.presenter_role}` : ""}\n`, options: { color: C.white, bold: true } },
        { text: "For ", options: { color: C.aqua } },
        { text: `${audience}${input.decision_maker ? ` · ${input.decision_maker}` : ""}\n`, options: { color: C.white, bold: true } },
        { text: `${city}  ·  ${seats}`, options: { color: C.aqua } },
      ],
      { x: 0.9, y: 5.9, w: 12, h: 1.5, fontFace: FONT_BODY, fontSize: 14 },
    );
  }

  // ---------- Slide 2 — Where {Company} is now ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, `Where ${company} is now`);
    addTitle(s, `Where ${company} is now`);
    addRule(s);

    s.addText(copy.situation_paragraph || "", {
      x: 0.6, y: 2.4, w: 8.4, h: 4.2,
      fontFace: FONT_BODY, fontSize: 15, color: C.ink, lineSpacingMultiple: 1.5,
    });

    // Pull-quote sidebar
    s.addShape("rect", { x: 9.4, y: 2.4, w: 3.4, h: 4.2, fill: { color: C.aqua }, line: { color: C.aqua } });
    s.addShape("rect", { x: 9.4, y: 2.4, w: 0.1, h: 4.2, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText("THE READ", {
      x: 9.6, y: 2.6, w: 3.0, h: 0.3,
      fontFace: FONT_COND, fontSize: 9, bold: true, color: C.navy, charSpacing: 4,
    });
    s.addText(copy.situation_pullquote || "", {
      x: 9.6, y: 3.0, w: 3.0, h: 3.4,
      fontFace: FONT_HEAD, fontSize: 16, italic: true, color: C.navy, lineSpacingMultiple: 1.3,
    });

    addFooter(s);
  }

  // ---------- Slide 3 — Why most volunteer programs produce activity, not change ----------
  {
    const s = newSlide(C.bgSoft);
    addEyebrow(s, "The structural gap");
    addTitle(s, "Why most volunteer programs produce activity, not change");
    addRule(s);

    // Flow diagram
    const flowY = 2.4;
    const nodes = [
      { x: 0.6, label: "RECRUIT", state: "ok" },
      { x: 2.9, label: "BRIEF", state: "missing" },
      { x: 5.2, label: "EXPERIENCE", state: "ok" },
      { x: 7.5, label: "DEBRIEF", state: "missing" },
      { x: 9.8, label: "RETURN", state: "ok" },
    ];
    const nodeW = 2.0, nodeH = 0.8;
    nodes.forEach((n, i) => {
      const isMissing = n.state === "missing";
      s.addShape("roundRect", {
        x: n.x, y: flowY, w: nodeW, h: nodeH,
        fill: { color: isMissing ? C.white : C.navy },
        line: { color: isMissing ? C.burgundy : C.navy, width: isMissing ? 2 : 1, dashType: isMissing ? "dash" : "solid" },
        rectRadius: 0.1,
      });
      s.addText(n.label, {
        x: n.x, y: flowY, w: nodeW, h: nodeH,
        align: "center", valign: "middle",
        fontFace: FONT_HEAD, fontSize: 12, bold: true,
        color: isMissing ? C.burgundy : C.white, charSpacing: 2,
      });
      if (isMissing) {
        s.addText("MISSING", {
          x: n.x, y: flowY + nodeH + 0.05, w: nodeW, h: 0.3,
          align: "center", fontFace: FONT_COND, fontSize: 9, bold: true, color: C.burgundy, charSpacing: 3,
        });
      }
      // Connector arrow (skip after last)
      if (i < nodes.length - 1) {
        s.addShape("line", {
          x: n.x + nodeW, y: flowY + nodeH / 2, w: 0.3, h: 0,
          line: { color: C.muted, width: 1 },
        });
      }
    });

    // Three explanation columns
    const cols = [
      { x: 0.6, label: "BEFORE", title: "Without a brief", body: "Volunteers arrive in task mode. The part of the brain that processes others as fully human [1] never activates." },
      { x: 5.0, label: "DURING", title: "Without a guide", body: "First-timers and veterans get the same assignment. The experience is pleasant but flat. Nobody calibrates challenge to contribution." },
      { x: 9.4, label: "AFTER", title: "Without a debrief", body: "The 0–40 minute window for memory consolidation [2] closes. Champions burn out — repeated exposure without structured processing activates pain-sharing rather than compassion circuits [3]." },
    ];
    cols.forEach(c => {
      s.addText(c.label, {
        x: c.x, y: 4.2, w: 3.4, h: 0.3,
        fontFace: FONT_COND, fontSize: 10, bold: true, color: C.orange, charSpacing: 4,
      });
      s.addText(c.title, {
        x: c.x, y: 4.55, w: 3.4, h: 0.5,
        fontFace: FONT_HEAD, fontSize: 16, bold: true, color: C.navy,
      });
      s.addText(c.body, {
        x: c.x, y: 5.1, w: 3.4, h: 1.7,
        fontFace: FONT_BODY, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.4,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 4 — Why immersive learning changes practice ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, "How adults change practice");
    addTitle(s, "Why immersive learning changes practice, not just knowledge");
    addRule(s);

    const cards = [
      { n: "01", k: "Practice, not lecture", v: "Participants conduct real Briefs and Debriefs with live volunteers. Skill acquisition requires doing, not watching. [9]" },
      { n: "02", k: "Disorienting dilemma", v: "A live nonprofit experience challenges assumptions about who needs help and why. The gap between expectation and reality is the learning. [4]" },
      { n: "03", k: "40-minute debrief window", v: "Structured reflection inside the memory consolidation window. Same-day debrief is a neurological design requirement, not a scheduling preference. [2]" },
      { n: "04", k: "Cohort identity", v: "Cross-company peer group continues for 6 months. Shared identity amplifies behavioral commitment to the new practice. [6][8]" },
    ];
    cards.forEach((c, i) => {
      const x = 0.6 + (i % 4) * 3.15;
      const y = 2.4;
      s.addShape("roundRect", {
        x, y, w: 2.95, h: 4.0,
        fill: { color: C.bgSoft }, line: { color: C.greyLight, width: 0.5 },
        rectRadius: 0.08,
      });
      // Numbered circle
      s.addShape("ellipse", {
        x: x + 0.25, y: y + 0.25, w: 0.7, h: 0.7,
        fill: { color: C.orange }, line: { color: C.orange },
      });
      s.addText(c.n, {
        x: x + 0.25, y: y + 0.25, w: 0.7, h: 0.7,
        align: "center", valign: "middle",
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C.white,
      });
      s.addText(c.k, {
        x: x + 0.25, y: y + 1.1, w: 2.55, h: 0.9,
        fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.navy,
      });
      s.addText(c.v, {
        x: x + 0.25, y: y + 2.0, w: 2.55, h: 1.9,
        fontFace: FONT_BODY, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.4,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 5 — What trained champions do differently ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, `What trained champions do at ${company}`);
    addTitle(s, `What trained champions do differently at ${company}`, { size: 26 });
    addRule(s);

    s.addText(copy.champions_intro || "", {
      x: 0.6, y: 2.3, w: 12, h: 0.7,
      fontFace: FONT_BODY, fontSize: 13, italic: true, color: C.muted, lineSpacingMultiple: 1.4,
    });

    const rows = [
      ["01", "They change how colleagues show up", "A 5-minute brief reactivates the part of the brain that processes others as fully human [1]. Volunteers contribute at a higher level and come back. Direct beneficiary contact durably increases effort for over a month [10]."],
      ["02", "They build real nonprofit partnerships", "Trained champions scope projects WITH partners, not FOR them. They frame the experience so volunteers encounter the work as partners — meeting the conditions for positive intergroup contact [11][12]."],
      ["03", "They turn a good day into a lasting shift", "A structured debrief within 40 minutes [2] uses the gap between expectation and reality [4] as the mechanism for prosocial identity change [5] — a shift in how someone understands themselves."],
    ];
    rows.forEach(([n, k, v], i) => {
      const y = 3.2 + i * 1.1;
      s.addShape("ellipse", {
        x: 0.6, y, w: 0.7, h: 0.7,
        fill: { color: C.orange }, line: { color: C.orange },
      });
      s.addText(n, {
        x: 0.6, y, w: 0.7, h: 0.7,
        align: "center", valign: "middle",
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C.white,
      });
      s.addText(k, {
        x: 1.5, y: y - 0.05, w: 11, h: 0.4,
        fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.navy,
      });
      s.addText(v, {
        x: 1.5, y: y + 0.35, w: 11, h: 0.7,
        fontFace: FONT_BODY, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.3,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 6 — What changes for employee / company / community ----------
  {
    const s = newSlide(C.bgSoft);
    addEyebrow(s, "Three audiences, three outcomes");
    addTitle(s, "What changes for the employee, the company, and the community", { size: 26 });
    addRule(s);

    const cols = [
      { label: "FOR THE EMPLOYEE", title: "The person who attends", body: "Prosocial identity change [5] generalizes across life domains [13]. Employees move from 'I did a good thing' to 'this is part of who I am'. The shift persists because it is identity-level, not task-level." },
      { label: "FOR THE COMPANY", title: "The organization that invests", body: "When prosocial identity is supported by the employer, the company becomes associated with that part of the self-concept [6]. Brand perception built on internalized identity is qualitatively different from perception built on messaging." },
      { label: "FOR THE COMMUNITY", title: "The nonprofits served", body: "Projects scoped around actual need [11]. Volunteers oriented toward the work. Reciprocal, recurring relationships [12] that produce sustained connection rather than photo opportunities." },
    ];
    cols.forEach((c, i) => {
      const x = 0.6 + i * 4.25;
      s.addShape("rect", { x, y: 2.4, w: 4.0, h: 4.4, fill: { color: C.white }, line: { color: C.greyLight, width: 0.5 } });
      // Aqua circle motif
      s.addShape("ellipse", { x: x + 0.3, y: 2.65, w: 0.6, h: 0.6, fill: { color: C.aqua }, line: { color: C.aqua } });
      s.addShape("ellipse", { x: x + 0.42, y: 2.77, w: 0.36, h: 0.36, fill: { color: C.orange }, line: { color: C.orange } });

      s.addText(c.label, {
        x: x + 0.3, y: 3.4, w: 3.5, h: 0.3,
        fontFace: FONT_COND, fontSize: 9, bold: true, color: C.orange, charSpacing: 4,
      });
      s.addText(c.title, {
        x: x + 0.3, y: 3.7, w: 3.5, h: 0.6,
        fontFace: FONT_HEAD, fontSize: 16, bold: true, color: C.navy,
      });
      s.addText(c.body, {
        x: x + 0.3, y: 4.4, w: 3.5, h: 2.3,
        fontFace: FONT_BODY, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.4,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 7 — From a small group to a shift (with chart) ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, "Ripple effect at scale");
    addTitle(s, copy.ripple_headline || `From a small group of trained leaders to a shift in how ${company} volunteers`, { size: 24 });
    addRule(s);

    s.addText(copy.ripple_body || "", {
      x: 0.6, y: 2.3, w: 6.2, h: 4.2,
      fontFace: FONT_BODY, fontSize: 13, color: C.ink, lineSpacingMultiple: 1.5,
    });

    // Bar chart on the right — events influenced per year by tier
    const chartX = 7.2, chartY = 2.4, chartW = 5.6, chartH = 4.0;
    s.addShape("rect", { x: chartX, y: chartY, w: chartW, h: chartH, fill: { color: C.bgSoft }, line: { color: C.greyLight, width: 0.5 } });
    s.addText("EVENTS TOUCHED PER YEAR", {
      x: chartX + 0.2, y: chartY + 0.15, w: chartW - 0.4, h: 0.3,
      fontFace: FONT_COND, fontSize: 9, bold: true, color: C.orange, charSpacing: 4,
    });

    const bars = [
      { label: "6-pack",  untrained: 30, trained: 180 },
      { label: "12-pack", untrained: 60, trained: 420 },
      { label: "18-pack", untrained: 90, trained: 720 },
    ];
    const maxVal = 800;
    const barAreaY = chartY + 0.7;
    const barAreaH = chartH - 1.3;
    bars.forEach((b, i) => {
      const baseX = chartX + 0.5 + i * 1.7;
      const barW = 0.6;
      // Untrained (light teal)
      const uH = (b.untrained / maxVal) * barAreaH;
      s.addShape("rect", {
        x: baseX, y: barAreaY + barAreaH - uH, w: barW, h: uH,
        fill: { color: C.lteal }, line: { color: C.lteal },
      });
      // Trained (orange)
      const tH = (b.trained / maxVal) * barAreaH;
      s.addShape("rect", {
        x: baseX + barW + 0.1, y: barAreaY + barAreaH - tH, w: barW, h: tH,
        fill: { color: C.orange }, line: { color: C.orange },
      });
      // Label
      s.addText(b.label, {
        x: baseX - 0.2, y: barAreaY + barAreaH + 0.05, w: barW * 2 + 0.5, h: 0.3,
        align: "center", fontFace: FONT_COND, fontSize: 10, bold: true, color: C.navy,
      });
      // Value labels
      s.addText(String(b.trained), {
        x: baseX + barW + 0.1, y: barAreaY + barAreaH - tH - 0.3, w: barW, h: 0.3,
        align: "center", fontFace: FONT_HEAD, fontSize: 10, bold: true, color: C.orange,
      });
    });
    // Legend
    s.addShape("rect", { x: chartX + 0.3, y: chartY + chartH - 0.4, w: 0.2, h: 0.15, fill: { color: C.lteal }, line: { color: C.lteal } });
    s.addText("Untrained champion", { x: chartX + 0.55, y: chartY + chartH - 0.45, w: 2.0, h: 0.25, fontFace: FONT_COND, fontSize: 9, color: C.muted });
    s.addShape("rect", { x: chartX + 2.6, y: chartY + chartH - 0.4, w: 0.2, h: 0.15, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText("Trained champion", { x: chartX + 2.85, y: chartY + chartH - 0.45, w: 2.0, h: 0.25, fontFace: FONT_COND, fontSize: 9, color: C.muted });

    addFooter(s);
  }

  // ---------- Slide 8 — The campus (agenda timeline) ----------
  {
    const s = newSlide(C.bgSoft);
    addEyebrow(s, "The campus");
    addTitle(s, "Two days, designed end-to-end");
    addRule(s);

    // Day 1 / Day 2 tracks
    const days = [
      {
        label: "DAY 1",
        title: "Brief, experience, debrief — live",
        blocks: [
          { time: "Morning", title: "Brief masterclass", body: "Frame, connect, set conditions for transformation." },
          { time: "Midday",  title: "Live nonprofit experience", body: "Real volunteer work with a partner organization." },
          { time: "Afternoon", title: "40-minute debrief", body: "Structured reflection in the consolidation window." },
        ],
      },
      {
        label: "DAY 2",
        title: "Design, practice, commit",
        blocks: [
          { time: "Morning", title: "Design workshop", body: "Build experiences for your own program, with peers." },
          { time: "Midday",  title: "Practice rounds", body: "Conduct briefs and debriefs with feedback." },
          { time: "Afternoon", title: "Cohort commitments", body: "6-month implementation plan + peer pairing." },
        ],
      },
    ];
    days.forEach((d, i) => {
      const y = 2.4 + i * 2.4;
      s.addShape("rect", { x: 0.6, y, w: 1.5, h: 2.0, fill: { color: C.navy }, line: { color: C.navy } });
      s.addText(d.label, {
        x: 0.6, y: y + 0.2, w: 1.5, h: 0.4,
        align: "center", fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.orange, charSpacing: 4,
      });
      s.addText(d.title, {
        x: 0.6, y: y + 0.7, w: 1.5, h: 1.2,
        align: "center", fontFace: FONT_BODY, fontSize: 11, italic: true, color: C.aqua, lineSpacingMultiple: 1.3,
      });
      d.blocks.forEach((b, j) => {
        const bx = 2.3 + j * 3.6;
        s.addShape("rect", { x: bx, y, w: 3.4, h: 2.0, fill: { color: C.white }, line: { color: C.greyLight, width: 0.5 } });
        s.addText(b.time.toUpperCase(), {
          x: bx + 0.2, y: y + 0.2, w: 3.0, h: 0.3,
          fontFace: FONT_COND, fontSize: 9, bold: true, color: C.orange, charSpacing: 3,
        });
        s.addText(b.title, {
          x: bx + 0.2, y: y + 0.55, w: 3.0, h: 0.5,
          fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C.navy,
        });
        s.addText(b.body, {
          x: bx + 0.2, y: y + 1.1, w: 3.0, h: 0.85,
          fontFace: FONT_BODY, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.3,
        });
      });
    });

    addFooter(s);
  }

  // ---------- Slide 9 — The credential ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, "The credential");
    addTitle(s, "A recognized professional development track");
    addRule(s);

    const stages = [
      {
        bg: C.orange, fg: C.white,
        label: "STAGE 1",
        title: "Certificate of Completion",
        body: "Awarded after the two-day campus. Validates competency in the three keystone behaviors: conducting the Brief, guiding the experience, and conducting the Debrief — trainable, repeatable facilitation skills grounded in behavioral science [1][4][5]. Included in registration.",
      },
      {
        bg: C.navy, fg: C.white,
        label: "STAGE 2 · OPTIONAL",
        title: "Certified Transformative Volunteering Leader",
        body: "Awarded after the 6-month cohort, sustained implementation, and competency verification. Complex prosocial behaviors require repeated, spaced practice to reach automaticity [17][18]. The cohort provides that structure. Positions volunteer leadership as a recognized professional development track.",
      },
    ];
    stages.forEach((st, i) => {
      const x = 0.6 + i * 6.2;
      s.addShape("rect", { x, y: 2.4, w: 6.0, h: 4.4, fill: { color: st.bg }, line: { color: st.bg } });
      s.addText(st.label, {
        x: x + 0.4, y: 2.6, w: 5.2, h: 0.4,
        fontFace: FONT_COND, fontSize: 11, bold: true, color: st.fg, charSpacing: 5,
      });
      s.addText(st.title, {
        x: x + 0.4, y: 3.1, w: 5.2, h: 1.2,
        fontFace: FONT_HEAD, fontSize: 22, bold: true, color: st.fg, lineSpacingMultiple: 1.1,
      });
      s.addText(st.body, {
        x: x + 0.4, y: 4.4, w: 5.2, h: 2.3,
        fontFace: FONT_BODY, fontSize: 11, color: st.fg, lineSpacingMultiple: 1.4,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 10 — Investment (pricing table) ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, "Investment");
    addTitle(s, "Pricing for the 2026 cohort");
    addRule(s);

    s.addText(`Campus: ${city}`, {
      x: 0.6, y: 2.3, w: 12, h: 0.4,
      fontFace: FONT_COND, fontSize: 12, color: C.dteal,
    });

    const tiers = [
      ["Individual", "1",  "$2,100",  "$2,100", "—"],
      ["6-Pack",     "6",  "$12,000", "$2,000", "5% off"],
      ["12-Pack",    "12", "$22,800", "$1,900", "10% off"],
      ["18-Pack",    "18", "$32,130", "$1,785", "15% off"],
    ];
    const headers = ["TIER", "SEATS", "TOTAL", "PER SEAT", "SAVINGS"];
    const tableX = 0.6, tableY = 2.9, rowH = 0.65;
    const colWs = [3.6, 1.4, 2.6, 2.4, 2.13];

    // Header row
    let cx = tableX;
    headers.forEach((h, i) => {
      s.addShape("rect", { x: cx, y: tableY, w: colWs[i], h: rowH, fill: { color: C.navy }, line: { color: C.navy } });
      s.addText(h, {
        x: cx, y: tableY, w: colWs[i], h: rowH,
        align: i === 0 ? "left" : "center", valign: "middle",
        fontFace: FONT_COND, fontSize: 11, bold: true, color: C.white, charSpacing: 3,
        ...(i === 0 ? { paraSpaceBefore: 0 } : {}),
      });
      cx += colWs[i];
    });
    // Data rows
    tiers.forEach((row, ri) => {
      const y = tableY + rowH + ri * rowH;
      const isHighlight = ri === tierIdx;
      let xi = tableX;
      row.forEach((cell, ci) => {
        s.addShape("rect", {
          x: xi, y, w: colWs[ci], h: rowH,
          fill: { color: isHighlight ? C.orange : (ri % 2 === 0 ? C.bgSoft : C.white) },
          line: { color: C.greyLight, width: 0.5 },
        });
        s.addText(cell, {
          x: xi + 0.15, y, w: colWs[ci] - 0.3, h: rowH,
          align: ci === 0 ? "left" : "center", valign: "middle",
          fontFace: ci === 2 ? FONT_HEAD : FONT_BODY,
          fontSize: ci === 2 ? 14 : 12,
          bold: ci === 2 || ci === 0 || isHighlight,
          color: isHighlight ? C.white : (ci === 2 ? C.navy : C.ink),
        });
        xi += colWs[ci];
      });
    });

    // Includes footer band
    const incY = tableY + rowH * 5 + 0.3;
    s.addShape("rect", { x: tableX, y: incY, w: 12.13, h: 0.7, fill: { color: C.aqua }, line: { color: C.aqua } });
    s.addText(
      [
        { text: "INCLUDES  ", options: { bold: true, color: C.navy, charSpacing: 3 } },
        { text: "Two-day in-person program · all sessions · meals · materials · networking · Stage 1 certification · 6-month cohort access", options: { color: C.navy } },
      ],
      { x: tableX + 0.2, y: incY, w: 11.9, h: 0.7, valign: "middle", fontFace: FONT_COND, fontSize: 11 },
    );

    addFooter(s);
  }

  // ---------- Slide 11 — What {Company} gets back ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, `What ${company} gets back`);
    addTitle(s, `What ${company} gets back`);
    addRule(s);

    s.addText(copy.getback_intro || "", {
      x: 0.6, y: 2.3, w: 12, h: 0.7,
      fontFace: FONT_BODY, fontSize: 13, italic: true, color: C.muted, lineSpacingMultiple: 1.4,
    });

    const cells = [
      { k: "A quality layer across your network",       v: "Trained champions become standard-bearers across regions and business units. They coach peers and close the gap between aspiration and ground-level experience." },
      { k: "Engagement data that survives the C-suite", v: "Measurement architecture built for ESG reporting, talent analytics, and executive dashboards — outcomes, not participation theater." },
      { k: "Reduced champion attrition",                v: "Structured training, a credential, and 6 months of peer support. Retention of trained leaders is itself an ROI story." },
      { k: "Scale with quality, not just reach",        v: "Adding events without improving experience quality produces diminishing returns. Trained champions improve every experience they touch." },
      { k: "Brand perception from the inside",          v: "Employees who undergo genuine prosocial identity change embody the company's commitment. That shows up in Glassdoor, in talent conversations, in how people describe working here." },
      { k: "Peer benchmarking at the right altitude",   v: "Train alongside leaders running comparable programs. The cross-company workshop alone produces more actionable insight than most conferences deliver in three days." },
    ];
    cells.forEach((c, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.25;
      const y = 3.15 + row * 1.85;
      s.addShape("rect", { x, y, w: 4.0, h: 1.7, fill: { color: row === 0 ? C.bgSoft : C.aqua }, line: { color: row === 0 ? C.greyLight : C.aqua, width: 0.5 } });
      s.addShape("rect", { x, y, w: 0.08, h: 1.7, fill: { color: C.orange }, line: { color: C.orange } });
      s.addText(c.k, {
        x: x + 0.25, y: y + 0.15, w: 3.7, h: 0.5,
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C.navy,
      });
      s.addText(c.v, {
        x: x + 0.25, y: y + 0.65, w: 3.7, h: 1.0,
        fontFace: FONT_BODY, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.35,
      });
    });

    addFooter(s);
  }

  // ---------- Slide 12 — Next steps / The ask ----------
  {
    const s = newSlide(C.navy);
    s.addShape("rect", { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.orange }, line: { color: C.orange } });

    s.addText("THE ASK · NEXT STEPS", {
      x: 0.9, y: 0.7, w: 12, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C.orange, charSpacing: 6,
    });
    s.addText(copy.ask_headline || "Approval to send our team", {
      x: 0.9, y: 1.3, w: 12, h: 1.4,
      fontFace: FONT_HEAD, fontSize: 32, bold: true, color: C.white, lineSpacingMultiple: 1.1,
    });
    s.addShape("line", { x: 0.9, y: 2.85, w: 1.0, h: 0, line: { color: C.orange, width: 3 } });
    s.addText(copy.ask_body || "", {
      x: 0.9, y: 3.0, w: 11.5, h: 1.2,
      fontFace: FONT_BODY, fontSize: 14, color: C.aqua, lineSpacingMultiple: 1.4,
    });

    const steps = [
      ["01", "Express interest", "Visit rw-regional-campus.lovable.app and submit the interest form for your preferred campus."],
      ["02", "Talk to us",        "Reach out to Nichole at nichole@realizedworth.com — she'll walk you through everything."],
      ["03", "Reserve your seats","Registration opens soon. Interest form submissions are first in line."],
    ];
    steps.forEach(([n, k, v], i) => {
      const x = 0.9 + i * 4.2;
      const y = 4.5;
      s.addShape("ellipse", { x, y, w: 0.6, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
      s.addText(n, {
        x, y, w: 0.6, h: 0.6,
        align: "center", valign: "middle",
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C.white,
      });
      s.addText(k, {
        x: x + 0.75, y: y - 0.05, w: 3.4, h: 0.4,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C.white,
      });
      s.addText(v, {
        x: x, y: y + 0.75, w: 3.9, h: 1.4,
        fontFace: FONT_BODY, fontSize: 10.5, color: C.aqua, lineSpacingMultiple: 1.4,
      });
    });

    s.addText("rw-regional-campus.lovable.app   ·   nichole@realizedworth.com", {
      x: 0.9, y: H - 0.7, w: 12, h: 0.4,
      fontFace: FONT_COND, fontSize: 11, color: C.aqua, charSpacing: 2,
    });
  }

  // ---------- Slide 13 — References ----------
  {
    const s = newSlide(C.white);
    addEyebrow(s, "References");
    addTitle(s, "Behavioral science citations");
    addRule(s);

    s.addText("Footnote numbers in slide text correspond to entries below.", {
      x: 0.6, y: 2.3, w: 12, h: 0.4,
      fontFace: FONT_BODY, fontSize: 11, italic: true, color: C.muted,
    });

    const half = Math.ceil(CITATIONS.length / 2);
    const colA = CITATIONS.slice(0, half);
    const colB = CITATIONS.slice(half);
    const buildCol = (arr: typeof CITATIONS) =>
      arr.map(c => ([
        { text: `[${c.n}] `, options: { bold: true, color: C.orange } },
        { text: `${c.text}\n`, options: { color: C.ink } },
        { text: `${c.url}\n\n`, options: { color: C.dteal, hyperlink: { url: c.url } } },
      ])).flat();

    s.addText(buildCol(colA), {
      x: 0.6, y: 2.85, w: 6.0, h: 4.0,
      fontFace: FONT_COND, fontSize: 9, lineSpacingMultiple: 1.3,
    });
    s.addText(buildCol(colB), {
      x: 6.9, y: 2.85, w: 6.0, h: 4.0,
      fontFace: FONT_COND, fontSize: 9, lineSpacingMultiple: 1.3,
    });

    addFooter(s);
  }

  return pres;
}

// ======================================================================
// HTML BUILDER — self-contained, dynamic, brand-faithful
// ======================================================================
function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function buildHtml(input: any, copy: any): string {
  const company = escapeHtml(input.company_name);
  const audience = escapeHtml(AUD_LABELS[input.audience_role] || "Leadership");
  const city = escapeHtml(CITY_LABELS[input.preferred_city] || "Campus to be confirmed");
  const seats = escapeHtml(SEAT_LABELS[input.seats_requested] || "Seats TBD");
  const tierIdx = seatToTierIndex(input.seats_requested);
  const presenter = escapeHtml(input.presenter_name || "—");
  const presenterRole = escapeHtml(input.presenter_role || "");
  const decisionMaker = escapeHtml(input.decision_maker || "");
  const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const tiers = [
    ["Individual", "1",  "$2,100",  "$2,100", "—"],
    ["6-Pack",     "6",  "$12,000", "$2,000", "5% off"],
    ["12-Pack",    "12", "$22,800", "$1,900", "10% off"],
    ["18-Pack",    "18", "$32,130", "$1,785", "15% off"],
  ];

  const refsHtml = CITATIONS.map(c =>
    `<li id="ref-${c.n}"><span class="ref-num">[${c.n}]</span> ${escapeHtml(c.text)} <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener">${escapeHtml(c.url)}</a></li>`
  ).join("");

  const fn = (nums: number[]) => nums.map(n => `<a class="fn" href="#ref-${n}">[${n}]</a>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Business Case · ${company} · Realized Worth</title>
<style>
:root {
  --orange: #EC5C2A;
  --navy: #0A3454;
  --navy-deep: #062136;
  --charcoal: #3C3F44;
  --ink: #404040;
  --muted: #6B6B6F;
  --dteal: #4491A9;
  --lteal: #7FB5C2;
  --aqua: #B8D8DC;
  --burgundy: #981C20;
  --bg-soft: #F6F7F8;
  --grey-light: #C2C2C6;
  --white: #FFFFFF;
}
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Roboto+Condensed:wght@400;700&display=swap');
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Roboto', system-ui, sans-serif; color: var(--ink); background: var(--white); line-height: 1.6; -webkit-font-smoothing: antialiased; }
.slide { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; border-bottom: 1px solid var(--grey-light); position: relative; }
.slide.dark { background: var(--navy); color: var(--white); border-bottom: none; }
.slide.soft { background: var(--bg-soft); border-bottom: none; }
.eyebrow { font-family: 'Roboto Condensed', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; color: var(--orange); text-transform: uppercase; margin-bottom: 0.75rem; }
.dark .eyebrow { color: var(--orange); }
h1, h2, h3 { font-family: 'Roboto', sans-serif; color: var(--charcoal); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
.dark h1, .dark h2, .dark h3 { color: var(--white); }
h1 { font-size: 3.5rem; margin: 0 0 1rem; }
h2 { font-size: 2.25rem; margin: 0 0 1.5rem; }
h3 { font-size: 1.25rem; margin: 0 0 0.5rem; }
.rule { width: 60px; height: 4px; background: var(--orange); margin: 1.5rem 0 2.5rem; border: 0; }
p { margin: 0 0 1rem; font-size: 1.0625rem; }
.lead { font-size: 1.25rem; line-height: 1.5; color: var(--charcoal); }
.fn { color: var(--orange); text-decoration: none; font-weight: 700; font-size: 0.85em; vertical-align: super; }
.fn:hover { text-decoration: underline; }

/* Reveal animation */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal.in { opacity: 1; transform: translateY(0); }

/* Cover */
.cover { background: var(--navy); color: var(--white); padding: 6rem 2rem 5rem; position: relative; overflow: hidden; }
.cover::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 8px; background: var(--orange); }
.cover .ring { position: absolute; right: -8rem; top: -8rem; width: 28rem; height: 28rem; border-radius: 50%; border: 2px solid var(--aqua); opacity: 0.4; }
.cover .ring2 { position: absolute; right: -6rem; top: -6rem; width: 22rem; height: 22rem; border-radius: 50%; border: 1px solid var(--dteal); opacity: 0.5; }
.cover .inner { position: relative; max-width: 1200px; margin: 0 auto; }
.cover .tag { color: var(--orange); font-weight: 700; letter-spacing: 0.4em; font-size: 0.875rem; }
.cover .series { color: var(--aqua); font-size: 1.25rem; margin: 0.5rem 0 2.5rem; }
.cover h1 { font-size: 5rem; color: var(--white); margin: 0 0 1rem; }
.cover .subtitle { color: var(--aqua); font-style: italic; font-size: 1.5rem; max-width: 50rem; margin-bottom: 2rem; }
.cover .meta { color: var(--aqua); font-size: 0.95rem; line-height: 1.8; }
.cover .meta strong { color: var(--white); }

/* Two-column layouts */
.two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; }
.pull { background: var(--aqua); border-left: 6px solid var(--orange); padding: 1.75rem; font-style: italic; color: var(--navy); font-size: 1.125rem; line-height: 1.5; }
.pull .label { font-family: 'Roboto Condensed', sans-serif; font-style: normal; font-weight: 700; letter-spacing: 0.25em; font-size: 0.7rem; color: var(--navy); display: block; margin-bottom: 0.75rem; }

/* Flow diagram */
.flow { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin: 2rem 0 3rem; align-items: start; }
.node { background: var(--navy); color: var(--white); padding: 0.9rem 0.5rem; text-align: center; border-radius: 6px; font-weight: 700; font-size: 0.875rem; letter-spacing: 0.15em; }
.node.missing { background: var(--white); color: var(--burgundy); border: 2px dashed var(--burgundy); animation: pulse 2.5s ease-in-out infinite; }
.node-wrap .miss-label { display: block; text-align: center; font-family: 'Roboto Condensed', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; color: var(--burgundy); margin-top: 0.4rem; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(152,28,32,0.4); } 50% { box-shadow: 0 0 0 8px rgba(152,28,32,0); } }
.three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.three-col .col-eyebrow { font-family: 'Roboto Condensed', sans-serif; font-weight: 700; letter-spacing: 0.25em; color: var(--orange); font-size: 0.75rem; margin-bottom: 0.5rem; }
.three-col h3 { color: var(--navy); }

/* Cards */
.cards-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
.card { background: var(--bg-soft); border: 1px solid var(--grey-light); border-radius: 8px; padding: 1.5rem; }
.card .num { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--orange); color: var(--white); font-weight: 700; margin-bottom: 1rem; }
.card h3 { color: var(--navy); font-size: 1.0625rem; }
.card p { font-size: 0.9375rem; line-height: 1.5; color: var(--ink); margin: 0.5rem 0 0; }

/* Champion rows */
.champ-rows { display: flex; flex-direction: column; gap: 1.5rem; }
.champ-rows .row { display: grid; grid-template-columns: 3rem 1fr; gap: 1.25rem; align-items: start; }
.champ-rows .row .num { width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--orange); color: var(--white); display: flex; align-items: center; justify-content: center; font-weight: 700; }
.champ-rows .row h3 { color: var(--navy); margin-bottom: 0.25rem; }

/* For the X cards */
.tri-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.tri-card { background: var(--white); border: 1px solid var(--grey-light); border-radius: 8px; padding: 1.5rem; }
.tri-card .ring { width: 2rem; height: 2rem; background: var(--aqua); border-radius: 50%; position: relative; margin-bottom: 1.25rem; }
.tri-card .ring::after { content: ''; position: absolute; inset: 0.4rem; background: var(--orange); border-radius: 50%; }
.tri-card .col-eyebrow { font-family: 'Roboto Condensed', sans-serif; font-weight: 700; letter-spacing: 0.25em; color: var(--orange); font-size: 0.7rem; }
.tri-card h3 { color: var(--navy); margin: 0.5rem 0 0.75rem; }

/* Ripple chart */
.ripple-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: stretch; }
.chart-frame { background: var(--bg-soft); border: 1px solid var(--grey-light); border-radius: 8px; padding: 1.5rem; }
.chart-title { font-family: 'Roboto Condensed', sans-serif; font-weight: 700; letter-spacing: 0.25em; color: var(--orange); font-size: 0.75rem; margin-bottom: 1rem; }
.bars { display: flex; gap: 1.25rem; align-items: flex-end; height: 240px; padding: 0 0.5rem; border-bottom: 1px solid var(--grey-light); }
.bar-group { flex: 1; display: flex; gap: 0.5rem; align-items: flex-end; height: 100%; position: relative; }
.bar { flex: 1; transition: height 1.4s cubic-bezier(0.2,0.8,0.2,1); position: relative; }
.bar.untrained { background: var(--lteal); }
.bar.trained { background: var(--orange); }
.bar .v { position: absolute; top: -1.5rem; left: 0; right: 0; text-align: center; font-weight: 700; color: var(--orange); font-family: 'Roboto Condensed', sans-serif; font-size: 0.875rem; }
.bar-labels { display: flex; gap: 1.25rem; padding-top: 0.5rem; }
.bar-labels span { flex: 1; text-align: center; font-family: 'Roboto Condensed', sans-serif; font-weight: 700; color: var(--navy); font-size: 0.875rem; }
.legend { display: flex; gap: 1.5rem; margin-top: 1rem; font-family: 'Roboto Condensed', sans-serif; font-size: 0.8rem; color: var(--muted); }
.legend i { display: inline-block; width: 0.875rem; height: 0.875rem; margin-right: 0.4rem; vertical-align: -2px; }
.legend i.ut { background: var(--lteal); }
.legend i.tr { background: var(--orange); }

/* Agenda */
.agenda { display: flex; flex-direction: column; gap: 1.25rem; }
.day { display: grid; grid-template-columns: 9rem 1fr 1fr 1fr; gap: 1rem; }
.day .label { background: var(--navy); color: var(--white); padding: 1.25rem; text-align: center; border-radius: 6px; }
.day .label .d { font-weight: 700; color: var(--orange); letter-spacing: 0.3em; font-size: 0.95rem; }
.day .label .t { font-style: italic; color: var(--aqua); font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.35; }
.day .block { background: var(--white); border: 1px solid var(--grey-light); border-radius: 6px; padding: 1.25rem; }
.day .block .time { font-family: 'Roboto Condensed', sans-serif; font-weight: 700; letter-spacing: 0.2em; color: var(--orange); font-size: 0.7rem; margin-bottom: 0.5rem; }
.day .block h4 { margin: 0 0 0.4rem; color: var(--navy); font-size: 0.95rem; }
.day .block p { font-size: 0.85rem; color: var(--ink); margin: 0; line-height: 1.45; }

/* Credential */
.cred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.cred-card { padding: 2rem; border-radius: 8px; color: var(--white); }
.cred-card.s1 { background: var(--orange); }
.cred-card.s2 { background: var(--navy); }
.cred-card .stage-label { font-family: 'Roboto Condensed', sans-serif; font-weight: 700; letter-spacing: 0.3em; font-size: 0.8rem; opacity: 0.95; }
.cred-card h3 { color: var(--white); font-size: 1.5rem; margin: 0.5rem 0 1rem; }

/* Pricing table */
.price-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.price-table th { background: var(--navy); color: var(--white); padding: 0.875rem 1rem; text-align: left; font-family: 'Roboto Condensed', sans-serif; letter-spacing: 0.2em; font-size: 0.8rem; }
.price-table th:not(:first-child) { text-align: center; }
.price-table td { padding: 1rem; border-bottom: 1px solid var(--grey-light); transition: background 0.2s; }
.price-table td:not(:first-child) { text-align: center; }
.price-table td.total { font-weight: 700; color: var(--navy); font-size: 1.125rem; font-family: 'Roboto', sans-serif; }
.price-table tr:nth-child(even) td { background: var(--bg-soft); }
.price-table tr.highlight td { background: var(--orange) !important; color: var(--white); font-weight: 700; }
.price-table tr.highlight td.total { color: var(--white); }
.price-table tr:hover td:not(.highlight td) { background: var(--aqua); }
.includes { background: var(--aqua); color: var(--navy); padding: 1rem 1.25rem; border-radius: 6px; font-size: 0.9375rem; }
.includes strong { font-family: 'Roboto Condensed', sans-serif; letter-spacing: 0.2em; margin-right: 0.5rem; }

/* Get back grid */
.get-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.get-cell { padding: 1.25rem; border-radius: 6px; border-left: 4px solid var(--orange); position: relative; }
.get-cell.a { background: var(--bg-soft); }
.get-cell.b { background: var(--aqua); }
.get-cell h4 { margin: 0 0 0.5rem; color: var(--navy); font-size: 1rem; }
.get-cell p { font-size: 0.875rem; margin: 0; line-height: 1.5; }

/* Ask */
.ask-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
.ask-step .num { width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--orange); color: var(--white); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 0.75rem; }
.ask-step h4 { color: var(--white); margin: 0 0 0.5rem; font-size: 1.0625rem; }
.ask-step p { color: var(--aqua); font-size: 0.9375rem; margin: 0; }
.ask-foot { color: var(--aqua); margin-top: 3rem; font-family: 'Roboto Condensed', sans-serif; letter-spacing: 0.1em; }

/* References */
.refs { columns: 2; column-gap: 2.5rem; list-style: none; padding: 0; margin: 1.5rem 0 0; }
.refs li { font-family: 'Roboto Condensed', sans-serif; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; break-inside: avoid; color: var(--ink); }
.refs .ref-num { color: var(--orange); font-weight: 700; margin-right: 0.25rem; }
.refs a { color: var(--dteal); word-break: break-all; }
.refs li:target { background: var(--aqua); padding: 0.5rem; border-radius: 4px; }

/* Footer strip */
.footstrip { font-family: 'Roboto Condensed', sans-serif; font-size: 0.75rem; color: var(--muted); border-top: 1px solid var(--orange); padding-top: 1rem; margin-top: 3rem; display: flex; justify-content: space-between; letter-spacing: 0.1em; }

/* Print */
@media print {
  .slide { page-break-after: always; padding: 2rem; }
  .reveal { opacity: 1; transform: none; }
  .cover { padding: 3rem 2rem; }
  .cover h1 { font-size: 3rem; }
  body { font-size: 11pt; }
}

@media (max-width: 900px) {
  .two-col, .ripple-grid, .cred-grid { grid-template-columns: 1fr; }
  .three-col, .tri-cards, .get-grid, .ask-grid { grid-template-columns: 1fr; }
  .cards-4 { grid-template-columns: 1fr 1fr; }
  .day { grid-template-columns: 1fr; }
  .flow { grid-template-columns: repeat(5, minmax(0,1fr)); }
  .cover h1 { font-size: 3rem; }
  h1 { font-size: 2.25rem; } h2 { font-size: 1.75rem; }
  .refs { columns: 1; }
}
</style>
</head>
<body>

<!-- COVER -->
<section class="slide cover">
  <div class="ring"></div><div class="ring2"></div>
  <div class="inner">
    <div class="tag">BUSINESS CASE</div>
    <div class="series">Regional Campus Series</div>
    <h1>${company}</h1>
    <p class="subtitle">${escapeHtml(copy.cover_subtitle || "A proposal prepared for your direct manager.")}</p>
    <div style="width: 60px; height: 4px; background: var(--orange); margin: 2rem 0;"></div>
    <div class="meta">
      Prepared by <strong>${presenter}${presenterRole ? `, ${presenterRole}` : ""}</strong><br/>
      For <strong>${audience}${decisionMaker ? ` · ${decisionMaker}` : ""}</strong><br/>
      ${city}  ·  ${seats}  ·  ${date}
    </div>
  </div>
</section>

<!-- 2 — WHERE COMPANY IS NOW -->
<section class="slide reveal">
  <div class="eyebrow">Where ${company} is now</div>
  <h2>Where ${company} is now</h2><hr class="rule" />
  <div class="two-col">
    <div><p class="lead">${escapeHtml(copy.situation_paragraph || "")}</p></div>
    <aside class="pull">
      <span class="label">THE READ</span>
      ${escapeHtml(copy.situation_pullquote || "")}
    </aside>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>2</span></div>
</section>

<!-- 3 — STRUCTURAL GAP -->
<section class="slide soft reveal">
  <div class="eyebrow">The structural gap</div>
  <h2>Why most volunteer programs produce activity, not change</h2><hr class="rule" />
  <div class="flow">
    <div class="node-wrap"><div class="node">RECRUIT</div></div>
    <div class="node-wrap"><div class="node missing">BRIEF</div><span class="miss-label">MISSING</span></div>
    <div class="node-wrap"><div class="node">EXPERIENCE</div></div>
    <div class="node-wrap"><div class="node missing">DEBRIEF</div><span class="miss-label">MISSING</span></div>
    <div class="node-wrap"><div class="node">RETURN</div></div>
  </div>
  <div class="three-col">
    <div>
      <div class="col-eyebrow">BEFORE</div>
      <h3>Without a brief</h3>
      <p>Volunteers arrive in task mode. The part of the brain that processes others as fully human ${fn([1])} never activates.</p>
    </div>
    <div>
      <div class="col-eyebrow">DURING</div>
      <h3>Without a guide</h3>
      <p>First-timers and veterans get the same assignment. The experience is pleasant but flat. Nobody calibrates challenge to contribution.</p>
    </div>
    <div>
      <div class="col-eyebrow">AFTER</div>
      <h3>Without a debrief</h3>
      <p>The 0–40 minute consolidation window ${fn([2])} closes. Champions burn out — repeated exposure without structured processing activates pain-sharing rather than compassion ${fn([3])}.</p>
    </div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>3</span></div>
</section>

<!-- 4 — IMMERSIVE LEARNING -->
<section class="slide reveal">
  <div class="eyebrow">How adults change practice</div>
  <h2>Why immersive learning changes practice, not just knowledge</h2><hr class="rule" />
  <div class="cards-4">
    <div class="card"><div class="num">01</div><h3>Practice, not lecture</h3><p>Participants conduct real Briefs and Debriefs with live volunteers. Skill acquisition requires doing, not watching. ${fn([9])}</p></div>
    <div class="card"><div class="num">02</div><h3>Disorienting dilemma</h3><p>A live nonprofit experience challenges assumptions about who needs help and why. The gap between expectation and reality is the learning. ${fn([4])}</p></div>
    <div class="card"><div class="num">03</div><h3>40-minute debrief window</h3><p>Structured reflection inside the memory consolidation window. A neurological design requirement, not a scheduling preference. ${fn([2])}</p></div>
    <div class="card"><div class="num">04</div><h3>Cohort identity</h3><p>Cross-company peer group continues for 6 months. Shared identity amplifies behavioral commitment to the new practice. ${fn([6, 8])}</p></div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>4</span></div>
</section>

<!-- 5 — CHAMPIONS -->
<section class="slide reveal">
  <div class="eyebrow">What trained champions do at ${company}</div>
  <h2>What trained champions do differently at ${company}</h2><hr class="rule" />
  <p class="lead" style="color: var(--muted); font-style: italic; margin-bottom: 2rem;">${escapeHtml(copy.champions_intro || "")}</p>
  <div class="champ-rows">
    <div class="row"><div class="num">01</div><div><h3>They change how colleagues show up</h3><p>A 5-minute brief reactivates the part of the brain that processes others as fully human ${fn([1])}. Volunteers contribute at a higher level and come back. Direct beneficiary contact durably increases effort for over a month ${fn([10])}.</p></div></div>
    <div class="row"><div class="num">02</div><div><h3>They build real nonprofit partnerships</h3><p>Trained champions scope projects WITH partners, not FOR them. They frame the experience so volunteers encounter the work as partners — meeting the conditions for positive intergroup contact ${fn([11, 12])}.</p></div></div>
    <div class="row"><div class="num">03</div><div><h3>They turn a good day into a lasting shift</h3><p>A structured debrief within 40 minutes ${fn([2])} uses the gap between expectation and reality ${fn([4])} as the mechanism for prosocial identity change ${fn([5])} — a shift in how someone understands themselves.</p></div></div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>5</span></div>
</section>

<!-- 6 — TRI -->
<section class="slide soft reveal">
  <div class="eyebrow">Three audiences, three outcomes</div>
  <h2>What changes for the employee, the company, and the community</h2><hr class="rule" />
  <div class="tri-cards">
    <div class="tri-card"><div class="ring"></div><div class="col-eyebrow">FOR THE EMPLOYEE</div><h3>The person who attends</h3><p>Prosocial identity change ${fn([5])} generalizes across life domains ${fn([13])}. Employees move from "I did a good thing" to "this is part of who I am". The shift persists because it is identity-level, not task-level.</p></div>
    <div class="tri-card"><div class="ring"></div><div class="col-eyebrow">FOR THE COMPANY</div><h3>The organization that invests</h3><p>When prosocial identity is supported by the employer, the company becomes associated with that part of the self-concept ${fn([6])}. Brand perception built on internalized identity is qualitatively different from perception built on messaging.</p></div>
    <div class="tri-card"><div class="ring"></div><div class="col-eyebrow">FOR THE COMMUNITY</div><h3>The nonprofits served</h3><p>Projects scoped around actual need ${fn([11])}. Volunteers oriented toward the work. Reciprocal, recurring relationships ${fn([12])} that produce sustained connection rather than photo opportunities.</p></div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>6</span></div>
</section>

<!-- 7 — RIPPLE -->
<section class="slide reveal">
  <div class="eyebrow">Ripple effect at scale</div>
  <h2>${escapeHtml(copy.ripple_headline || `From a small group to a shift in how ${company} volunteers`)}</h2><hr class="rule" />
  <div class="ripple-grid">
    <div><p class="lead">${escapeHtml(copy.ripple_body || "")}</p></div>
    <div class="chart-frame">
      <div class="chart-title">EVENTS TOUCHED PER YEAR</div>
      <div class="bars" id="bars">
        <div class="bar-group"><div class="bar untrained" data-h="11"><span class="v">30</span></div><div class="bar trained" data-h="22"><span class="v">180</span></div></div>
        <div class="bar-group"><div class="bar untrained" data-h="22"><span class="v">60</span></div><div class="bar trained" data-h="52"><span class="v">420</span></div></div>
        <div class="bar-group"><div class="bar untrained" data-h="33"><span class="v">90</span></div><div class="bar trained" data-h="90"><span class="v">720</span></div></div>
      </div>
      <div class="bar-labels"><span>6-pack</span><span>12-pack</span><span>18-pack</span></div>
      <div class="legend"><span><i class="ut"></i>Untrained champion</span><span><i class="tr"></i>Trained champion</span></div>
    </div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>7</span></div>
</section>

<!-- 8 — AGENDA -->
<section class="slide soft reveal">
  <div class="eyebrow">The campus</div>
  <h2>Two days, designed end-to-end</h2><hr class="rule" />
  <div class="agenda">
    <div class="day">
      <div class="label"><div class="d">DAY 1</div><div class="t">Brief, experience, debrief — live</div></div>
      <div class="block"><div class="time">MORNING</div><h4>Brief masterclass</h4><p>Frame, connect, set conditions for transformation.</p></div>
      <div class="block"><div class="time">MIDDAY</div><h4>Live nonprofit experience</h4><p>Real volunteer work with a partner organization.</p></div>
      <div class="block"><div class="time">AFTERNOON</div><h4>40-minute debrief</h4><p>Structured reflection in the consolidation window.</p></div>
    </div>
    <div class="day">
      <div class="label"><div class="d">DAY 2</div><div class="t">Design, practice, commit</div></div>
      <div class="block"><div class="time">MORNING</div><h4>Design workshop</h4><p>Build experiences for your own program, with peers.</p></div>
      <div class="block"><div class="time">MIDDAY</div><h4>Practice rounds</h4><p>Conduct briefs and debriefs with feedback.</p></div>
      <div class="block"><div class="time">AFTERNOON</div><h4>Cohort commitments</h4><p>6-month implementation plan + peer pairing.</p></div>
    </div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>8</span></div>
</section>

<!-- 9 — CREDENTIAL -->
<section class="slide reveal">
  <div class="eyebrow">The credential</div>
  <h2>A recognized professional development track</h2><hr class="rule" />
  <div class="cred-grid">
    <div class="cred-card s1"><div class="stage-label">STAGE 1</div><h3>Certificate of Completion</h3><p>Awarded after the two-day campus. Validates competency in the three keystone behaviors: conducting the Brief, guiding the experience, and conducting the Debrief — trainable, repeatable facilitation skills grounded in behavioral science ${fn([1, 4, 5])}. Included in registration.</p></div>
    <div class="cred-card s2"><div class="stage-label">STAGE 2 · OPTIONAL</div><h3>Certified Transformative Volunteering Leader</h3><p>Awarded after the 6-month cohort, sustained implementation, and competency verification. Complex prosocial behaviors require repeated, spaced practice to reach automaticity ${fn([17, 18])}. The cohort provides that structure.</p></div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>9</span></div>
</section>

<!-- 10 — INVESTMENT -->
<section class="slide reveal">
  <div class="eyebrow">Investment</div>
  <h2>Pricing for the 2026 cohort</h2><hr class="rule" />
  <p style="color: var(--dteal); font-family: 'Roboto Condensed', sans-serif; letter-spacing: 0.1em;">Campus: ${city}</p>
  <table class="price-table">
    <thead><tr><th>TIER</th><th>SEATS</th><th>TOTAL</th><th>PER SEAT</th><th>SAVINGS</th></tr></thead>
    <tbody>
      ${tiers.map((r, i) => `<tr class="${i === tierIdx ? "highlight" : ""}"><td>${r[0]}</td><td>${r[1]}</td><td class="total">${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}
    </tbody>
  </table>
  <div class="includes"><strong>INCLUDES</strong>Two-day in-person program · all sessions · meals · materials · networking · Stage 1 certification · 6-month cohort access</div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>10</span></div>
</section>

<!-- 11 — GET BACK -->
<section class="slide soft reveal">
  <div class="eyebrow">What ${company} gets back</div>
  <h2>What ${company} gets back</h2><hr class="rule" />
  <p class="lead" style="color: var(--muted); font-style: italic; margin-bottom: 2rem;">${escapeHtml(copy.getback_intro || "")}</p>
  <div class="get-grid">
    <div class="get-cell a"><h4>A quality layer across your network</h4><p>Trained champions become standard-bearers across regions and business units. They coach peers and close the gap between aspiration and ground-level experience.</p></div>
    <div class="get-cell a"><h4>Engagement data that survives the C-suite</h4><p>Measurement architecture built for ESG reporting, talent analytics, and executive dashboards — outcomes, not participation theater.</p></div>
    <div class="get-cell a"><h4>Reduced champion attrition</h4><p>Structured training, a credential, and 6 months of peer support. Retention of trained leaders is itself an ROI story.</p></div>
    <div class="get-cell b"><h4>Scale with quality, not just reach</h4><p>Adding events without improving experience quality produces diminishing returns. Trained champions improve every experience they touch.</p></div>
    <div class="get-cell b"><h4>Brand perception from the inside</h4><p>Employees who undergo genuine prosocial identity change embody the company's commitment. That shows up in Glassdoor, in talent conversations, in how people describe working here.</p></div>
    <div class="get-cell b"><h4>Peer benchmarking at the right altitude</h4><p>Train alongside leaders running comparable programs. The cross-company workshop alone produces more actionable insight than most conferences deliver in three days.</p></div>
  </div>
  <div class="footstrip"><span>Realized Worth · Regional Campus Series</span><span>11</span></div>
</section>

<!-- 12 — ASK -->
<section class="slide dark reveal" style="background: var(--navy); position: relative;">
  <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--orange);"></div>
  <div class="eyebrow">The ask · Next steps</div>
  <h2>${escapeHtml(copy.ask_headline || "Approval to send our team")}</h2><hr class="rule" />
  <p class="lead" style="color: var(--aqua);">${escapeHtml(copy.ask_body || "")}</p>
  <div class="ask-grid">
    <div class="ask-step"><div class="num">01</div><h4>Express interest</h4><p>Visit rw-regional-campus.lovable.app and submit the interest form for your preferred campus.</p></div>
    <div class="ask-step"><div class="num">02</div><h4>Talk to us</h4><p>Reach out to Nichole at <a href="mailto:nichole@realizedworth.com" style="color: var(--white);">nichole@realizedworth.com</a> — she'll walk you through everything.</p></div>
    <div class="ask-step"><div class="num">03</div><h4>Reserve your seats</h4><p>Registration opens soon. Interest form submissions are first in line.</p></div>
  </div>
  <div class="ask-foot">rw-regional-campus.lovable.app   ·   nichole@realizedworth.com</div>
</section>

<!-- 13 — REFERENCES -->
<section class="slide reveal">
  <div class="eyebrow">References</div>
  <h2>Behavioral science citations</h2><hr class="rule" />
  <p style="color: var(--muted); font-style: italic;">Footnote numbers in the slide text correspond to entries below.</p>
  <ol class="refs">${refsHtml}</ol>
</section>

<script>
(function(){
  // Reveal on scroll
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  // Animate bars
  var bars = document.getElementById("bars");
  if (bars) {
    var bIo = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          bars.querySelectorAll(".bar").forEach(function(bar){
            var h = bar.getAttribute("data-h");
            bar.style.height = h + "%";
          });
          bIo.disconnect();
        }
      });
    }, { threshold: 0.3 });
    bars.querySelectorAll(".bar").forEach(function(bar){ bar.style.height = "0%"; });
    bIo.observe(bars);
  }
})();
</script>
</body>
</html>`;
}

// ======================================================================
// Handler
// ======================================================================
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
      const company = input.company_name;
      copy = {
        cover_subtitle: "A proposal prepared for your direct manager.",
        situation_paragraph: `${company} runs volunteer activity at scale. The structure exists; the question is whether the current approach produces the depth of engagement and quality of outcomes that justify continued investment at this level.`,
        situation_pullquote: `The challenge ${company} is navigating is a symptom of a program that has outgrown its design.`,
        champions_intro: `At ${company}'s scale, trained champions become the difference between activity reported and culture changed. Three behaviors carry the program.`,
        ripple_headline: `From a small group of trained leaders to a shift in how ${company} volunteers`,
        ripple_body: `At scale, the difference between a good program and a great one is whether the people running events are coordinators or facilitators. A small cohort of trained champions ripples through every regional event they touch — and trains the next layer.`,
        getback_intro: `Six things ${company} gets back from sending a cohort to the campus — sequenced for your audience.`,
        ask_headline: "Approval to send our team to the Realized Worth campus",
        ask_body: input.primary_ask || "Sponsorship to send our champions to the campus, plus the time off-site to attend. We bring back trained facilitators, a 6-month cohort, and a measurement approach that holds up to scrutiny.",
      };
    }

    const safeCompany = String(input.company_name).replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 40);

    // Build PPTX
    const pres = buildDeck(input, copy);
    const pptxBase64 = await pres.write({ outputType: "base64" });
    const pptxFilename = `RW_Business_Case_${safeCompany}.pptx`;

    // Build HTML
    const html = buildHtml(input, copy);
    const htmlBase64 = btoa(unescape(encodeURIComponent(html)));
    const htmlFilename = `RW_Business_Case_${safeCompany}.html`;

    return new Response(
      JSON.stringify({
        pptx: { filename: pptxFilename, base64: pptxBase64 },
        html: { filename: htmlFilename, base64: htmlBase64 },
        // Backward-compatible fields:
        filename: pptxFilename,
        base64: pptxBase64,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-deck error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
