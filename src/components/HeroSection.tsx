import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroImg from "@/assets/images/hero-workshop.jpg";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-hero-navy/90" />
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-dark-teal/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-hero-orange/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10 px-4 py-20 md:py-28">
        <div
          className={`transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="inline-block bg-hero-orange/20 text-hero-orange border border-hero-orange/30 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🔥 2026 Regional Campus — Now Enrolling
          </span>
        </div>

        <h1
          className={`text-primary-foreground font-bold text-[34px] md:text-[56px] leading-[1.1] mb-6 transition-all duration-1000 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Two days that change how
          <br />
          <span className="text-hero-orange">your company does good.</span>
        </h1>

        <p
          className={`text-light-teal text-base md:text-xl max-w-3xl mx-auto mb-10 font-normal transition-all duration-1000 delay-400 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          A two-day, multi-company learning experience in Realized Worth's Transformative Volunteering methodology. Leave with the skills, certification, and community to redesign how your organization approaches social impact.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <button
            onClick={onRegisterClick}
            className="group bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:brightness-90 hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Register Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#agenda"
            className="border-2 border-primary-foreground/60 text-primary-foreground font-bold text-base rounded-md px-8 py-4 hover:bg-primary-foreground/10 hover:border-primary-foreground transition-all w-full sm:w-auto text-center"
          >
            View the Agenda
          </a>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 transition-all duration-1000 delay-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-primary-foreground font-bold text-3xl md:text-4xl mb-1 group-hover:text-hero-orange transition-colors">
                {stat.value}
              </div>
              <div className="text-light-teal text-sm font-normal">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${loaded ? "opacity-60" : "opacity-0"}`}>
        <ChevronDown className="text-primary-foreground animate-bounce" size={28} />
      </div>
    </section>
  );
};

export default HeroSection;
