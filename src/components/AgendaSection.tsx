const day1 = [
  { time: "9:00 AM", title: "Welcome and Orientation", desc: "Setting context for why most corporate volunteering fails to produce lasting change" },
  { time: "9:30 AM", title: "The Brief", desc: "Creating proximity between volunteers and beneficiaries; surfacing the disorienting dilemma that opens people to change" },
  { time: "11:00 AM", title: "Task Significance", desc: "How to design volunteer experiences where the work itself communicates meaning" },
  { time: "12:00 PM", title: "Lunch and Community", desc: "Facilitated networking with cross-company peers" },
  { time: "1:00 PM", title: "Guiding Volunteers", desc: "The Tourist-Traveler-Guide framework: recognizing where each volunteer is and meeting them at their highest level of contribution" },
  { time: "2:30 PM", title: "Practice Lab", desc: "Hands-on application: writing briefs and designing orientation touchpoints for real programs" },
  { time: "4:00 PM", title: "Day 1 Debrief", desc: "Facilitated reflection on the day's learning" },
];

const day2 = [
  { time: "9:00 AM", title: "Day 1 Recap and Reset", desc: "Reconnecting with key insights from Day 1" },
  { time: "9:30 AM", title: "The Debrief", desc: "Sensemaking and critical reflection: the skill that separates transformation from a nice day out" },
  { time: "11:00 AM", title: "Troubleshooting the Debrief", desc: "Common failure modes and how to recover when debriefs go flat" },
  { time: "12:00 PM", title: "Lunch and Community", desc: "" },
  { time: "1:00 PM", title: "Program Design Integration", desc: "Applying Alert-Orient-Act to your actual programs: mapping your current state and designing next moves" },
  { time: "2:30 PM", title: "Certification Pathway", desc: "Overview of the two-stage credential and what comes after the Campus" },
  { time: "3:30 PM", title: "Action Planning", desc: "Each participant leaves with a concrete 90-day plan" },
  { time: "4:30 PM", title: "Closing and Cohort Connection", desc: "Introduction to the ongoing cohort community" },
];

const TimelineDay = ({ title, items }: { title: string; items: typeof day1 }) => (
  <div>
    <h3 className="text-hero-navy font-medium text-lg md:text-xl mb-6">{title}</h3>
    <div className="relative pl-6 border-l-2 border-hero-orange">
      {items.map((item, i) => (
        <div key={i} className="mb-6 last:mb-0 relative">
          <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-hero-orange" />
          <div className="text-hero-navy font-bold text-sm mb-0.5">{item.time}</div>
          <div className="text-hero-navy font-medium text-base">{item.title}</div>
          {item.desc && (
            <p className="text-dark-grey font-light text-sm mt-1">{item.desc}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AgendaSection = () => {
  return (
    <section id="agenda" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-hero-navy font-bold text-[22px] md:text-[30px] text-center mb-2">
          Two Days. Three Frameworks. One Transformation.
        </h2>
        <p className="text-dark-teal text-center text-base md:text-lg mb-12 font-normal">
          The Alert-Orient-Act Framework
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <TimelineDay title="Day 1: ALERT & ORIENT" items={day1} />
          <TimelineDay title="Day 2: ACT & INTEGRATE" items={day2} />
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
