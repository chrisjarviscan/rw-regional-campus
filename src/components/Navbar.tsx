import { useState } from "react";
import { Menu, X } from "lucide-react";
import rwLogo from "@/assets/logos/RW_Logo_Orange_Web.png";

const navLinks = [
  { label: "Program", href: "#program" },
  { label: "Agenda", href: "#agenda" },
  { label: "Cities", href: "#cities" },
  { label: "Pricing", href: "#pricing" },
  { label: "Certification", href: "#certification" },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  onRegisterClick: () => void;
}

const Navbar = ({ onRegisterClick }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-light-grey">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        <a href="#" className="flex items-center">
          <img
            src={rwLogo}
            alt="Realized Worth"
            className="h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-hero-navy font-medium text-[15px] hover:text-dark-teal transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onRegisterClick}
            className="bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-7 py-3 hover:brightness-90 hover:-translate-y-0.5 transition-all"
          >
            Register Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-hero-navy p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-light-grey px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-hero-navy font-medium text-base border-b border-light-grey"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); onRegisterClick(); }}
            className="w-full mt-3 bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-7 py-3.5"
          >
            Register Now
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
