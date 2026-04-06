import { Award, GraduationCap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import certImg from "@/assets/images/certification.jpg";

const CertificationSection = () => {
  return (
    <section id="certification" className="relative py-16 md:py-28 px-4 overflow-hidden bg-background">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-hero-orange/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-hero-navy/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <AnimatedSection>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-hero-orange" size={20} />
            <span className="text-hero-orange text-sm font-bold uppercase tracking-wider">Certification Pathway</span>
          </div>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[36px] text-center mb-3">
            A Credential That Means Something
          </h2>
          <p className="text-dark-grey text-center text-base md:text-lg mb-14 max-w-2xl mx-auto">
            Two stages designed to validate real capability — not just attendance.
          </p>
        </AnimatedSection>

        {/* Hero image banner */}
        <AnimatedSection animation="scale" delay={100}>
          <div className="relative rounded-2xl overflow-hidden mb-14 shadow-xl">
            <img
              src={certImg}
              alt="Professionals in a training session"
              className="w-full h-56 md:h-72 object-cover"
              loading="lazy"
              width={1280}
              height={854}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-hero-navy/70 via-hero-navy/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 md:px-14">
              <div>
                <p className="text-primary-foreground font-bold text-lg md:text-2xl max-w-md leading-snug">
                  Earn a credential backed by 15+ years of research and practice.
                </p>
                <p className="text-light-teal text-sm md:text-base mt-2 max-w-sm">
                  Recognized by leading organizations worldwide.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Two-stage cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Stage 1 */}
          <AnimatedSection animation="fade-left" delay={200}>
            <div className="relative bg-background rounded-2xl border border-light-grey p-7 md:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.08)] group hover-lift h-full overflow-hidden">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dark-teal to-dark-teal/40" />
              
              <div className="flex items-start gap-5 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-dark-teal/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Award className="text-dark-teal" size={28} />
                </div>
                <div>
                  <span className="text-dark-teal text-xs font-bold uppercase tracking-wider">Stage 1</span>
                  <h3 className="text-hero-navy font-bold text-lg md:text-xl mt-1">Certificate of Completion</h3>
                </div>
              </div>

              <p className="text-dark-grey font-light text-[15px] md:text-base leading-relaxed mb-6">
                Awarded upon completing the two-day Campus program. Validates foundational knowledge of the Alert-Orient-Act framework, the Tourist-Traveler-Guide model, and evidence-based volunteer program design.
              </p>

              <div className="space-y-3">
                {["Seven-domain competency rubric", "Foundational methodology mastery", "Peer-reviewed assessment"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-dark-teal text-sm font-medium">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Stage 2 */}
          <AnimatedSection animation="fade-right" delay={300}>
            <div className="relative bg-hero-navy rounded-2xl p-7 md:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.15)] group hover-lift h-full overflow-hidden">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hero-orange to-mustard" />
              
              <div className="flex items-start gap-5 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-hero-orange/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <GraduationCap className="text-hero-orange" size={28} />
                </div>
                <div>
                  <span className="text-hero-orange text-xs font-bold uppercase tracking-wider">Stage 2</span>
                  <h3 className="text-primary-foreground font-bold text-lg md:text-xl mt-1">Certified Transformative Volunteering Leader</h3>
                </div>
              </div>

              <p className="text-light-teal font-light text-[15px] md:text-base leading-relaxed mb-6">
                Available after Stage 1. Requires demonstrated application of Campus learnings in your organization, evaluated through a portfolio review and facilitator conversation.
              </p>

              <div className="space-y-3">
                {["Practitioner-level credential", "Portfolio-based evaluation", "Ongoing community access"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-hero-orange text-sm font-medium">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Arrow connecting stages */}
              <div className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-hero-orange items-center justify-center shadow-lg">
                <ArrowRight className="text-primary-foreground" size={18} />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
