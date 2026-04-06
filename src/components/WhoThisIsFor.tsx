import { Users, Target, Heart, Building2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const cards = [
  {
    icon: Users,
    title: "Volunteer Program Managers",
    text: "You run the programs, coordinate the logistics, and report the numbers. You know something is missing but can't name it. The Campus gives you the framework and language to move from transactional volunteering to transformative impact.",
    accent: "bg-dark-teal",
  },
  {
    icon: Target,
    title: "CSR and Social Impact Leaders",
    text: "You set strategy for your company's community engagement. The Campus equips you with an evidence-based methodology you can take back to your leadership team, along with a certification that validates your expertise.",
    accent: "bg-hero-orange",
  },
  {
    icon: Heart,
    title: "Employee Engagement Champions",
    text: "You may not have CSR in your title, but you are the person who cares. You organize volunteer days, rally your team, and wonder why participation does not translate into lasting change. The Campus shows you why and gives you tools to fix it.",
    accent: "bg-mustard",
  },
  {
    icon: Building2,
    title: "HR and People Leaders",
    text: "Employee volunteering intersects with retention, culture, and employer brand. The Campus gives you a lens on how to connect social impact programming to the outcomes your leadership already measures.",
    accent: "bg-dark-teal",
  },
];

const WhoThisIsFor = () => {
  return (
    <section className="py-16 md:py-28 px-4 section-light-teal overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            Built for the people doing the work.
          </h2>
          <p className="text-dark-teal text-center text-base md:text-lg mb-12 max-w-2xl mx-auto">
            Whether you lead strategy or rally volunteers, the Campus meets you where you are.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 120}>
              <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift group relative overflow-hidden h-full">
                {/* Accent bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${card.accent} rounded-l-xl`} />
                <div className="pl-3">
                  <div className="w-12 h-12 rounded-lg bg-dark-teal/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <card.icon className="text-dark-teal" size={24} />
                  </div>
                  <h3 className="text-hero-navy font-medium text-lg md:text-xl mb-3">{card.title}</h3>
                  <p className="text-dark-grey font-light text-[15px] md:text-base leading-relaxed">{card.text}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
