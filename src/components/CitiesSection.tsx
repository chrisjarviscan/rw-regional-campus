import { MapPin, ArrowRight, Calendar } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import patternBg from "@/assets/images/pattern-bg.jpg";
import cityDetroit from "@/assets/images/city-detroit.jpg";
import cityWashington from "@/assets/images/city-washington.jpg";
import cityAtlanta from "@/assets/images/city-atlanta.jpg";
import citySeattle from "@/assets/images/city-seattle.jpg";

const cities = [
  {
    city: "Detroit, MI",
    dates: "August 2026",
    status: "Accepting Registrations Soon",
    statusColor: "bg-dark-teal",
    text: "Campus 01. Register by mid-June. Hosted at a corporate venue in metro Detroit.",
    image: cityDetroit,
  },
  {
    city: "Washington, DC",
    dates: "September 2026",
    status: "Accepting Registrations Soon",
    statusColor: "bg-dark-teal",
    text: "Campus 02. Register by mid-July. A capital-region cohort drawing from federal, nonprofit, and corporate teams.",
    image: cityWashington,
  },
  {
    city: "Atlanta, GA",
    dates: "October 2026",
    status: "Accepting Registrations Soon",
    statusColor: "bg-dark-teal",
    text: "Campus 03. Register by late August. Southeast campus with a confirmed venue partner.",
    image: cityAtlanta,
  },
  {
    city: "Seattle, WA",
    dates: "Fall 2026",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "In development with the Microsoft Alumni Network. Dates and registration to follow.",
    image: citySeattle,
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

      <div className="container mx-auto max-w-6xl relative z-10">
        <AnimatedSection>
          <h2 className="text-primary-foreground font-bold text-[22px] md:text-[32px] text-center mb-3">
            Where We're Headed in 2026
          </h2>
          <p className="text-light-teal text-center text-sm md:text-base mb-12">
            Each campus runs the same Transformative Experience, capped at ~40 participants from up to 8 companies.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((c, i) => (
            <AnimatedSection key={c.city} delay={i * 120} animation="scale">
              <div className="bg-background rounded-xl border border-light-grey shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover-lift group h-full flex flex-col overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={c.image}
                    alt={`${c.city} skyline`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={512}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hero-navy/60 to-transparent" />
                  <span className={`absolute top-3 left-3 ${c.statusColor} text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full`}>
                    {c.status}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="text-hero-orange" size={18} />
                    <h3 className="text-hero-navy font-medium text-xl">{c.city}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Calendar className="text-dark-teal" size={14} />
                    <p className="text-dark-teal font-normal text-sm">{c.dates}</p>
                  </div>
                  <p className="text-dark-grey font-light text-sm mb-5 flex-1">{c.text}</p>
                  <a
                    href="mailto:campus@realizedworth.com?subject=Notify%20me%20about%20a%202026%20Regional%20Campus"
                    className="w-full bg-hero-orange text-primary-foreground font-bold text-sm rounded-md py-3 hover:brightness-90 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    Notify Me
                    <ArrowRight size={16} className="transition-all" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <div className="mt-10 text-center">
            <p className="text-light-teal text-sm font-normal mb-3">
              More cities coming. Philadelphia and Minneapolis are under consideration.
            </p>
            <a
              href="mailto:campus@realizedworth.com?subject=Request%20a%20campus%20in%20my%20region"
              className="inline-flex items-center gap-2 text-primary-foreground font-medium text-sm border-b border-primary-foreground/40 hover:border-primary-foreground transition-colors pb-0.5"
            >
              Would you like your region to be considered?
              <ArrowRight size={14} />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CitiesSection;
