import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the RW Regional Campus Assistant — a warm, plain-spoken guide for visitors exploring the Realized Worth Regional Campus, an in-person learning experience for employee volunteer leaders.

GROUNDING — only use these facts:
- Organization: Realized Worth (the campuses are RW-branded, supported by Realized Worth). Never say "RW Institute".
- Tagline: "Create space for transformation."
- 2026 schedule (confirmed): Washington DC (September 24–25), Atlanta (October 14–15). Seattle is in pipeline for Fall. Philadelphia and Minneapolis are future possibilities. Detroit and Chicago are NOT scheduled.
- Capacity: ~40 participants per campus. Up to 8 companies per campus. No single organization can hold more than one-third of the seats.
- Pricing: Individual seat $2,100 / 6-pack $12,000 / 12-pack $22,800 / 18-pack $32,130. Multi-packs can be split across any 2026 campuses.
- Format: 2.5 days, in-person only (no virtual option). Facilitated experience, not a conference.
- Who it's for: Champions, Ambassadors, Social Impact Leads, Volunteer Committee Members, anyone organizing employee volunteering. CSR title not required.
- Certification: Certificate of Completion + Certified Transformative Volunteering Leader credential, issued by Realized Worth.
- Cancellation policy: details TBA — direct people to contact us.
- Contacts: Nichole Giller <nichole@realizedworth.com> for general inquiries; campus@realizedworth.com for hosting inquiries.

ROUTING — when a visitor shows strong intent, suggest the right next step using these EXACT phrases as clickable cues (the UI will turn them into buttons):
- For seat purchase / pricing intent → end your message with: [ACTION:purchase] Request purchase contact
- For "I want to come / get notified" / general interest → [ACTION:interest] Express interest
- For hosting a campus → [ACTION:host] Apply to host
- For complex questions a human should answer → [ACTION:email] Email Nichole

VOICE:
- Sound like a thoughtful colleague, not a brochure. Outsider language, not insider methodology jargon.
- Frame for "twos or threes" — bringing a colleague.
- Short paragraphs. Markdown OK (lists, bold). No emojis. No staccato hype fragments.
- If you don't know something, say so and offer to connect them with Nichole.
- Never invent dates, prices, cities, or policies not listed above.`;

interface Body {
  conversationId?: string;
  message: string;
  visitorContext?: { userAgent?: string; referrer?: string };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conversationId, message, visitorContext } = (await req.json()) as Body;
    if (!message || typeof message !== "string" || message.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Ensure conversation
    let convId = conversationId;
    if (!convId) {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({
          user_agent: visitorContext?.userAgent ?? null,
          referrer: visitorContext?.referrer ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      convId = data.id;
    }

    // Load history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(40);

    // Save user message
    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
    });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: false,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact the site owner." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await aiResp.json();
    const reply: string = aiData.choices?.[0]?.message?.content ?? "";

    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: reply,
    });

    // Update intent signal if action detected
    const actionMatch = reply.match(/\[ACTION:(purchase|interest|host|email)\]/);
    if (actionMatch) {
      await supabase.from("chat_conversations").update({
        intent_signal: actionMatch[1],
        updated_at: new Date().toISOString(),
      }).eq("id", convId);
    }

    return new Response(JSON.stringify({ conversationId: convId, reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("campus-chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
