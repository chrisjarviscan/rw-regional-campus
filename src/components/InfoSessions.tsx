import { ArrowRight, Calendar, Video } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const sessions = [
  {
    label: "Wednesday, July 15",
    time: "3:00 PM ET",
    href: "https://us06web.zoom.us/meeting/register/ZIk1k7gWQVyTrgu9Q83twQ",
  },
  {
    label: "Thursday, August 13",
    time: "1:00 PM ET",
    href: "https://us06web.zoom.us/meeting/register/Ll0As4B5RqewA0gH9aDjMw",
  },
];

const InfoSessions = () => {
  return (
    <section id="info-sessions" className="relative py-14 md:py-20 px-4 bg-hero-navy overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-dark-teal/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-hero-orange/5 blur-3xl" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-hero-orange/15 text-primary-foreground border border-hero-orange/30 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-sm mb-4">
              <Video size={14} />
              Live Info Sessions
            </div>
            <h2 className="text-primary-foreground font-bold text-2xl md:text-4xl mb-3">
              Curious about the Regional Campus?
            </h2>
            <p className="text-light-teal text-base md:text-lg max-w-2xl mx-auto">
              Join an informal, interactive session to see what your volunteer ambassadors will walk away with — and what partnership looks like.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <a
                key={session.href}
                href={session.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center bg-primary-foreground/5 border border-primary-foreground/15 rounded-lg p-6 hover:bg-primary-foreground/10 hover:border-hero-orange/50 transition-all"
              >
                <div className="flex items-center gap-2 text-hero-orange font-bold text-lg mb-1">
                  <Calendar size={18} />
                  {session.label}
                </div>
                <div className="text-light-teal text-sm mb-4">{session.time}</div>
                <div className="inline-flex items-center gap-2 bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-5 py-2.5 group-hover:brightness-90 transition-all">
                  Register on Zoom
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default InfoSessions;
