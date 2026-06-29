import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "./AnimatedSection";

interface CampusAssistantProps {
  onExpressInterest: () => void;
}

type Msg = { role: "user" | "assistant"; content: string };

const ACTION_LABELS: Record<string, string> = {
  purchase: "Request purchase contact",
  interest: "Express interest",
  host: "Apply to host",
  email: "Email Nichole",
};

const SUGGESTED = [
  "What's the difference between this and a conference?",
  "Can my team split a 12-pack across cities?",
  "Who is this really designed for?",
  "What does a typical day on campus look like?",
];

const CampusAssistant = ({ onExpressInterest }: CampusAssistantProps) => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I can answer questions about the RW Regional Campus: who it's for, the 2026–2027 schedule, pricing, format, and what happens on the ground. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("campus-chat", {
        body: {
          conversationId,
          message: trimmed,
          visitorContext: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.conversationId && !conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: data?.reply ?? "" }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm having trouble responding right now (${msg}). You can email Nichole directly at nichole@realizedworth.com.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    if (action === "interest" || action === "purchase") {
      if (action === "purchase") {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      } else {
        onExpressInterest();
      }
    } else if (action === "host") {
      document.getElementById("become-host")?.scrollIntoView({ behavior: "smooth" }) ??
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else if (action === "email") {
      window.location.href = "mailto:nichole@realizedworth.com?subject=RW Regional Campus question";
    }
  };

  const renderAssistant = (content: string) => {
    const actionRegex = /\[ACTION:(purchase|interest|host|email)\]/g;
    const actions = Array.from(content.matchAll(actionRegex)).map((m) => m[1]);
    const cleaned = content.replace(actionRegex, "").trim();
    return (
      <>
        <div className="prose prose-sm max-w-none prose-headings:font-roboto prose-p:my-2 prose-ul:my-2 prose-li:my-0">
          <ReactMarkdown>{cleaned}</ReactMarkdown>
        </div>
        {actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(new Set(actions)).map((a) => (
              <button
                key={a}
                onClick={() => handleAction(a)}
                className="text-sm font-medium px-4 py-2 rounded-md bg-[hsl(var(--hero-orange))] text-white hover:opacity-90 transition"
              >
                {ACTION_LABELS[a]}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <section id="ask" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Ask anything about the Campus
            </h2>
            <p className="text-muted-foreground text-lg">
              Pricing, format, who it's for, the 2026–2027 schedule — get a straight answer in seconds.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div ref={scrollRef} className="h-[420px] overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[hsl(var(--hero-navy))] text-white px-4 py-2.5"
                        : "max-w-[90%] rounded-2xl rounded-bl-sm bg-muted text-foreground px-4 py-3"
                    }
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      renderAssistant(m.content)
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-foreground transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border p-3 flex items-center gap-2 bg-background"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, format, schedule..."
                disabled={loading}
                maxLength={1000}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--hero-orange))]/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-lg bg-[hsl(var(--hero-orange))] text-white hover:opacity-90 disabled:opacity-40 transition"
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Responses are AI-generated and may be incomplete. For final answers, email{" "}
            <a href="mailto:nichole@realizedworth.com" className="underline">
              nichole@realizedworth.com
            </a>
            .
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CampusAssistant;
