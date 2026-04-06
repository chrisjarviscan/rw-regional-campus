import { MapPin, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import patternBg from "@/assets/images/pattern-bg.jpg";

const cities = [
  {
    city: "Seattle, WA",
    dates: "Fall 2026",
    status: "Pilot Campus",
    statusColor: "bg-dark-teal",
    text: "The inaugural Regional Campus. Dates will be confirmed soon.",
    emoji: "🌲",
  },
  {
    city: "Detroit, MI",
    dates: "Q4 2026",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "Partnering with a major corporate host in the Motor City.",
    emoji: "🏭",
  },
  {
    city: "Atlanta, GA",
    dates: "October 2026",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "A Southeast campus with a confirmed venue partner.",
    emoji: "🍑",
  },
];

const CitiesSection = () => {
  return (
    <section id="cities" className="relative py-16 md:py-28 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={patternBg} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={600} />
        <div className="absolute inset-0 bg-hero-navy/85" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <AnimatedSection>
          <h2 className="text-primary-foreground font-bold text-[22px] md:text-[32px] text-center mb-3">
            Where We're Headed in 2026
          </h2>
          <p className="text-light-teal text-center text-sm md:text-base mb-12">
            Three cities. Three cohorts. One transformative experience.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((c, i) => (
            <AnimatedSection key={c.city} delay={i * 150} animation="scale">
              <div className="bg-background rounded-xl border border-light-grey p-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover-lift group h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`${c.statusColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}>
                    {c.status}
                  </span>
                  <span className="text-2xl">{c.emoji}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="text-hero-orange" size={18} />
                  <h3 className="text-hero-navy font-medium text-xl">{c.city}</h3>
                </div>
                <p className="text-dark-teal font-normal text-sm mb-3">{c.dates}</p>
                <p className="text-dark-grey font-light text-sm mb-5 flex-1">{c.text}</p>
                <button className="w-full bg-hero-orange text-primary-foreground font-bold text-sm rounded-md py-3 hover:brightness-90 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Get Notified
                  <ArrowRight size={16} className="transition-all" />
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <p className="text-light-teal text-center text-sm mt-10 font-normal">
            More cities coming. Toronto, Bay Area, and Chicago are under consideration.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CitiesSection;
