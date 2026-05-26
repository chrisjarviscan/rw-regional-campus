import AnimatedSection from "./AnimatedSection";

const WhoIsAnEVL = () => {
  return (
    <section className="py-14 md:py-20 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] mb-6">
            Who is an employee volunteer leader?
          </h2>
          <p className="text-dark-grey font-light text-base md:text-lg leading-relaxed mb-5">
            They're the person on your team who's already doing more than asked. They organize the sign-ups, rally their colleagues, and follow up without being told twice. They might be called a Champion, an Ambassador, a Social Impact Lead, or a Volunteer Committee member. Or they might not have a title at all yet — just the instinct to lead this work.
          </p>
          <p className="text-dark-grey font-light text-base md:text-lg leading-relaxed">
            The Regional Campus is built to train them. If you run your company's CSR or volunteering program, this is the experience you send them to. If you're a CSR professional looking for your own training, see{" "}
            <a
              href="https://www.realizedworth.com/social-rev-live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hero-orange font-medium border-b border-hero-orange/40 hover:border-hero-orange transition-colors"
            >
              Social REV Live
            </a>
            .
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhoIsAnEVL;
