import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import FitAssessmentModal from "./FitAssessmentModal";

interface FitAssessmentProps {
  onExpressInterest: () => void;
}

const FitAssessment = ({ onExpressInterest }: FitAssessmentProps) => {
  const [open, setOpen] = useState(false);

  return (
    <section id="assessment" className="py-16 md:py-24 px-4 bg-light-teal/20">
      <div className="container mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <span className="text-hero-navy font-bold text-sm uppercase tracking-[0.15em]">
            Before you express interest
          </span>
          <h2 className="text-hero-navy font-bold text-[24px] md:text-[36px] mt-3 mb-4">
            Is the Regional Campus right for you?
          </h2>
          <p className="text-dark-grey font-light text-base md:text-lg max-w-2xl mx-auto mb-8">
            A short, honest read on where you are in your volunteering leadership journey — and whether the campus is the right next step. Five questions. Two minutes.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="group bg-hero-navy text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:brightness-110 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
          >
            Take the Self-Assessment
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </AnimatedSection>
      </div>

      <FitAssessmentModal
        open={open}
        onClose={() => setOpen(false)}
        onExpressInterest={onExpressInterest}
      />
    </section>
  );
};

export default FitAssessment;
