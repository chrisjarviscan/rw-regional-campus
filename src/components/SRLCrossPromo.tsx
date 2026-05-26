import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const SRLCrossPromo = () => {
  return (
    <section className="py-14 md:py-20 px-4 bg-hero-navy/[0.05] overflow-hidden">
      <div className="container mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[28px] mb-4">
            Are you the CSR or corporate volunteering lead?
          </h2>
          <p className="text-dark-grey font-light text-base md:text-lg leading-relaxed mb-7 max-w-2xl mx-auto">
            The Regional Campus is designed for the volunteer leaders you send. For your own learning, we run Social REV Live — a different experience built for CSR and corporate volunteering professionals.
          </p>
          <a
            href="https://www.realizedworth.com/social-rev-live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-hero-orange text-hero-orange font-bold text-base rounded-md px-7 py-3.5 hover:bg-hero-orange hover:text-primary-foreground transition-all"
          >
            Learn about Social REV Live
            <ArrowRight size={18} />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SRLCrossPromo;
