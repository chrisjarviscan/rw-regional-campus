import { BookOpen, Lightbulb, Users2, Compass } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import programImg from "@/assets/images/program-overview.jpg";

const highlights = [
  { icon: BookOpen, label: "Evidence-Based Curriculum" },
  { icon: Lightbulb, label: "Alert-Orient-Act Framework" },
  { icon: Users2, label: "Multi-Company Cohort" },
  { icon: Compass, label: "Practical Application" },
];

const ProgramOverview = () => {
  return (
    <section id="program" className="py-16 md:py-28 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            Transformative Volunteering for Employee Volunteer Leaders
          </h2>
          <p className="text-dark-teal font-medium text-center text-base md:text-lg mb-2">
            The Regional Campus Series
          </p>
          <p className="text-dark-grey font-light text-center text-sm md:text-base max-w-3xl mx-auto mb-4">
            Leadership and execution training for employee volunteer leaders. Transformative Volunteering is a strategic approach to corporate volunteering that creates conditions for lasting change and trains employee volunteer leaders to generate strong business and community results.
          </p>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mb-12" />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedSection animation="fade-left">
            <div className="relative">
              <img
                src={programImg}
                alt="Professionals collaborating at a workshop"
                className="rounded-xl shadow-xl w-full"
                loading="lazy"
                width={1280}
                height={854}
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-hero-orange/10 rounded-xl -z-10" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-dark-teal/10 rounded-xl -z-10" />
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-right">
            <p className="text-dark-grey font-light text-base md:text-lg mb-6 leading-relaxed">
              The Regional Campus is a two-day, in-person training built on more than fifteen years of Realized Worth's work with Fortune 500 companies across North America and the Middle East. Each campus brings together 40 to 50 professionals from multiple companies in a single city for an intensive learning experience in Transformative Volunteering.
            </p>
            <p className="text-dark-grey font-light text-base md:text-lg leading-relaxed">
              Participants work through Realized Worth's Alert-Orient-Act framework with experienced facilitators, building practical skills they can apply the week they return to the office. The multi-company cohort is intentional: learning alongside peers from different industries and organizational cultures accelerates insight and builds a professional network that lasts well beyond the two days.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <AnimatedSection key={h.label} delay={i * 100}>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-light-teal/10 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-dark-teal/10 flex items-center justify-center mb-3 group-hover:bg-dark-teal/20 transition-colors">
                  <h.icon className="text-dark-teal" size={24} />
                </div>
                <span className="text-hero-navy font-medium text-sm">{h.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramOverview;
