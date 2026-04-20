import rwLogoWhite from "@/assets/logos/RW_Logo_White_Web.png";

const navLinks = ["Program", "Agenda", "Cities", "Pricing", "Certification", "FAQ", "Contact"];

const Footer = () => {
  return (
    <footer className="bg-hero-navy py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img
              src={rwLogoWhite}
              alt="Realized Worth"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href={link === "Contact" ? "mailto:contact@realizedworth.com" : `#${link.toLowerCase()}`}
                className="text-primary-foreground/80 hover:text-primary-foreground font-normal text-sm transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <a href="mailto:nichole@realizedworth.com" className="text-light-teal text-sm hover:underline">
              nichole@realizedworth.com
            </a>
            <span className="text-light-grey/70 text-xs">
              Nichole Giller · Director of Experience &amp; Integration
            </span>
          </div>
        </div>
        <div className="border-t border-light-grey/30 pt-6 text-center space-y-1">
          <p className="text-light-teal/80 font-light italic text-[13px]">
            Create space for transformation.
          </p>
          <p className="text-light-grey font-light text-[13px]">
            © 2026 RW Institute, a Realized Worth program. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
