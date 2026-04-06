import { Check, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const tiers = [
  {
    name: "Individual",
    price: "$1,895",
    perSeat: "per person",
    features: [
      "Full two-day program",
      "All materials and meals included",
      "Certificate of Completion",
      "Post-event cohort community access",
    ],
    cta: "Register Now",
    popular: false,
    outline: false,
  },
  {
    name: "6-Pack",
    price: "$15,000",
    perSeat: "$2,500 per seat",
    features: [
      "6 registrations from one organization",
      "Everything in Individual",
      "Group onboarding call",
      "Post-event team debrief session",
    ],
    cta: "Reserve Your Pack",
    popular: true,
    outline: false,
  },
  {
    name: "12-Pack",
    price: "$27,000",
    perSeat: "$2,250 per seat",
    features: [
      "12 registrations",
      "Everything in 6-Pack",
      "Priority city selection across 2026 campuses",
    ],
    cta: "Reserve Your Pack",
    popular: false,
    outline: false,
  },
  {
    name: "18-Pack",
    price: "$33,750",
    perSeat: "$1,875 per seat",
    features: [
      "18 registrations",
      "Everything in 12-Pack",
      "Dedicated account coordination",
    ],
    cta: "Contact Us",
    popular: false,
    outline: true,
  },
];

interface PricingSectionProps {
  onRegisterClick: () => void;
}

const PricingSection = ({ onRegisterClick }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-16 md:py-28 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            Invest in Your Team's Capacity to Lead Change
          </h2>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mb-12" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 120}>
              <div
                className={`rounded-xl border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift flex flex-col relative h-full transition-all ${
                  tier.popular
                    ? "border-hero-orange/40 bg-hero-orange/[0.03] ring-2 ring-hero-orange/20"
                    : "border-light-grey bg-background"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mustard text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    Most Popular
                  </span>
                )}
                <h3 className="text-hero-navy font-medium text-xl mb-2">{tier.name}</h3>
                <div className="text-hero-orange font-bold text-[32px] md:text-[36px] mb-1">{tier.price}</div>
                <p className="text-dark-grey font-light text-sm mb-5">{tier.perSeat}</p>
                <ul className="flex-1 space-y-3 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-dark-grey font-light text-sm">
                      <div className="w-5 h-5 rounded-full bg-dark-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="text-dark-teal" size={12} />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={tier.cta === "Register Now" || tier.cta === "Reserve Your Pack" ? onRegisterClick : undefined}
                  className={`w-full font-bold text-sm rounded-md py-3 transition-all hover:brightness-90 hover:-translate-y-0.5 ${
                    tier.outline
                      ? "border-2 border-hero-navy text-hero-navy bg-transparent"
                      : "bg-hero-orange text-primary-foreground"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={600}>
          <p className="text-dark-grey font-light text-[13px] text-center max-w-xl mx-auto mt-8">
            All prices in USD. Corporate packages can be split across multiple campuses. No single organization may hold more than one-third of seats at any campus to preserve the multi-company learning environment. Net 30 payment terms for corporate invoices.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PricingSection;
