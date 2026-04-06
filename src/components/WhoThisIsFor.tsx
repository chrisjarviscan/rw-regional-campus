import { Users, Target, Heart, Building2 } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "Volunteer Program Managers",
    text: "You run the programs, coordinate the logistics, and report the numbers. You know something is missing but can't name it. The Campus gives you the framework and language to move from transactional volunteering to transformative impact.",
  },
  {
    icon: Target,
    title: "CSR and Social Impact Leaders",
    text: "You set strategy for your company's community engagement. The Campus equips you with an evidence-based methodology you can take back to your leadership team, along with a certification that validates your expertise.",
  },
  {
    icon: Heart,
    title: "Employee Engagement Champions",
    text: "You may not have CSR in your title, but you are the person who cares. You organize volunteer days, rally your team, and wonder why participation does not translate into lasting change. The Campus shows you why and gives you tools to fix it.",
  },
  {
    icon: Building2,
    title: "HR and People Leaders",
    text: "Employee volunteering intersects with retention, culture, and employer brand. The Campus gives you a lens on how to connect social impact programming to the outcomes your leadership already measures.",
  },
];

const WhoThisIsFor = () => {
  return (
    <section className="py-16 md:py-24 px-4 section-light-teal">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-hero-navy font-bold text-[22px] md:text-[30px] text-center mb-12">
          Built for the people doing the work.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-background rounded-lg border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift"
            >
              <card.icon className="text-dark-teal mb-4" size={32} />
              <h3 className="text-hero-navy font-medium text-lg md:text-xl mb-3">{card.title}</h3>
              <p className="text-dark-grey font-light text-[15px] md:text-base">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
