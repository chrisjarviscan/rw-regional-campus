import { Clock, Coffee, Wrench, MessageSquare, Brain, Map, Award, Users2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const day1 = [
  { time: "9:00 AM", title: "Welcome and Orientation", desc: "Setting context for why most corporate volunteering fails to produce lasting change", icon: Clock },
  { time: "9:30 AM", title: "The Brief", desc: "Creating proximity between volunteers and beneficiaries; surfacing the disorienting dilemma that opens people to change", icon: Brain },
  { time: "11:00 AM", title: "Task Significance", desc: "How to design volunteer experiences where the work itself communicates meaning", icon: Map },
  { time: "12:00 PM", title: "Lunch and Community", desc: "Facilitated networking with cross-company peers", icon: Coffee },
  { time: "1:00 PM", title: "Guiding Volunteers", desc: "The Tourist-Traveler-Guide framework: recognizing where each volunteer is and meeting them at their highest level of contribution", icon: Users2 },
  { time: "2:30 PM", title: "Practice Lab", desc: "Hands-on application: writing briefs and designing orientation touchpoints for real programs", icon: Wrench },
  { time: "4:00 PM", title: "Day 1 Debrief", desc: "Facilitated reflection on the day's learning", icon: MessageSquare },
];

const day2 = [
  { time: "9:00 AM", title: "Day 1 Recap and Reset", desc: "Reconnecting with key insights from Day 1", icon: Clock },
  { time: "9:30 AM", title: "The Debrief", desc: "Sensemaking and critical reflection: the skill that separates transformation from a nice day out", icon: Brain },
  { time: "11:00 AM", title: "Troubleshooting the Debrief", desc: "Common failure modes and how to recover when debriefs go flat", icon: Wrench },
  { time: "12:00 PM", title: "Lunch and Community", desc: "", icon: Coffee },
  { time: "1:00 PM", title: "Program Design Integration", desc: "Applying Alert-Orient-Act to your actual programs: mapping your current state and designing next moves", icon: Map },
  { time: "2:30 PM", title: "Certification Pathway", desc: "Overview of the two-stage credential and what comes after the Campus", icon: Award },
  { time: "3:30 PM", title: "Action Planning", desc: "Each participant leaves with a concrete 90-day plan", icon: MessageSquare },
  { time: "4:30 PM", title: "Closing and Cohort Connection", desc: "Introduction to the ongoing cohort community", icon: Users2 },
];

const TimelineDay = ({ title, subtitle, items, delay }: { title: string; subtitle: string; items: typeof day1; delay: number }) => (
  <AnimatedSection animation={delay === 0 ? "fade-left" : "fade-right"} delay={delay}>
    <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-hero-orange text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {subtitle}
        </span>
        <h3 className="text-hero-navy font-medium text-lg md:text-xl">{title}</h3>
      </div>
      <div className="relative pl-6 border-l-2 border-hero-orange/30">
        {items.map((item, i) => (
          <div key={i} className="mb-5 last:mb-0 relative group">
            <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-hero-orange group-hover:scale-125 transition-transform" />
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-md bg-dark-teal/10 items-center justify-center mt-0.5">
                <item.icon className="text-dark-teal" size={16} />
              </div>
              <div>
                <div className="text-hero-orange font-bold text-xs mb-0.5">{item.time}</div>
                <div className="text-hero-navy font-medium text-base">{item.title}</div>
                {item.desc && (
                  <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">{item.desc}</p>
                )}
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
            Two Days. Three Frameworks. One Transformation.
          </h2>
          <p className="text-dark-teal text-center text-base md:text-lg mb-4 font-normal">
            The Alert-Orient-Act Framework
          </p>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mb-12" />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TimelineDay title="Day 1" subtitle="ALERT & ORIENT" items={day1} delay={0} />
          <TimelineDay title="Day 2" subtitle="ACT & INTEGRATE" items={day2} delay={150} />
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
