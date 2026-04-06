import { Building, Star, Eye, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import patternBg from "@/assets/images/pattern-bg.jpg";

const benefits = [
  { icon: Star, label: "Preferred Registration Access" },
  { icon: Eye, label: "Brand Visibility as Campus Host" },
  { icon: Building, label: "Leadership in Social Impact" },
];

const BecomeHost = () => {
  return (
    <section className="relative py-16 md:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <img src={patternBg} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={600} />
        <div className="absolute inset-0 bg-hero-navy/90" />
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-primary-foreground font-bold text-[22px] md:text-[32px] mb-6">
            Bring the Campus to Your City
          </h2>
          <p className="text-primary-foreground/90 font-light text-base md:text-lg max-w-[720px] mx-auto mb-10">
            The Regional Campus works best when a local corporate partner hosts the experience. Provide venue and catering for two days, and your organization receives:
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {benefits.map((b, i) => (
            <AnimatedSection key={b.label} delay={i * 150}>
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-5 backdrop-blur-sm hover:bg-primary-foreground/10 transition-colors">
                <b.icon className="text-hero-orange mx-auto mb-3" size={28} />
                <span className="text-primary-foreground font-medium text-sm">{b.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <button className="group bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:brightness-90 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
            Become a Host
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BecomeHost;
