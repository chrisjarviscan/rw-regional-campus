import AnimatedSection from "@/components/AnimatedSection";
import chrisHeadshot from "@/assets/chris-jarvis-headshot.jpg";
import nicholeHeadshot from "@/assets/nichole-giller-headshot.jpg";
import { trackMailto } from "@/lib/trackMailto";

const CampusTeam = () => {
  return (
    <section id="team" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-hero-navy mb-4">
              The people you'll work with
            </h2>
            <p className="text-lg text-foreground/70">
              The campus is small by design. You'll spend real time with the people who built it.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <AnimatedSection animation="fade-right">
            <article className="bg-card rounded-2xl p-8 shadow-sm border border-border h-full">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                <img
                  src={nicholeHeadshot}
                  alt="Headshot of Nichole Giller, Director of Experience and Integration"
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-hero-navy">Nichole Giller</h3>
                  <p className="text-sm text-dark-teal font-bold mb-3">
                    Director of Experience & Integration
                  </p>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                    Nichole leads operations for the Regional Campus Series, from registration through certification. With a background in neuroscience, emergency management, and public health, she makes sure every detail of the experience supports the learning. She's your first point of contact for questions about registration, logistics, and what to expect.
                  </p>
                  <a
                    href="mailto:nichole@realizedworth.com"
                    onClick={() => trackMailto({ ctaLabel: "Email Nichole", ctaLocation: "campus_team", emailTo: "nichole@realizedworth.com" })}
                    className="text-sm font-medium text-hero-navy hover:text-hero-orange transition-colors underline underline-offset-4"
                  >
                    nichole@realizedworth.com
                  </a>
                </div>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={100}>
            <article className="bg-card rounded-2xl p-8 shadow-sm border border-border h-full">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                <img
                  src={chrisHeadshot}
                  alt="Headshot of Chris Jarvis, Co-Founder and CSO of Realized Worth"
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-hero-navy">Chris Jarvis</h3>
                  <p className="text-sm text-dark-teal font-bold mb-3">
                    Co-Founder & CSO, Realized Worth
                  </p>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    Chris co-founded Realized Worth in 2008 and created the Transformative Volunteering methodology that anchors every campus. With 25 years of experience across neuroscience, behavioral science, and organizational change, his work has shaped volunteer programs at companies including SAP, Medtronic, Abbott, Deloitte, Apple, and Microsoft. He co-leads the curriculum alongside Nichole and facilitation lead Tim Parsons.
                  </p>
                </div>
              </div>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CampusTeam;
