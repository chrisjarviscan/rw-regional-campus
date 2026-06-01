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
    "Transformative Volunteering Training — Worth a Look"
  )}&body=${encodeURIComponent(
    `I came across this two-day training program from Realized Worth Institute on Transformative Volunteering methodology. It looks relevant to what we're doing with our volunteer programs.\n\nTake a look: https://rw-regional-campus.lovable.app/\n\nIt covers how to move from transactional volunteering to real impact — with a certification pathway. Thought you'd want to see it.`
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
                    I organize my team's volunteering
                  </h3>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-hero-orange text-primary-foreground flex items-center justify-center transition-transform">
                    {expanded === "leader" ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </div>
                <p className="text-dark-grey font-light text-[15px] leading-relaxed">
                  You're the one who makes volunteering happen — signing people up, rallying colleagues, and following through without being asked. A regional campus is built for you.
                </p>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    expanded === "leader" ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-dark-grey font-light text-[15px] leading-relaxed mb-5">
                      Seats are typically purchased by CSR leads and program managers, so the best next step is sharing this page with whoever runs volunteering at your company. When you attend, you'll come back with a real framework, a certificate you can point to, and a cohort of peers doing this same work at other companies — people who immediately get what you do.
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
