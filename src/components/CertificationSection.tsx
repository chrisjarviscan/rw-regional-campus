import { Award, GraduationCap } from "lucide-react";

const CertificationSection = () => {
  return (
    <section id="certification" className="py-16 md:py-24 px-4 section-light-teal">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-hero-navy font-bold text-[22px] md:text-[30px] text-center mb-12">
          A Credential That Means Something
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <Award className="text-dark-teal mb-4" size={36} />
            <h3 className="text-hero-navy font-medium text-lg md:text-xl mb-3">Stage 1: Certificate of Completion</h3>
            <p className="text-dark-grey font-light text-[15px] md:text-base">
              Awarded upon completing the two-day Campus program. Validates foundational knowledge of the Alert-Orient-Act framework, the Tourist-Traveler-Guide model, and evidence-based volunteer program design. Assessed through a seven-domain competency rubric during the Campus.
            </p>
          </div>
          <div className="bg-background rounded-lg border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <GraduationCap className="text-hero-orange mb-4" size={36} />
            <h3 className="text-hero-navy font-medium text-lg md:text-xl mb-3">Stage 2: Certified Transformative Volunteering Leader</h3>
            <p className="text-dark-grey font-light text-[15px] md:text-base">
              Available after Stage 1. Requires demonstrated application of Campus learnings in your organization, evaluated through a portfolio review and facilitator conversation. The practitioner credential that signals deep capability, not attendance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
