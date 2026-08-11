import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import rwLogo from "@/assets/logos/RW_Logo_Orange_Web.png";

const navLinks = [
  { label: "Program", href: "#program" },
  { label: "Agenda", href: "#agenda" },
  { label: "Cities", href: "#cities" },
  { label: "Info Sessions", href: "#info-sessions", bold: true },
  { label: "Assessment", href: "#assessment" },
  { label: "Who You'll Work With", href: "#team" },
  { label: "Pricing", href: "#pricing" },
  { label: "Certification", href: "#certification" },
  { label: "Make the Case", href: "#make-the-case" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-light-grey">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <a href="#" className="flex items-center py-2 pr-4 md:pr-8">
          <img
            src={rwLogo}
            alt="Realized Worth"
            className="h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-hero-navy text-[15px] hover:text-dark-teal transition-colors ${link.bold ? "font-bold" : "font-medium"}`}
            >
              {link.label}
            </a>
          ))}
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
              className={`block py-3 text-hero-navy text-base border-b border-light-grey ${link.bold ? "font-bold" : "font-medium"}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
