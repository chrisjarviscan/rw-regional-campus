interface HeroSectionProps {
  onRegisterClick: () => void;
}

const stats = [
  { value: "2 Days", label: "Immersive Learning" },
  { value: "40–50", label: "Participants Per Campus" },
  { value: "15+", label: "Years of Methodology" },
  { value: "2-Stage", label: "Certification Pathway" },
];

const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  return (
    <section className="bg-hero-navy py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-primary-foreground font-bold text-[32px] md:text-[52px] leading-tight mb-6">
          Two days that change how your company does good.
        </h1>
        <p className="text-light-teal text-base md:text-xl max-w-3xl mx-auto mb-10 font-normal">
          A two-day, multi-company learning experience in Realized Worth's Transformative Volunteering methodology. Leave with the skills, certification, and community to redesign how your organization approaches social impact.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onRegisterClick}
            className="bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-7 py-3.5 hover:brightness-90 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            Register Now
          </button>
          <a
            href="#agenda"
            className="border-2 border-primary-foreground text-primary-foreground font-bold text-base rounded-md px-7 py-3.5 hover:bg-primary-foreground/10 transition-all w-full sm:w-auto text-center"
          >
            View the Agenda
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-primary-foreground font-bold text-3xl md:text-4xl mb-1">{stat.value}</div>
              <div className="text-light-teal text-sm font-normal">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
