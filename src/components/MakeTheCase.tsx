import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const MakeTheCase = () => {
  return (
    <section id="make-the-case" className="relative py-20 md:py-28 px-4 bg-hero-navy overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-dark-teal/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-hero-orange/5 blur-3xl" />

      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <AnimatedSection>
          <p className="text-light-teal text-sm uppercase tracking-[0.15em] font-bold mb-3">
            Need to convince a decision-maker first?
          </p>
        </AnimatedSection>
        <AnimatedSection delay={150}>
          <h2 className="text-primary-foreground text-2xl md:text-4xl font-bold mb-4">
            Build your business case in 5 minutes.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={300}>
          <p className="text-light-teal text-base md:text-lg mb-8 max-w-xl mx-auto">
            Answer a few questions about your team and audience. We'll generate a tailored PowerPoint deck you can edit and send to your VP.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={450}>
          <a
            href="/business-case/index.html"
            className="group inline-flex items-center justify-center gap-2 bg-primary-foreground/10 border-2 border-hero-orange text-hero-orange font-bold text-base rounded-md px-8 py-4 hover:bg-hero-orange hover:text-primary-foreground transition-all"
          >
            Build my business case
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default MakeTheCase;
