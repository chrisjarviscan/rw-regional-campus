// Public edge function: researches a company via Lovable AI Gateway
// Returns CompanyResearch JSON. No auth required.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

const SYSTEM_PROMPT = `You are a research assistant for the RW Institute. Given a company name, you return structured information about that company's corporate volunteering program, CSR/ESG reporting, and social impact posture.

CRITICAL RULES:
- Use null for any field you cannot confirm from training knowledge of well-known public sources. NEVER fabricate values, URLs, partners, or statistics.
- Confidence scale: "high" = found in widely-reported official company sources; "medium" = credible third-party sources; "low" = inferred from indirect signals; "none" = nothing found.
- Keep every string under 100 characters.
- Arrays max 5 items each.
- Only include URLs you are confident actually exist. If uncertain, return an empty sources array.
- Prefer null over guessing. A confident "I don't know" is more useful than a wrong answer.`;

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
        confidence: {
          type: "object",
          properties: {
            program_details: { type: "string", enum: ["high", "medium", "low", "none"] },
            scale_data: { type: "string", enum: ["high", "medium", "low", "none"] },
            csr_context: { type: "string", enum: ["high", "medium", "low", "none"] },
          },
          required: ["program_details", "scale_data", "csr_context"],
          additionalProperties: false,
        },
        sources: { type: "array", items: { type: "string" }, maxItems: 5 },
      },
      required: [
        "company_name", "has_volunteer_program", "program_name", "program_age_years",
        "has_champions_or_ambassadors", "champion_count_estimate", "employee_count_estimate",
        "geographic_scope", "volunteer_participation_rate", "csr_report_url", "esg_framework",
        "stated_social_impact_goals", "volunteer_hours_reported", "signature_nonprofit_partners",
        "cause_areas", "values_or_mission_keywords", "recent_csr_news", "confidence", "sources",
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
