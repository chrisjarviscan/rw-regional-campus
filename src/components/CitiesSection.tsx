import { MapPin, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import patternBg from "@/assets/images/pattern-bg.jpg";
import { trackMailto } from "@/lib/trackMailto";
import { campuses as cities } from "@/data/campuses";


interface CitiesSectionProps {
  onNotifyClick: (campus: string) => void;
  onReserveClick: (campus: string) => void;
}

const CitiesSection = ({ onNotifyClick, onReserveClick }: CitiesSectionProps) => {
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
            Where We're Headed in 2026–2027
          </h2>
          <p className="text-light-teal text-center text-sm md:text-base mb-12">
            Each campus runs the same Transformative Experience, capped at ~40 participants from up to 8 companies.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {c.status && (
                    <span className={`absolute top-3 left-3 ${c.statusColor} text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full`}>
                      {c.status}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="text-hero-orange" size={18} />
                    <h3 className="text-hero-navy font-medium text-xl">{c.city}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="text-dark-teal" size={14} />
                    <p className="text-dark-teal font-normal text-sm">{c.dates}</p>
                  </div>
                  {c.deadline && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Clock className="text-hero-orange" size={14} />
                      <p className="text-hero-orange font-semibold text-sm">
                        Registration deadline: {c.deadline}
                      </p>
                    </div>
                  )}
                  {!c.deadline && <div className="mb-3" />}
                  <p className="text-dark-grey font-light text-sm mb-5 flex-1">{c.text}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {c.status && (
                      <button
                        type="button"
                        onClick={() =>
                          c.status === "Registration Open"
                            ? onReserveClick(c.campusValue)
                            : onNotifyClick(c.campusValue)
                        }
                        className="flex-1 bg-hero-orange text-primary-foreground font-bold text-sm rounded-md py-3 px-3 hover:brightness-90 transition-all flex items-center justify-center gap-2"
                      >
                        {c.status === "Registration Open" ? "Reserve My Seats" : "Notify Me"}
                        <ArrowRight size={16} className="transition-all" />
                      </button>
                    )}
                    {c.detail && !c.detail.draft && (
                      <Link
                        to={`/campus/${c.slug}`}
                        className="flex-1 border-2 border-hero-navy text-hero-navy font-bold text-sm rounded-md py-3 px-3 hover:bg-hero-navy hover:text-primary-foreground transition-all flex items-center justify-center text-center"
                      >
                        Campus Details
                      </Link>
                    )}
                  </div>
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
              href="mailto:nichole@realizedworth.com?subject=Request%20a%20campus%20in%20my%20region"
              onClick={() =>
                trackMailto({
                  ctaLabel: "Request a campus in my region",
                  ctaLocation: "Cities footer",
                  emailTo: "nichole@realizedworth.com",
                  subject: "Request a campus in my region",
                })
              }
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
