import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface FinalCTAProps {
  onRegisterClick: () => void;
}

const FinalCTA = ({ onRegisterClick }: FinalCTAProps) => {
  return (
    <section className="relative py-20 md:py-32 px-4 bg-hero-navy overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-dark-teal/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-hero-orange/5 blur-3xl" />

      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <AnimatedSection>
          <div className="inline-flex items-center bg-primary-foreground/5 text-primary-foreground text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-sm mb-6 border border-primary-foreground/20">
            Capped at ~40 participants per campus
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <h2 className="text-primary-foreground font-bold text-[28px] md:text-[48px] leading-tight mb-4">
            Your team is already volunteering.
            <br />
            <span className="text-hero-orange">It's time to make it count.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <p className="text-light-teal text-base md:text-lg mb-10 font-normal max-w-2xl mx-auto">
            Add your name to the 2026 list. We'll let you know when registration opens for the campus you choose.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={450}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegisterClick}
              className="group bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:brightness-90 hover:-translate-y-0.5 transition-all w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              Express Interest
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="mailto:nichole@realizedworth.com"
              className="border-2 border-primary-foreground/60 text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:bg-primary-foreground/10 hover:border-primary-foreground transition-all w-full sm:w-auto text-center"
            >
              Talk to Nichole
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FinalCTA;
