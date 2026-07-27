import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  pack: string;
  packPrice: string;
}

const CAMPUS_OPTIONS = [
  "Washington, DC — September 24–25, 2026",
  "Atlanta — October 7–8, 2026",
  "Seattle — October 21–22, 2026",
  "San Francisco Bay Area — May 19–20, 2027",
  "Split across multiple campuses",
  "Not sure yet",
];

const PurchaseModal = ({ open, onClose, pack, packPrice }: PurchaseModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [preferredCampus, setPreferredCampus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"invoice" | "credit_card">("invoice");
  const [seatsNotes, setSeatsNotes] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setError(null);
      setFullName("");
      setEmail("");
      setCompany("");
      setRole("");
      setPreferredCampus("");
      setPaymentMethod("invoice");
      setSeatsNotes("");
      setExtraNotes("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: invokeError } = await supabase.functions.invoke("submit-form", {
      body: {
        type: "purchase",
        data: {
          full_name: fullName,
          email,
          company,
          role,
          pack,
          preferred_campus: preferredCampus,
          payment_method: paymentMethod,
          seats_notes: seatsNotes,
          extra_notes: extraNotes,
        },
      },
    });

    setSubmitting(false);

    if (invokeError) {
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
            <h3 className="text-hero-navy font-bold text-xl mb-3">Request received.</h3>
            <p className="text-dark-grey font-light mb-6">
              Thanks for your interest in the {pack}. This was a request for contact — no payment has been taken and no seats are reserved yet. Nichole will follow up within one business day to confirm seats and send the invoice or payment link.
            </p>
            <div className="border-t border-light-grey pt-6 mt-2">
              <p className="text-dark-grey font-light text-sm mb-2">
                Need to talk sooner?
              </p>
              <a
                href="mailto:nichole@realizedworth.com"
                className="inline-block text-dark-teal font-bold hover:underline"
              >
                nichole@realizedworth.com
              </a>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-hero-navy font-bold text-xl mb-1">Request to purchase the {pack}</h3>
            <p className="text-dark-grey font-light text-sm mb-4">{packPrice}</p>
            <div className="bg-light-teal/15 border border-light-teal/40 rounded-md px-4 py-3 mb-5">
              <p className="text-hero-navy font-medium text-sm mb-1">This is a request for contact — not a checkout.</p>
              <p className="text-dark-grey font-light text-sm">
                You won't be charged on this site. Tell us your intended payment method below (invoice or credit card with a 5% processing fee) and Nichole will follow up within one business day to confirm seats and send the actual invoice or payment link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" required value={fullName} onChange={setFullName} />
              <Input label="Email Address" type="email" required value={email} onChange={setEmail} />
              <Input label="Company / Organization" required value={company} onChange={setCompany} />
              <Input label="Your Role" value={role} onChange={setRole} placeholder="e.g. Director of CSR" />

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">Preferred campus</label>
                <select
                  value={preferredCampus}
                  onChange={(e) => setPreferredCampus(e.target.value)}
                  className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
                  required
                >
                  <option value="">Select a campus</option>
                  {CAMPUS_OPTIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-2">Intended payment method (not a charge — just so Nichole knows what to send)</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === "invoice"}
                      onChange={() => setPaymentMethod("invoice")}
                      className="accent-hero-orange mt-1"
                    />
                    <span><span className="font-medium text-hero-navy">Invoice</span> · Net 30 corporate terms</span>
                  </label>
                  <label className="flex items-start gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="accent-hero-orange mt-1"
                    />
                    <span><span className="font-medium text-hero-navy">Credit card</span> · 5% processing fee applies</span>
                  </label>
                </div>
              </div>

              <Textarea
                label="Seats / split notes (optional)"
                value={seatsNotes}
                onChange={setSeatsNotes}
                placeholder="e.g. 4 seats DC, 2 seats Atlanta"
              />
              <Textarea
                label="Anything else we should know? (optional)"
                value={extraNotes}
                onChange={setExtraNotes}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-hero-orange text-primary-foreground font-bold text-sm rounded-md py-3 hover:brightness-90 transition-all disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Send purchase request"}
              </button>
              <p className="text-[12px] text-dark-grey font-light text-center">
                No payment is taken on this site. Nichole will follow up to confirm seats and send the invoice or payment link.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

const Input = ({ label, value, onChange, type = "text", required, placeholder }: InputProps) => (
  <div>
    <label className="block text-hero-navy font-medium text-sm mb-1">
      {label}
      {required && <span className="text-hero-orange"> *</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
    />
  </div>
);

interface TextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const Textarea = ({ label, value, onChange, placeholder }: TextareaProps) => (
  <div>
    <label className="block text-hero-navy font-medium text-sm mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange resize-none"
    />
  </div>
);

export default PurchaseModal;
