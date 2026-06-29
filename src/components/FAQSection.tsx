// icons removed for a cleaner brand-aligned heading
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "How is this different from a conference?",
    a: "Conferences deliver information to audiences. The Campus is a facilitated learning experience where you practice skills, work through real scenarios from your own programs, and leave with a concrete action plan. The cohort is capped at 40 to 50 people so every participant gets direct facilitator interaction.",
  },
  {
    q: "Who should attend Campus?",
    a: "Campus is built for employee volunteer leaders — the people on your team who already lead, coordinate, or champion your company's volunteering. Sometimes they're called Champions or Ambassadors. Sometimes they don't have a title yet. If you run your company's CSR program, you're the one who sends them. For your own training, see Social REV Live at https://www.realizedworth.com/social-rev-live.",
  },
  {
    q: "What if my company wants to send a team?",
    a: "Many participants come in twos or threes — the work travels further when you bring a colleague. Multi-pack pricing (6, 12, or 18 seats) offers volume discounts and can be split across any 2026–2027 campuses. To preserve the multi-company learning environment, no single organization can hold more than one-third of the seats at any campus.",
  },
  {
    q: "Is the certification recognized?",
    a: "The Certificate of Completion and the Certified Transformative Volunteering Leader credential are issued by Realized Worth. The methodology behind the program has been developed and tested over more than fifteen years with Fortune 500 companies globally.",
  },
  {
    q: "Can I attend virtually?",
    a: "No. The Campus is designed as an in-person, immersive experience. The experiential components, small-group facilitation, and community dynamics require physical presence.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellation and refund policy details will be available soon. Please contact us for more information.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-28 px-4 bg-background overflow-hidden">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection>
          <h2 className="text-hero-navy font-bold text-[22px] md:text-[32px] text-center">
            Frequently asked questions
          </h2>
          <div className="w-16 h-1 bg-hero-orange mx-auto rounded-full mt-4 mb-12" />
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-light-grey group">
                <AccordionTrigger className="text-hero-navy font-medium text-left text-base py-5 hover:no-underline [&>svg]:text-dark-teal group-hover:text-hero-orange transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-dark-grey font-light text-[15px] pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
