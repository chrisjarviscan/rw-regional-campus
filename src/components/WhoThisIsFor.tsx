import { Users, Compass, Heart, UsersRound } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const cards = [
  {
    icon: Heart,
    title: "Already Doing More Than Asked",
    text: "You organize the sign-ups, rally the team, and follow up without being asked twice. Nobody told you to care this much; you just do. The Campus gives you a framework, language, and a community of peers who recognize the work.",
    accent: "bg-hero-orange",
  },
  {
    icon: Compass,
    title: "Asking the Deeper Question",
    text: "You want depth, not just logistics. You're the one quietly asking, \"how do we make this more meaningful?\" The Campus shows you how — and gives you the credential to go with it.",
    accent: "bg-dark-teal",
  },
  {
    icon: Users,
    title: "Carrying Impact Without a Title",
    text: "Champion. Ambassador. Social Impact Lead. Volunteer Committee Member. Or no title at all. If you lead employee volunteering at your company in any form, the Campus is built for you.",
    accent: "bg-mustard",
  },
  {
    icon: UsersRound,
    title: "Bringing Others With You",
    text: "When you're engaged, your team follows. Many participants come in twos or threes — the work travels further when you bring a colleague. Multi-pack pricing makes it straightforward.",
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
            Your most committed volunteer leaders — at any title, from any team. Come on your own, or bring a colleague or two.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 120}>
              <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift group relative overflow-hidden h-full">
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
