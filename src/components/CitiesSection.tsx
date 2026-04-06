const cities = [
  {
    city: "Seattle, WA",
    dates: "Fall 2026",
    status: "Pilot Campus",
    statusColor: "bg-dark-teal",
    text: "The inaugural Regional Campus. Dates will be confirmed soon.",
  },
  {
    city: "Detroit, MI",
    dates: "Q4 2026",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "Partnering with a major corporate host in the Motor City.",
  },
  {
    city: "Atlanta, GA",
    dates: "October 2026",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "A Southeast campus with a confirmed venue partner.",
  },
];

const CitiesSection = () => {
  return (
    <section id="cities" className="py-16 md:py-24 px-4 bg-hero-navy">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-primary-foreground font-bold text-[22px] md:text-[30px] text-center mb-12">
          Where We're Headed in 2026
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((c) => (
            <div
              key={c.city}
              className="bg-background rounded-lg border border-light-grey p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover-lift"
            >
              <span className={`${c.statusColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}>
                {c.status}
              </span>
              <h3 className="text-hero-navy font-medium text-xl mt-4 mb-1">{c.city}</h3>
              <p className="text-dark-teal font-normal text-sm mb-3">{c.dates}</p>
              <p className="text-dark-grey font-light text-sm mb-5">{c.text}</p>
              <button className="w-full bg-hero-orange text-primary-foreground font-bold text-sm rounded-md py-3 hover:brightness-90 transition-all">
                Get Notified
              </button>
            </div>
          ))}
        </div>
        <p className="text-light-teal text-center text-sm mt-8 font-normal">
          More cities coming. Toronto, Bay Area, and Chicago are under consideration.
        </p>
      </div>
    </section>
  );
};

export default CitiesSection;
