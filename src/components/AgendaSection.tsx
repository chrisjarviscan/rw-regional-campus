import { Users2, Compass, Lightbulb, HandHeart, MessageSquare, Coffee, Wrench, Map, Award } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const day1 = [
  { title: "Welcome and Community Building", desc: "Meet your cohort: peers from across companies and industries who came to do this work better.", icon: Users2 },
  { title: "Understanding the Employee Volunteering Landscape", desc: "Where corporate volunteering sits today, what works, and where it falls short of what people came for.", icon: Compass },
  { title: "What Is Transformative Volunteering, and Why Does It Matter?", desc: "The shift from one-off activity to experiences that change how people see their work, their company, and their community.", icon: Lightbulb },
  { title: "Train-the-Trainer Volunteer Experience", desc: "An immersive ~4-hour session with a real nonprofit partner, designed and debriefed the way you'll lead them at home.", icon: HandHeart },
  { title: "On-Site Reception and Reflection", desc: "Food, conversation, and structured reflection to close the day.", icon: Coffee },
];

const day2 = [
  { title: "Community Debrief: What Have We Learned So Far?", desc: "Reconvene with your cohort and turn yesterday's experience into shared insight.", icon: MessageSquare },
  { title: "Planning and Facilitating Volunteer Events", desc: "How to recruit and motivate volunteers, work with nonprofit partners, make events safe and inclusive, respond when things go wrong, and recognize the people leading alongside you.", icon: Wrench },
  { title: "Cross-Company Peer Design Workshop", desc: "Bring your real program. Get feedback from peers who run programs of their own.", icon: Map },
  { title: "Cohort Commitments: Actions You'll Lead at Home", desc: "Leave with a concrete plan and a community to lean on while you put it into practice.", icon: Award },
];

const TimelineDay = ({ title, subtitle, items, delay }: { title: string; subtitle: string; items: typeof day1; delay: number }) => (
  <AnimatedSection animation={delay === 0 ? "fade-left" : "fade-right"} delay={delay}>
    <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-hero-orange text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {subtitle}
        </span>
        <h3 className="text-hero-navy font-medium text-lg md:text-xl">{title}</h3>
      </div>
      <div className="relative pl-6 border-l-2 border-hero-orange/30">
        {items.map((item, i) => (
          <div key={i} className="mb-6 last:mb-0 relative group">
            <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-hero-orange group-hover:scale-125 transition-transform" />
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-md bg-dark-teal/10 items-center justify-center mt-0.5">
                <item.icon className="text-dark-teal" size={16} />
              </div>
              <div>
                <div className="text-hero-navy font-medium text-base">{item.title}</div>
                <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AnimatedSection>
);

const AgendaSection = () => {
  return (
    <section id="agenda" className="py-16 md:py-28 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-2">
            Two days, designed to be lived through, not lectured at.
          </h2>
          <p className="text-dark-teal text-center text-base md:text-lg mb-4 font-normal max-w-2xl mx-auto">
            Day one builds the foundation through an immersive volunteer experience. Day two turns that experience into a plan you can lead at home.
          </p>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mb-12" />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TimelineDay title="Day 1" subtitle="FOUNDATION & IMMERSION" items={day1} delay={0} />
          <TimelineDay title="Day 2" subtitle="APPLICATION & INTEGRATION" items={day2} delay={150} />
        </div>
        <AnimatedSection delay={400}>
          <p className="text-dark-grey font-light text-[13px] text-center max-w-xl mx-auto mt-10">
            All sessions include meals, materials, and networking opportunities.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AgendaSection;
