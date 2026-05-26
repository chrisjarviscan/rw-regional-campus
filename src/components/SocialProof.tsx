import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "15+", label: "Years of methodology development" },
  { value: "Fortune 500", label: "Tested across technology, financial services, retail, and energy" },
  { value: "By Realized Worth", label: "The team behind Social REV Live" },
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="bg-hero-navy/[0.03] rounded-2xl p-8 md:p-10 border border-hero-navy/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="text-hero-navy font-bold text-2xl md:text-3xl mb-2">
                    {s.value}
                  </div>
                  <div className="text-dark-grey font-light text-sm leading-relaxed">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SocialProof;
