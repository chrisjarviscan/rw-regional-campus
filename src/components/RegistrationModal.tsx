import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ open, onClose }: RegistrationModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [campus, setCampus] = useState("");
  const [interestType, setInterestType] = useState<"individual" | "company">("individual");
  const [excitement, setExcitement] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: insertError } = await supabase.from("interest_submissions").insert({
      full_name: fullName,
      email,
      company,
      campus,
      interest_type: interestType,
      excitement: excitement || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong. Please try again, or email nichole@realizedworth.com.");
      return;
    }

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
            <h3 className="text-hero-navy font-bold text-xl mb-3">Your name's on the list.</h3>
            <p className="text-dark-grey font-light">
              We'll be in touch as soon as registration opens for the campus you chose. Watch your inbox for a confirmation in the next few minutes.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-hero-navy font-bold text-xl mb-2">Express Interest</h3>
            <p className="text-dark-grey font-light text-sm mb-6">
              Add your name to the 2026 list. We'll let you know the moment registration opens for the campus you choose. No commitment.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" required value={fullName} onChange={setFullName} />
              <Input label="Email Address" type="email" required value={email} onChange={setEmail} />
              <Input label="Company / Organization" required value={company} onChange={setCompany} />

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Which campus?</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
                  required
                >
                  <option value="">Select a campus</option>
                  <option>Detroit — August 2026</option>
                  <option>Washington, DC — September 2026</option>
                  <option>Atlanta — October 2026</option>
                  <option>Seattle — Fall 2026</option>
                  <option>Not sure yet / open to options</option>
                  <option>I'd like to request a new city</option>
                </select>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-2">I'm interested as</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="regType"
                      checked={interestType === "individual"}
                      onChange={() => setInterestType("individual")}
                      className="accent-hero-orange"
                    />
                    An individual attendee
                  </label>
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="regType"
                      checked={interestType === "company"}
                      onChange={() => setInterestType("company")}
                      className="accent-hero-orange"
                    />
                    Representing a company / team
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">
                  What excites you most about attending a campus?
                </label>
                <textarea
                  value={excitement}
                  onChange={(e) => setExcitement(e.target.value)}
                  className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange h-24 resize-none"
                  placeholder="A sentence or two is plenty."
                />
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-hero-orange text-primary-foreground font-bold text-base rounded-md py-3.5 hover:brightness-90 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding you to the list…" : "Add Me to the List"}
              </button>
              <p className="text-dark-grey font-light text-xs text-center">
                We'll only use your details to follow up about the Regional Campus.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Input = ({
  label,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block text-hero-navy font-medium text-sm mb-1">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
    />
  </div>
);

export default RegistrationModal;
