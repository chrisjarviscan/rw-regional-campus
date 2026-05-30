import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { trackMailto } from "@/lib/trackMailto";

interface WhoThisIsForProps {
  onExpressInterest?: () => void;
}

type PanelKey = "csr" | "leader";

const WhoThisIsFor = ({ onExpressInterest }: WhoThisIsForProps) => {
  const [expanded, setExpanded] = useState<PanelKey | null>(null);

  const toggle = (key: PanelKey) => setExpanded((cur) => (cur === key ? null : key));

  const leaderMailto = `mailto:?subject=${encodeURIComponent(
    "I'd like to attend the Regional Campus"
  )}&body=${encodeURIComponent(
    `Hi — I think the RW Regional Campus would be valuable for me. The page is here: ${typeof window !== "undefined" ? window.location.href : ""}. Could we talk about whether you can sponsor my attendance?`
  )}`;

  return (
    <section className="py-16 md:py-28 px-4 section-light-teal overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            Who's this for? Depends on where you sit.
          </h2>
          <p className="text-dark-teal text-center text-base md:text-lg mb-12 max-w-2xl mx-auto">
            Both sides matter. Click whichever describes you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 md:divide-x md:divide-light-grey items-start">
          {/* CSR Practitioner */}
          <AnimatedSection delay={0}>
            <div className="md:pr-6">
              <button
                type="button"
                onClick={() => toggle("csr")}
                className="w-full text-left bg-hero-navy/[0.04] border border-hero-navy/15 rounded-xl p-6 md:p-8 hover-lift transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-hero-navy font-bold text-lg md:text-xl">
                    I run my company's volunteering program
                  </h3>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-hero-navy text-primary-foreground flex items-center justify-center transition-transform">
                    {expanded === "csr" ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </div>
                <p className="text-dark-grey font-light text-[15px] leading-relaxed">
                  You're the CSR or corporate volunteering lead or program manager — you decide who attends, allocate the budget, and want to invest in the people already carrying your program. A regional campus is designed for the volunteer leaders you send, not for you to attend yourself.
                </p>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    expanded === "csr" ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-dark-grey font-light text-[15px] leading-relaxed mb-3">
                      Your most engaged volunteer leaders are past the basics. They organize events, rally teammates, and follow up without being asked — and they're ready to go deeper. A regional campus gives them a two-day framework, a certificate, and a six-month peer community from across industries. They come back with shared language you can actually build on.
                    </p>
                    <p className="text-dark-grey font-light text-[15px] leading-relaxed mb-5">
                      Send two or three people from the same program, and that effect compounds.
                    </p>
                    {onExpressInterest && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExpressInterest();
                        }}
                        className="inline-flex items-center gap-2 bg-hero-navy text-primary-foreground font-bold text-sm rounded-md px-6 py-3 hover:brightness-110 transition-all"
                      >
                        Express Interest
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </AnimatedSection>

          {/* Volunteer Leader */}
          <AnimatedSection delay={150}>
            <div className="md:pl-6">
              <button
                type="button"
                onClick={() => toggle("leader")}
                className="w-full text-left bg-hero-orange/10 border border-hero-orange/25 rounded-xl p-6 md:p-8 hover-lift transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-hero-navy font-bold text-lg md:text-xl">
                    I'm the one who organizes my team's volunteering
                  </h3>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-hero-orange text-primary-foreground flex items-center justify-center transition-transform">
                    {expanded === "leader" ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </div>
                <p className="text-dark-grey font-light text-[15px] leading-relaxed">
                  You're the person who already shows up — the one who organizes sign-ups, rallies people, and follows up without being asked. Campus is built to train you. You probably won't buy this yourself, though.
                </p>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    expanded === "leader" ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-dark-grey font-light text-[15px] leading-relaxed mb-3">
                      Your CSR lead or program manager is the one who buys Campus seats and decides who attends. You probably haven't been formally recognized for the work you do beyond your job description — most volunteer leaders haven't. The Stage 1 Certificate of Completion gives you something to point to. The six-month cohort gives you peers across companies and industries who do this same work and recognize it.
                    </p>
                    <p className="text-dark-grey font-light text-[15px] leading-relaxed mb-5">
                      If Campus sounds like the experience you want, the best move is to share this with whoever runs CSR or volunteering at your company.
                    </p>
                    <a
                      href={leaderMailto}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackMailto({
                          ctaLabel: "Share with my CSR lead",
                          ctaLocation: "WhoThisIsFor — Volunteer Leader",
                          emailTo: "",
                          subject: "I'd like to attend the Regional Campus",
                        });
                      }}
                      className="inline-flex items-center gap-2 bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-6 py-3 hover:brightness-90 transition-all"
                    >
                      Share this with my CSR lead
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
