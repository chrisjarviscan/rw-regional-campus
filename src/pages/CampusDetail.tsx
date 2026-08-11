import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, HandHeart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ReserveSeatsModal from "@/components/ReserveSeatsModal";
import RegistrationModal from "@/components/RegistrationModal";
import { getCampus } from "@/data/campuses";

const CampusDetail = () => {
  const { slug } = useParams();
  const campus = getCampus(slug);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  if (!campus || !campus.detail) return <Navigate to="/" replace />;

  const d = campus.detail;
  const isOpen = campus.status === "Registration Open";

  const pending = !d.venue && !d.days && !d.nonprofit;


  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${campus.city} Campus — ${campus.dates} | RW Regional Campus`}</title>
        <meta
          name="description"
          content={`Details for the Realized Worth Regional Campus in ${campus.city}, ${campus.dates}: schedule, venue, travel guidance, and registration.`}
        />
        {d.draft && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={campus.image} alt={`${campus.city} skyline`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-navy/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-hero-navy via-hero-navy/85 to-hero-navy/40" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 px-4 pt-10 pb-14 md:pt-14 md:pb-20">
          <Link
            to="/#cities"
            className="inline-flex items-center gap-2 text-light-teal text-sm font-medium hover:text-primary-foreground transition-colors mb-10"
          >
            <ArrowLeft size={15} />
            All campuses
          </Link>

          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14 items-end">
            <div>
              <span
                className={`inline-block ${campus.statusColor} text-primary-foreground text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-5`}
              >
                {campus.status}
              </span>
              <h1 className="text-primary-foreground font-bold text-[34px] md:text-[56px] leading-[1.05] mb-4">
                {campus.city}
              </h1>
              <div className="inline-flex items-center gap-2.5 text-light-teal text-lg md:text-xl font-medium mb-5">
                <Calendar size={20} />
                {campus.dates}
              </div>
              <p className="text-primary-foreground/75 font-light text-base max-w-xl">{campus.text}</p>
            </div>

            <div className="md:pb-1">
              <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] backdrop-blur-sm p-5 md:p-6">
                {campus.deadline && (
                  <div className="flex items-start gap-2.5 mb-5">
                    <Clock className="text-hero-orange mt-0.5 shrink-0" size={18} />
                    <div>
                      <div className="text-primary-foreground/60 text-[11px] font-bold uppercase tracking-[0.12em]">
                        Registration deadline
                      </div>
                      <div className="text-primary-foreground font-semibold text-base">{campus.deadline}</div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => (isOpen ? setReserveOpen(true) : setInterestOpen(true))}
                  className="w-full inline-flex items-center justify-center gap-2 bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-6 py-3.5 hover:brightness-90 transition-all"
                >
                  {isOpen ? "Reserve My Seats" : "Notify Me"}
                  <ArrowRight size={16} />
                </button>
                <p className="text-primary-foreground/60 text-xs mt-3 text-center">
                  Roughly 40 seats, up to 8 companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      {(d.venue?.address || (d.dayTimes && d.dayTimes.length > 0)) && (
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <AnimatedSection>
              <h2 className="text-hero-navy font-bold text-[20px] md:text-[26px] mb-6">At a glance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {d.venue?.address && (
                  <div className="md:col-span-1 rounded-2xl bg-hero-navy p-7 flex flex-col justify-between min-h-[190px]">
                    <MapPin className="text-hero-orange" size={26} />
                    <div className="mt-6">
                      <div className="text-light-teal text-[11px] font-bold uppercase tracking-[0.14em] mb-2">
                        Where
                      </div>
                      {d.venue.name && (
                        <div className="text-primary-foreground font-bold text-xl leading-snug">
                          {d.venue.name}
                        </div>
                      )}
                      <div className="text-primary-foreground/75 text-base mt-1">{d.venue.address}</div>
                    </div>
                  </div>
                )}
                {d.dayTimes?.map((dt, i) => (
                  <div
                    key={dt.label}
                    className={`rounded-2xl p-7 flex flex-col justify-between min-h-[190px] ${
                      i === 0 ? "bg-dark-teal" : "bg-hero-orange"
                    }`}
                  >
                    <Clock className="text-primary-foreground/80" size={26} />
                    <div className="mt-6">
                      <div className="text-primary-foreground/75 text-[11px] font-bold uppercase tracking-[0.14em] mb-2">
                        {dt.label}
                      </div>
                      <div className="text-primary-foreground font-bold text-[26px] leading-tight">
                        {dt.window}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}


      {/* Agenda with times */}
      {d.days && d.days.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-light-teal/10">
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection>
              <h2 className="text-hero-navy font-bold text-[20px] md:text-[26px] mb-8">Schedule</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {d.days.map((day, di) => (
                <AnimatedSection key={day.label} delay={di * 120}>
                  <div className="bg-background rounded-xl border border-light-grey p-6 h-full">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-hero-orange text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {day.subtitle}
                      </span>
                      <h3 className="text-hero-navy font-medium text-lg">{day.label}</h3>
                    </div>
                    {day.hours && <p className="text-dark-teal text-sm font-medium mb-5">{day.hours}</p>}
                    <div className="relative pl-6 border-l-2 border-hero-orange/30 mt-5">
                      {day.items.map((item, i) => (
                        <div key={i} className="mb-6 last:mb-0 relative">
                          <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-hero-orange" />
                          {item.time && (
                            <div className="text-dark-teal font-semibold text-xs mb-0.5">{item.time}</div>
                          )}
                          <div className="text-hero-navy font-medium text-base">{item.title}</div>
                          {item.desc && (
                            <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">{item.desc}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection delay={300}>
              <p className="text-hero-navy/60 italic text-[14px] text-center mt-8">
                Agenda subject to change. All sessions, timings, and activities may be updated as we finalize each campus.
              </p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Venue & getting there */}
      {d.venue && (
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection>
              <h2 className="text-hero-navy font-bold text-[20px] md:text-[26px] mb-6">Venue and getting there</h2>
              <div className="rounded-xl border border-light-grey p-6 space-y-4">
                <div>
                  <div className="text-hero-navy font-medium text-lg">{d.venue.name}</div>
                  {d.venue.address && (
                    <p className="text-dark-grey font-light text-sm mt-1">{d.venue.address}</p>
                  )}
                </div>
                {d.venue.gettingThere && (
                  <p className="text-dark-grey font-light text-base leading-relaxed">{d.venue.gettingThere}</p>
                )}
                {d.venue.parking && (
                  <p className="text-dark-grey font-light text-base leading-relaxed">{d.venue.parking}</p>
                )}
                {d.venue.hotels && (
                  <p className="text-dark-grey font-light text-base leading-relaxed">{d.venue.hotels}</p>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Volunteer experience */}
      {d.nonprofit && (
        <section className="py-12 md:py-16 px-4 bg-light-teal/10">
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-dark-teal/10 flex items-center justify-center">
                  <HandHeart className="text-dark-teal" size={20} />
                </div>
                <h2 className="text-hero-navy font-bold text-[20px] md:text-[26px]">The volunteer experience</h2>
              </div>
              {d.nonprofit.name && (
                <div className="text-hero-navy font-medium text-lg mb-2">{d.nonprofit.name}</div>
              )}
              <p className="text-dark-grey font-light text-base leading-relaxed max-w-3xl">
                {d.nonprofit.description}
              </p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Still confirming */}
      {pending && (
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection>
              <div className="rounded-xl border border-light-grey bg-light-teal/10 p-6 md:p-8">
                <h2 className="text-hero-navy font-bold text-[20px] md:text-[24px] mb-3">
                  Logistics we're finalizing
                </h2>
                <p className="text-dark-grey font-light text-base leading-relaxed max-w-2xl">
                  Start and end times, the venue and its neighborhood, travel and overnight guidance, and the
                  nonprofit partner for the Day 1 volunteer experience will be posted here as each is confirmed.
                  If you need any of it now to plan travel or get an approval through, email{" "}
                  <a
                    href={`mailto:nichole@realizedworth.com?subject=${encodeURIComponent(
                      `${campus.city} campus logistics`,
                    )}`}
                    className="text-dark-teal font-medium underline underline-offset-2"
                  >
                    nichole@realizedworth.com
                  </a>{" "}
                  and we'll share what we have.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Travel & logistics FAQ */}
      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="text-hero-navy font-bold text-[20px] md:text-[26px] mb-6">Travel and logistics</h2>
            <div className="space-y-5">
              <div>
                <div className="text-hero-navy font-medium text-base">Is this in person?</div>
                <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">
                  Yes. Both days are in person, and Day 1 includes an off-site volunteer experience with a local
                  nonprofit partner. There is no virtual option.
                </p>
              </div>
              <div>
                <div className="text-hero-navy font-medium text-base">Do I need to stay overnight?</div>
                <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">
                  {d.overnight ??
                    "Participants travelling from outside the region typically arrive the evening before Day 1 and stay one night between the two days. Hotel guidance for this campus will be posted here."}
                </p>
              </div>
              <div>
                <div className="text-hero-navy font-medium text-base">What's included?</div>
                <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">
                  {d.mealsIncluded ??
                    "Meals during the program days, all materials, and the volunteer experience are included. Travel and accommodation are not."}
                </p>
              </div>
              <div>
                <div className="text-hero-navy font-medium text-base">Can I send more than one person?</div>
                <p className="text-dark-grey font-light text-sm mt-1 leading-relaxed">
                  Yes, and most companies do. Each campus is capped at roughly 40 participants from up to 8
                  companies, with no more than a third of seats from any single organization. Seats can also be
                  split across campuses.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 px-4 bg-hero-navy">
        <div className="container mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="text-primary-foreground font-bold text-[22px] md:text-[30px] mb-3">
              Join us in {campus.city.split(",")[0]}
            </h2>
            <p className="text-light-teal text-base mb-7">
              {isOpen
                ? `Registration closes ${campus.deadline ?? "closer to the date"}. Seats are limited to roughly 40 participants.`
                : "Express interest and we'll notify you the moment registration opens."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => (isOpen ? setReserveOpen(true) : setInterestOpen(true))}
                className="inline-flex items-center gap-2 bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-6 py-3.5 hover:brightness-90 transition-all"
              >
                {isOpen ? "Reserve My Seats" : "Notify Me"}
                <ArrowRight size={16} />
              </button>
              <Link
                to="/#info-sessions"
                className="text-primary-foreground font-medium text-sm border-b border-primary-foreground/40 hover:border-primary-foreground transition-colors pb-0.5"
              >
                Join a live info session
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
      <ReserveSeatsModal open={reserveOpen} onClose={() => setReserveOpen(false)} campus={campus.campusValue} />
      <RegistrationModal
        open={interestOpen}
        onClose={() => setInterestOpen(false)}
        initialCampus={campus.campusValue}
      />
    </div>
  );
};

export default CampusDetail;
