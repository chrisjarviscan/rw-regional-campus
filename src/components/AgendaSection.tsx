import { Users2, Compass, Lightbulb, HandHeart, MessageSquare, Coffee, Wrench, Map, Award, Sunrise, Utensils, Megaphone } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const day1 = [
  { time: "8:30 AM", title: "Arrival and coffee", desc: "Check in, grab coffee, and connect with fellow participants before the day begins.", icon: Sunrise },
  { time: "9:00 AM", title: "Welcome and community building", desc: "Meet your cohort: peers from across companies and industries who came to do this work better.", icon: Users2 },
  { time: "9:45 AM", title: "What is Transformative Volunteering, and why it matters", desc: "The shift from one-off activity to experiences that change how people see their work, their company, and their community.", icon: Lightbulb },
  { time: "10:35 AM", title: "Learning modules", desc: "Short, practical sessions on the building blocks of a transformative experience — sense-making, the brief, the debrief, and proximity.", icon: Compass },
  { time: "11:55 AM", title: "Lunch, provided", desc: "Eat together before heading off-site.", icon: Utensils },
  { time: "12:25 PM", title: "Volunteer experience with a local nonprofit partner (off-site)", desc: "A hands-on project with the campus host city's nonprofit partner, designed and debriefed the way you'll lead one at home. The cohort travels together and returns together.", icon: HandHeart },
  { time: "4:45 PM", title: "Return and closing reflection", desc: "Head back, decompress, and close the day with a short reflection.", icon: Coffee },
  { time: "5:00 PM", title: "End of Day 1", desc: "Your evening is your own. Day 2 begins at 8:30 AM.", icon: Award },
];

const day2 = [
  { time: "8:30 AM", title: "Coffee and informal connection", desc: "Reconvene with your cohort and share what surfaced overnight.", icon: Sunrise },
  { time: "9:00 AM", title: "Community debrief", desc: "Turn yesterday's experience into shared insight — name what landed, and what you're still sitting with.", icon: MessageSquare },
  { time: "10:00 AM", title: "Peer design workshop", desc: "Bring your own program. Work it with peers who've done this and get concrete, generous feedback.", icon: Map },
  { time: "11:30 AM", title: "Lunch, provided", desc: "", icon: Utensils },
  { time: "12:15 PM", title: "From experience to leadership skills", desc: "Translate what you do as a volunteer leader into named professional competencies, and language you can take to your manager.", icon: Wrench },
  { time: "1:30 PM", title: "Tell the story and make the case", desc: "Build a short, compelling way to communicate your program's value to leadership, using both data and story.", icon: Megaphone },
  { time: "2:30 PM", title: "Cohort commitments and what comes next", desc: "Name one concrete action you'll take in the next 30 days, and see how the cohort stays connected.", icon: Compass },
  { time: "3:15 PM", title: "Certification and closing", desc: "Celebrate the work, receive your certificate of completion, and close the campus together.", icon: Award },
];


const TimelineDay = ({ title, subtitle, hours, items, delay }: { title: string; subtitle: string; hours: string; items: typeof day1; delay: number }) => (
  <AnimatedSection animation={delay === 0 ? "fade-left" : "fade-right"} delay={delay}>
    <div className="bg-background rounded-xl border border-light-grey p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] h-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="bg-hero-orange text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {subtitle}
        </span>
        <h3 className="text-hero-navy font-medium text-lg md:text-xl">{title}</h3>
      </div>
      <div className="text-dark-teal font-medium text-sm mb-6">{hours}</div>
      <div className="relative pl-6 border-l-2 border-hero-orange/30">
        {items.map((item, i) => (
          <div key={i} className="mb-6 last:mb-0 relative group">
            <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-hero-orange group-hover:scale-125 transition-transform" />
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-md bg-dark-teal/10 items-center justify-center mt-0.5">
                <item.icon className="text-dark-teal" size={16} />
              </div>
              <div>
                <div className="text-dark-teal font-medium text-xs tracking-wide">{item.time}</div>
                <div className="text-hero-navy font-medium text-base">{item.title}</div>
                {item.desc && <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">{item.desc}</p>}
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
          <TimelineDay title="Day 1" subtitle="FOUNDATION & IMMERSION" hours="8:30 AM – 5:00 PM" items={day1} delay={0} />
          <TimelineDay title="Day 2" subtitle="APPLICATION & INTEGRATION" hours="8:30 AM – 3:30 PM" items={day2} delay={150} />
        </div>
        <AnimatedSection delay={400}>
          <p className="text-dark-grey font-light text-[13px] text-center max-w-xl mx-auto mt-10">
            All sessions include meals, materials, and networking opportunities.
          </p>
          <p className="text-hero-navy/60 italic text-[14px] text-center max-w-2xl mx-auto mt-3">
            Agenda subject to change. All sessions, timings, and activities may be updated as we finalize each campus.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AgendaSection;
