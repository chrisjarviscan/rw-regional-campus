import { Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const tiers = [
  {
    name: "Individual",
    price: "$2,100",
    perSeat: "per person",
    features: [
      "Any single 2026 campus",
      "Two-day immersive in-person program",
      "Stage 1 Certificate of Completion",
      "6-month cohort access included",
    ],
    cta: "Express Interest",
    popular: false,
    outline: false,
  },
  {
    name: "6-Pack",
    price: "$12,000",
    perSeat: "$2,000 per seat · 5% off",
    features: [
      "6 seats across any 2026 campuses",
      "Everything in Individual",
      "Group onboarding call",
      "Post-event team debrief",
    ],
    cta: "Get Notified",
    popular: true,
    outline: false,
  },
  {
    name: "12-Pack",
    price: "$22,800",
    perSeat: "$1,900 per seat · 10% off",
    features: [
      "12 seats across any 2026 campuses",
      "Everything in 6-Pack",
      "Priority city selection",
    ],
    cta: "Get Notified",
    popular: false,
    outline: false,
  },
  {
    name: "18-Pack",
    price: "$32,130",
    perSeat: "$1,785 per seat · 15% off",
    features: [
      "18 seats across any 2026 campuses",
      "Full-scale capability development",
      "Dedicated account coordination",
    ],
    cta: "Talk to Us",
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
            Invest in Your Volunteer Leaders' Capacity to Drive Change
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
                  <span className="absolute -top-3 right-4 bg-mustard text-primary-foreground text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1 rounded-sm">
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
                {tier.cta === "Talk to Us" ? (
                  <a
                    href="mailto:nichole@realizedworth.com?subject=18-Pack%20inquiry%20%E2%80%94%20Regional%20Campus%202026"
                    className={`w-full font-bold text-sm rounded-md py-3 transition-all hover:brightness-90 hover:-translate-y-0.5 text-center inline-block ${
                      tier.outline
                        ? "border-2 border-hero-navy text-hero-navy bg-transparent"
                        : "bg-hero-orange text-primary-foreground"
                    }`}
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button
                    onClick={onRegisterClick}
                    className={`w-full font-bold text-sm rounded-md py-3 transition-all hover:brightness-90 hover:-translate-y-0.5 ${
                      tier.outline
                        ? "border-2 border-hero-navy text-hero-navy bg-transparent"
                        : "bg-hero-orange text-primary-foreground"
                    }`}
                  >
                    {tier.cta}
                  </button>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={600}>
          <p className="text-dark-grey font-light text-[13px] text-center max-w-2xl mx-auto mt-8">
            All prices in USD. Multi-pack seats can be split across any combination of 2026 campuses. To preserve the multi-company learning environment, no single organization may hold more than one-third of seats at any campus. Net 30 payment terms for corporate invoices.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PricingSection;
