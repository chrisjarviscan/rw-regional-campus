// Public edge function: researches a company via Lovable AI Gateway
// Returns CompanyResearch JSON. No auth required.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

const SYSTEM_PROMPT = `You are a research assistant for Realized Worth. Given a company name, you return structured information about that company's corporate volunteering program, CSR/ESG reporting, social impact posture, and the named senior officers who could approve a learning investment.

CRITICAL RULES:
- Use null (or empty array) for any field you cannot confirm from training knowledge of well-known public sources. NEVER fabricate values, URLs, partners, statistics, or named people.
- Confidence scale: "high" = found in widely-reported official company sources; "medium" = credible third-party sources; "low" = inferred from indirect signals; "none" = nothing found.
- Keep every string under 120 characters.
- Arrays max 6 items each.
- Only include URLs you are confident actually exist (company .com domains, well-known publications, the company's CSR/ESG report). If you cannot recall the exact URL, leave source_url null.
- Prefer null over guessing. A confident "I don't know" is more useful than a wrong answer.
- For key_people: only name people you are confident currently hold the role. If the officeholder has changed recently or you are unsure, return name as null with confidence "low" or "none". Never invent names.
- For program_facts: every numeric or named claim (hours, participation rate, headcount, partners, age of program) must be paired with a source_url to where that fact is published, or source_url null with confidence "low". No unsourced numbers.`;

const RESEARCH_TOOL = {
  type: "function" as const,
  function: {
    name: "return_company_research",
    description: "Return structured research findings about the company.",
    parameters: {
      type: "object",
      properties: {
        company_name: { type: "string" },
        has_volunteer_program: { type: ["boolean", "null"] },
        program_name: { type: ["string", "null"] },
        program_age_years: { type: ["number", "null"] },
        has_champions_or_ambassadors: { type: ["boolean", "null"] },
        champion_count_estimate: { type: ["string", "null"] },
        employee_count_estimate: { type: ["string", "null"] },
        geographic_scope: { type: ["string", "null"] },
        volunteer_participation_rate: { type: ["string", "null"] },
        csr_report_url: { type: ["string", "null"] },
        esg_framework: { type: ["string", "null"] },
        stated_social_impact_goals: { type: "array", items: { type: "string" }, maxItems: 5 },
        volunteer_hours_reported: { type: ["string", "null"] },
        signature_nonprofit_partners: { type: "array", items: { type: "string" }, maxItems: 5 },
        cause_areas: { type: "array", items: { type: "string" }, maxItems: 5 },
        values_or_mission_keywords: { type: "array", items: { type: "string" }, maxItems: 5 },
        recent_csr_news: { type: ["string", "null"] },
        key_people: {
          type: "array",
          description: "Named senior officers who could approve a learning investment. Include only people you can confidently name as currently in role. Roles to attempt: CEO, CHRO/Chief People Officer, CFO, Chief CSR/Sustainability/Impact Officer, Head of Talent Development, Head of Employee Experience.",
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              role: { type: "string", description: "The role title, e.g. 'CHRO', 'Chief People Officer'." },
              name: { type: ["string", "null"], description: "Full name if confident; otherwise null." },
              source_url: { type: ["string", "null"], description: "URL to where this person is named (company leadership page, recent press release, LinkedIn at the company). Null if unsure." },
              confidence: { type: "string", enum: ["high", "medium", "low", "none"] },
            },
            required: ["role", "name", "source_url", "confidence"],
            additionalProperties: false,
          },
        },
        program_facts: {
          type: "array",
          description: "Every specific numeric or named claim about the program (hours, participation rate, headcount, partner counts, program age) must be listed here with a source URL. If the source URL is unknown, set source_url to null and confidence to 'low'. No unsourced numbers should ever appear in any other field.",
          maxItems: 8,
          items: {
            type: "object",
            properties: {
              label: { type: "string", description: "Plain English label, e.g. 'volunteer hours served (cumulative)'." },
              value: { type: "string", description: "The value as published, e.g. 'over 8 million hours' or '~50% participation'." },
              source_url: { type: ["string", "null"], description: "URL where this fact is published (company report, official page, reputable third-party). Null if not certain." },
              year: { type: ["string", "null"], description: "Year of the cited figure, e.g. '2024'." },
              confidence: { type: "string", enum: ["high", "medium", "low", "none"] },
            },
            required: ["label", "value", "source_url", "year", "confidence"],
            additionalProperties: false,
          },
        },
        confidence: {
          type: "object",
          properties: {
            program_details: { type: "string", enum: ["high", "medium", "low", "none"] },
            scale_data: { type: "string", enum: ["high", "medium", "low", "none"] },
            csr_context: { type: "string", enum: ["high", "medium", "low", "none"] },
            key_people: { type: "string", enum: ["high", "medium", "low", "none"] },
          },
          required: ["program_details", "scale_data", "csr_context", "key_people"],
          additionalProperties: false,
        },
        sources: { type: "array", items: { type: "string" }, maxItems: 6 },
      },
      required: [
        "company_name", "has_volunteer_program", "program_name", "program_age_years",
        "has_champions_or_ambassadors", "champion_count_estimate", "employee_count_estimate",
        "geographic_scope", "volunteer_participation_rate", "csr_report_url", "esg_framework",
        "stated_social_impact_goals", "volunteer_hours_reported", "signature_nonprofit_partners",
        "cause_areas", "values_or_mission_keywords", "recent_csr_news", "key_people",
        "program_facts", "confidence", "sources",
      ],
      additionalProperties: false,
    },
  },
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return json(500, { error: "AI not configured" });

  let payload: { company_name?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const raw = typeof payload.company_name === "string" ? payload.company_name.trim() : "";
  if (raw.length < 2 || raw.length > 120) {
    return json(400, { error: "company_name must be 2–120 characters" });
  }

  try {
    const aiResp = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Research the company "${raw}" and call return_company_research with structured findings.` },
        ],
        tools: [RESEARCH_TOOL],
        tool_choice: { type: "function", function: { name: "return_company_research" } },
      }),
    });

    if (aiResp.status === 429) {
      return json(429, { error: "Too many requests. Please try again in a minute." });
    }
    if (aiResp.status === 402) {
      return json(402, { error: "AI credits exhausted. Please contact the site owner." });
    }
    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Gateway error:", aiResp.status, errText);
      return json(502, { error: "Research service unavailable" });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data).slice(0, 500));
      return json(502, { error: "No structured result returned" });
    }

    let research: Record<string, unknown>;
    try {
      research = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Tool args parse failure:", e, toolCall.function.arguments);
      return json(502, { error: "Could not parse research" });
    }

    research.researched_at = new Date().toISOString();
    return json(200, research);
  } catch (e) {
    console.error("research-company error:", e);
    return json(500, { error: "Internal error" });
  }
});
