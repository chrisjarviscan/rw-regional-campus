const BecomeHost = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-hero-navy">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-primary-foreground font-bold text-[22px] md:text-[30px] mb-6">
          Bring the Campus to Your City
        </h2>
        <p className="text-primary-foreground font-light text-base md:text-lg max-w-[720px] mx-auto mb-8">
          The Regional Campus works best when a local corporate partner hosts the experience. Provide venue and catering for two days, and your organization receives preferred registration access, brand visibility as the campus host, and a leadership position in transformative social impact in your market.
        </p>
        <button className="bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-7 py-3.5 hover:brightness-90 hover:-translate-y-0.5 transition-all">
          Become a Host
        </button>
      </div>
    </section>
  );
};

export default BecomeHost;
