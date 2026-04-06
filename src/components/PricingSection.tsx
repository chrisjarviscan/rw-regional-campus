import { Check } from "lucide-react";

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
    <section id="pricing" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-hero-navy font-bold text-[22px] md:text-[30px] text-center mb-12">
          Invest in Your Team's Capacity to Lead Change
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-background rounded-lg border border-light-grey p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift flex flex-col relative"
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mustard text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-hero-navy font-medium text-xl mb-2">{tier.name}</h3>
              <div className="text-hero-orange font-bold text-[32px] md:text-[36px] mb-1">{tier.price}</div>
              <p className="text-dark-grey font-light text-sm mb-5">{tier.perSeat}</p>
              <ul className="flex-1 space-y-3 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-dark-grey font-light text-sm">
                    <Check className="text-dark-teal shrink-0 mt-0.5" size={16} />
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
          ))}
        </div>
        <p className="text-dark-grey font-light text-[13px] text-center max-w-xl mx-auto mt-8">
          All prices in USD. Corporate packages can be split across multiple campuses. No single organization may hold more than one-third of seats at any campus to preserve the multi-company learning environment. Net 30 payment terms for corporate invoices.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
