interface FinalCTAProps {
  onRegisterClick: () => void;
}

const FinalCTA = ({ onRegisterClick }: FinalCTAProps) => {
  return (
    <section className="py-20 md:py-28 px-4 bg-hero-navy">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-primary-foreground font-bold text-[28px] md:text-[48px] leading-tight mb-4">
          Your team is already volunteering. It's time to make it count.
        </h2>
        <p className="text-light-teal text-base md:text-lg mb-10 font-normal">
          Register for the 2026 Regional Campus and bring Transformative Volunteering to your organization.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRegisterClick}
            className="bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-7 py-3.5 hover:brightness-90 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            Register Now
          </button>
          <a
            href="mailto:campus@realizedworth.com"
            className="border-2 border-primary-foreground text-primary-foreground font-bold text-base rounded-md px-7 py-3.5 hover:bg-primary-foreground/10 transition-all w-full sm:w-auto text-center"
          >
            Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
