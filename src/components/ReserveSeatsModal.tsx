import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReserveSeatsModalProps {
  open: boolean;
  onClose: () => void;
  campus: string;
}

type PaymentPreference = "payment_link" | "invoice" | "undecided";

const ReserveSeatsModal = ({ open, onClose, campus }: ReserveSeatsModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [attendingAs, setAttendingAs] = useState<"individual" | "team">("individual");
  const [seats, setSeats] = useState("1");
  const [seatsNotes, setSeatsNotes] = useState("");
  const [paymentPreference, setPaymentPreference] = useState<PaymentPreference>("payment_link");
  const [extraNotes, setExtraNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setError(null);
      setFullName("");
      setEmail("");
      setCompany("");
      setRole("");
      setAttendingAs("individual");
      setSeats("1");
      setSeatsNotes("");
      setPaymentPreference("payment_link");
      setExtraNotes("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const combinedNotes = [
      `Seats requested: ${seats}`,
      `Attending as: ${attendingAs === "team" ? "Sending a team" : "Individual attendee"}`,
      seatsNotes ? `Split notes: ${seatsNotes}` : "",
    ].filter(Boolean).join(" · ");

    const { error: invokeError } = await supabase.functions.invoke("submit-form", {
      body: {
        type: "purchase",
        data: {
          full_name: fullName,
          email: email.trim().toLowerCase(),
          company,
          role,
          pack: "Seat reservation",
          preferred_campus: campus,
          payment_method: paymentPreference,
          seats_notes: combinedNotes,
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
            <h3 className="text-hero-navy font-bold text-xl mb-3">Seats requested.</h3>
            <p className="text-dark-grey font-light mb-6">
              Thanks — we've received your request for {campus}. Our team will follow up within two business days to confirm availability and send your {paymentPreference === "invoice" ? "invoice" : paymentPreference === "payment_link" ? "payment link" : "next steps"}. No payment has been taken and no seats are held yet.
            </p>
            <div className="border-t border-light-grey pt-6 mt-2">
              <p className="text-dark-grey font-light text-sm mb-2">Need to talk sooner?</p>
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
            <h3 className="text-hero-navy font-bold text-xl mb-1">Reserve your seats</h3>
            <p className="text-dark-grey font-light text-sm mb-4">
              {campus}
            </p>
            <div className="bg-light-teal/15 border border-light-teal/40 rounded-md px-4 py-3 mb-5">
              <p className="text-hero-navy font-medium text-sm mb-1">This holds your spot on our list — it's not a checkout.</p>
              <p className="text-dark-grey font-light text-sm">
                Tell us how many seats you'd like and how you'd prefer to pay. Our team will follow up within two business days to confirm seats and send the invoice or payment link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" required value={fullName} onChange={setFullName} />
              <Input label="Email Address" type="email" required value={email} onChange={setEmail} />
              <Input label="Company / Organization" required value={company} onChange={setCompany} />
              <Input label="Your Role" value={role} onChange={setRole} placeholder="e.g. Director of CSR" />

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-2">I'm registering as</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="attendingAs"
                      checked={attendingAs === "individual"}
                      onChange={() => setAttendingAs("individual")}
                      className="accent-hero-orange"
                    />
                    An individual attendee
                  </label>
                  <label className="flex items-center gap-2 text-dark-grey font-light text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="attendingAs"
                      checked={attendingAs === "team"}
                      onChange={() => setAttendingAs("team")}
                      className="accent-hero-orange"
                    />
                    Sending a team
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-1">
                  How many seats?<span className="text-hero-orange"> *</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  required
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
                />
                <p className="text-dark-grey font-light text-xs mt-1">
                  Capacity is capped at ~40 per campus, with no more than 1/3 from any single org.
                </p>
              </div>

              <Textarea
                label="Seat details / split notes (optional)"
                value={seatsNotes}
                onChange={setSeatsNotes}
                placeholder="e.g. 2 for DC, 2 for Atlanta — or names/roles of attendees if known."
              />

              <div>
                <label className="block text-hero-navy font-medium text-sm mb-2">Payment preference</label>
                <div className="flex flex-col gap-2">
                  <PaymentOption
                    label="Send me a payment link"
                    hint="Credit card checkout link (5% processing fee applies)"
                    checked={paymentPreference === "payment_link"}
                    onChange={() => setPaymentPreference("payment_link")}
                  />
                  <PaymentOption
                    label="Invoice me"
                    hint="Net 30 corporate terms"
                    checked={paymentPreference === "invoice"}
                    onChange={() => setPaymentPreference("invoice")}
                  />
                  <PaymentOption
                    label="Not sure yet"
                    hint="Nichole can walk you through the options"
                    checked={paymentPreference === "undecided"}
                    onChange={() => setPaymentPreference("undecided")}
                  />
                </div>
              </div>

              <Textarea
                label="Anything else we should know? (optional)"
                value={extraNotes}
                onChange={setExtraNotes}
              />

              {error && <p className="text-sm text-destructive font-medium" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-hero-orange text-primary-foreground font-bold text-base rounded-md py-3.5 hover:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending request…" : "Reserve My Seats"}
              </button>
              <p className="text-dark-grey font-light text-xs text-center">
                No payment is taken on this site. Nichole will confirm seats and send the invoice or payment link.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Input = ({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
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

const Textarea = ({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
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

const PaymentOption = ({
  label, hint, checked, onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-start gap-2 text-dark-grey font-light text-sm cursor-pointer">
    <input
      type="radio"
      name="paymentPreference"
      checked={checked}
      onChange={onChange}
      className="accent-hero-orange mt-1"
    />
    <span>
      <span className="font-medium text-hero-navy">{label}</span>
      <span className="block text-xs text-dark-grey">{hint}</span>
    </span>
  </label>
);

export default ReserveSeatsModal;
