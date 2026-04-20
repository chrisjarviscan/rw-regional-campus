import { Users, Compass, Network, MessageSquare } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const items = [
  {
    icon: Users,
    title: "Monthly Virtual Gatherings",
    body: "Reconvene with your campus cohort to share progress, troubleshoot challenges, and stay connected across companies.",
  },
  {
    icon: Compass,
    title: "Implementation Coaching",
    body: "Guided 1-on-1 support as you apply what you learned to your own volunteer program.",
  },
  {
    icon: Network,
    title: "Peer Mentoring Network",
    body: "Ongoing access to peers across industries who are leading this same work at their organizations.",
  },
  {
    icon: MessageSquare,
    title: "Shared Digital Platform",
    body: "Your cohort's home for resources, conversation, and the community you built at campus.",
  },
];

const PostCampusCommunity = () => {
  return (
    <section className="py-16 md:py-28 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center mb-3">
            What Continues After the Two Days
          </h2>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mb-4" />
          <p className="text-dark-grey font-light text-center text-base md:text-lg max-w-2xl mx-auto mb-12">
            Every registration includes 6 months of structured community.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 120}>
              <div className="rounded-xl border border-light-grey bg-background p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift h-full">
                <div className="w-10 h-10 rounded-md bg-hero-orange/10 flex items-center justify-center mb-4">
                  <item.icon className="text-hero-orange" size={20} />
                </div>
                <h3 className="text-hero-navy font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-dark-grey font-light text-sm leading-relaxed">{item.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={520}>
          <p className="text-dark-grey font-light italic text-center text-[15px] max-w-2xl mx-auto mt-10">
            The credential validates what you know. The community supports what you do with it.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PostCampusCommunity;
