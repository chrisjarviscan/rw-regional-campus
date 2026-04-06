import { Award, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import certImg from "@/assets/images/certification.jpg";

const CertificationSection = () => {
  return (
    <section id="certification" className="py-16 md:py-28 px-4 section-light-teal overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            A Credential That Means Something
          </h2>
          <p className="text-dark-teal text-center text-base md:text-lg mb-12 max-w-2xl mx-auto">
            Two stages designed to validate real capability — not just attendance.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Stage 1 */}
          <AnimatedSection animation="fade-left">
            <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] group hover-lift h-full">
              <div className="w-14 h-14 rounded-xl bg-dark-teal/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="text-dark-teal" size={28} />
              </div>
              <span className="text-dark-teal text-xs font-bold uppercase tracking-wider">Stage 1</span>
              <h3 className="text-hero-navy font-medium text-lg md:text-xl mt-2 mb-4">Certificate of Completion</h3>
              <p className="text-dark-grey font-light text-[15px] md:text-base leading-relaxed mb-4">
                Awarded upon completing the two-day Campus program. Validates foundational knowledge of the Alert-Orient-Act framework, the Tourist-Traveler-Guide model, and evidence-based volunteer program design.
              </p>
              <div className="flex items-center gap-2 text-dark-teal text-sm font-medium">
                <CheckCircle2 size={16} />
                <span>Seven-domain competency rubric</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Center image */}
          <AnimatedSection animation="scale" delay={200}>
            <div className="hidden lg:block relative">
              <img
                src={certImg}
                alt="Professional receiving certification"
                className="rounded-xl shadow-lg w-full"
                loading="lazy"
                width={1280}
                height={854}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-hero-orange/90 flex items-center justify-center">
                  <ArrowRight className="text-primary-foreground" size={20} />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Stage 2 */}
          <AnimatedSection animation="fade-right" delay={300}>
            <div className="bg-background rounded-xl border border-hero-orange/20 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] group hover-lift h-full ring-1 ring-hero-orange/10">
              <div className="w-14 h-14 rounded-xl bg-hero-orange/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="text-hero-orange" size={28} />
              </div>
              <span className="text-hero-orange text-xs font-bold uppercase tracking-wider">Stage 2</span>
              <h3 className="text-hero-navy font-medium text-lg md:text-xl mt-2 mb-4">Certified Transformative Volunteering Leader</h3>
              <p className="text-dark-grey font-light text-[15px] md:text-base leading-relaxed mb-4">
                Available after Stage 1. Requires demonstrated application of Campus learnings in your organization, evaluated through a portfolio review and facilitator conversation.
              </p>
              <div className="flex items-center gap-2 text-hero-orange text-sm font-medium">
                <CheckCircle2 size={16} />
                <span>Practitioner-level credential</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
