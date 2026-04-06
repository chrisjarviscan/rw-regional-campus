import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How is this different from a conference?",
    a: "Conferences deliver information to audiences. The Campus is a facilitated learning experience where you practice skills, work through real scenarios from your own programs, and leave with a concrete action plan. The cohort is capped at 40 to 50 people so every participant gets direct facilitator interaction.",
  },
  {
    q: "Do I need to be a CSR professional to attend?",
    a: "No. The Campus is designed for anyone who leads, manages, or champions employee volunteering and community engagement, regardless of title. HR leaders, employee engagement managers, and grassroots volunteer champions all benefit from the methodology.",
  },
  {
    q: "What if my company wants to send a team?",
    a: "Corporate packages offer volume pricing and additional benefits like group onboarding calls and post-event team debriefs. To preserve the multi-company learning dynamic, no single organization can hold more than one-third of the seats at any campus.",
  },
  {
    q: "Is the certification recognized?",
    a: "The Certificate of Completion and the Certified Transformative Volunteering Leader credential are issued by Realized Worth Institute. The methodology behind the program has been developed and tested over more than fifteen years with Fortune 500 companies globally.",
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
    <section id="faq" className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-hero-navy font-bold text-[22px] md:text-[30px] text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-light-grey">
              <AccordionTrigger className="text-hero-navy font-medium text-left text-base py-5 hover:no-underline [&>svg]:text-dark-teal">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-dark-grey font-light text-[15px] pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
