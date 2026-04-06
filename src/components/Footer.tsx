const navLinks = ["Program", "Agenda", "Cities", "Pricing", "Certification", "FAQ", "Contact"];

const Footer = () => {
  return (
    <footer className="bg-hero-navy py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-primary-foreground font-bold text-lg">Realized Worth</span>
            <span className="w-px h-4 bg-primary-foreground/40" aria-hidden="true" />
            <span className="text-light-teal font-medium text-[15px]">RW Institute</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href={link === "Contact" ? "mailto:campus@realizedworth.com" : `#${link.toLowerCase()}`}
                className="text-primary-foreground/80 hover:text-primary-foreground font-normal text-sm transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <a href="mailto:campus@realizedworth.com" className="text-light-teal text-sm hover:underline">
            campus@realizedworth.com
          </a>
        </div>
        <div className="border-t border-light-grey/30 pt-6 text-center">
          <p className="text-light-grey font-light text-[13px]">
            © 2026 Realized Worth Institute. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
