import AnimatedSection from "./AnimatedSection";

const audiences = [
  {
    label: "For the employee volunteer leader",
    body:
      "You leave with a defensible methodology, a peer network of people doing the same work in other companies, and a two-stage certification that signals real practice — not a webinar badge. You'll know how to design experiences that change how participants think, not just how they spend a Saturday.",
  },
  {
    label: "For the volunteering program",
    body:
      "Your program stops being a logistics function and starts producing outcomes leadership can point to: stronger retention of volunteer participants, more skilled volunteer leaders inside the company, and projects that nonprofit partners actually want to keep running with you.",
  },
  {
    label: "For the company (the pitch up)",
    body:
      "This is the material you take to your VP, your CHRO, or your CSR steering committee. A trained cohort of volunteer leaders produces measurable shifts in employee engagement, manager development, and the credibility of the company's social-impact reporting — without expanding headcount.",
  },
  {
    label: "For the communities you serve",
    body:
      "Volunteers who have been through Transformative Volunteering show up differently: better prepared, less extractive, more useful to the nonprofits hosting them. The community gets a partner that listens before acting, and a relationship that compounds across years instead of resetting each quarter.",
  },
];

const IntendedOutcomes = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <span className="block text-hero-orange font-bold text-sm uppercase tracking-[0.15em] mb-3">
            What you walk away with
          </span>
          <h2 className="text-hero-navy font-bold text-[24px] md:text-[36px] mb-4 max-w-3xl">
            What the campus is actually meant to produce
          </h2>
          <p className="text-dark-grey font-light text-base md:text-lg max-w-3xl mb-12">
            The Regional Campus is built to serve four audiences at once. Most volunteer training serves one. If you're building the case to bring a colleague or to ask your company to send you, this is the language to use.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {audiences.map((a, i) => (
            <AnimatedSection key={a.label} delay={i * 100} animation="scale">
              <div className="h-full bg-light-teal/20 border border-light-teal rounded-xl p-6 md:p-7 hover-lift">
                <h3 className="text-hero-navy font-bold text-lg md:text-xl mb-3">
                  {a.label}
                </h3>
                <p className="text-dark-grey font-light text-sm md:text-base leading-relaxed">
                  {a.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntendedOutcomes;
