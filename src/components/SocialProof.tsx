import { Quote, Globe2, Building2, BarChart3, Zap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const sectors = [
  { icon: Globe2, label: "Technology" },
  { icon: Building2, label: "Financial Services" },
  { icon: BarChart3, label: "Retail" },
  { icon: Zap, label: "Energy" },
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection>
          <div className="relative bg-hero-navy/[0.03] rounded-2xl p-8 md:p-12 border border-hero-navy/10">
            <Quote className="text-hero-orange/20 absolute top-4 left-4" size={48} />
            <p className="text-hero-navy font-medium text-lg md:text-2xl text-center leading-relaxed relative z-10">
              Our methodology has been developed and tested with Fortune 500 companies across technology, financial services, retail, and energy sectors.
            </p>
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
              {sectors.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <s.icon className="text-dark-teal" size={24} />
                  <span className="text-dark-grey text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SocialProof;
