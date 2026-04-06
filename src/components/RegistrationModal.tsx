import { useState } from "react";
import { X } from "lucide-react";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ open, onClose }: RegistrationModalProps) => {
  const [regType, setRegType] = useState<"individual" | "corporate">("individual");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-hero-navy/60 p-4" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-grey hover:text-hero-navy" aria-label="Close">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <h3 className="text-hero-navy font-bold text-xl mb-3">Thank you for registering.</h3>
            <p className="text-dark-grey font-light">You will receive a confirmation email within 24 hours.</p>
          </div>
        ) : (
          <>
            <h3 className="text-hero-navy font-bold text-xl mb-6">Register for the Regional Campus</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" required />
              <Input label="Email Address" type="email" required />
              <Input label="Company / Organization" required />
              <Input label="Job Title" required />

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Campus</label>
                <select className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange" required>
                  <option value="">Select a campus</option>
                  <option>Seattle</option>
                  <option>Detroit</option>
                  <option>Atlanta</option>
                </select>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Registration Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input type="radio" name="regType" checked={regType === "individual"} onChange={() => setRegType("individual")} className="accent-hero-orange" />
                    Individual
                  </label>
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input type="radio" name="regType" checked={regType === "corporate"} onChange={() => setRegType("corporate")} className="accent-hero-orange" />
                    Corporate Package
                  </label>
                </div>
              </div>

              {regType === "corporate" && (
                <>
                  <div>
                    <label className="block text-hero-navy font-medium text-sm mb-1">Package Size</label>
                    <select className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange" required>
                      <option>6-Pack</option>
                      <option>12-Pack</option>
                      <option>18-Pack</option>
                    </select>
                  </div>
                  <Input label="Number of Attendees for This Campus" type="number" required />
                  <Input label="Billing Contact Name" required />
                  <Input label="Billing Contact Email" type="email" required />
                </>
              )}

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">How did you hear about the Regional Campus?</label>
                <select className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange">
                  <option value="">Select one (optional)</option>
                  <option>Colleague</option>
                  <option>LinkedIn</option>
                  <option>Conference</option>
                  <option>Web Search</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Biggest challenge with your current volunteer program?</label>
                <textarea className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange h-20 resize-none" />
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Dietary restrictions or accessibility needs</label>
                <textarea className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange h-20 resize-none" />
              </div>

              <button
                type="submit"
                className="w-full bg-hero-orange text-primary-foreground font-bold text-base rounded-md py-3.5 hover:brightness-90 transition-all mt-2"
              >
                Complete Registration
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", required = false }: { label: string; type?: string; required?: boolean }) => (
  <div>
    <label className="block text-hero-navy font-medium text-sm mb-1">{label}</label>
    <input
      type={type}
      required={required}
      className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
    />
  </div>
);

export default RegistrationModal;
