import { useState } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HostQuestionnaireModalProps {
  open: boolean;
  onClose: () => void;
}

type Answers = {
  venue_capacity: string;
  booking_lead_time: string;
  champion_readiness: string;
  interest_reason: string;
  contribution_level: string;
  preferred_quarter: string;
  full_name: string;
  email: string;
  company: string;
  city: string;
};

const initial: Answers = {
  venue_capacity: "",
  booking_lead_time: "",
  champion_readiness: "",
  interest_reason: "",
  contribution_level: "",
  preferred_quarter: "",
  full_name: "",
  email: "",
  company: "",
  city: "",
};

const HostQuestionnaireModal = ({ open, onClose }: HostQuestionnaireModalProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const set = (k: keyof Answers, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setAnswers(initial);
      setSubmitted(false);
      setError(null);
    }, 200);
  };

  const steps: Array<{
    title: string;
    body: React.ReactNode;
    canAdvance: () => boolean;
  }> = [
    {
      title: "Can your facility accommodate 40–50 people for a two-day event?",
      body: (
        <>
          <p className="text-dark-grey font-light text-sm mb-5">
            This includes a main session room, breakout space, and a catering area.
          </p>
          <RadioGroup
            name="venue_capacity"
            value={answers.venue_capacity}
            onChange={(v) => set("venue_capacity", v)}
            options={[
              { value: "yes", label: "Yes — we have all of that" },
              { value: "mostly", label: "Mostly — we'd need to adapt one piece" },
              { value: "unsure", label: "Not sure — happy to talk it through" },
              { value: "no", label: "No — we couldn't host on-site" },
            ]}
          />
        </>
      ),
      canAdvance: () => !!answers.venue_capacity,
    },
    {
      title: "How many weeks in advance would you need to book your venue?",
      body: (
        <RadioGroup
          name="booking_lead_time"
          value={answers.booking_lead_time}
          onChange={(v) => set("booking_lead_time", v)}
          options={[
            { value: "<4", label: "Less than 4 weeks" },
            { value: "4-8", label: "4–8 weeks" },
            { value: "8-16", label: "8–16 weeks" },
            { value: "16+", label: "16+ weeks" },
          ]}
        />
      ),
      canAdvance: () => !!answers.booking_lead_time,
    },
    {
      title: "Champion / ambassador readiness",
      body: (
        <>
          <p className="text-dark-grey font-light text-sm mb-5">
            Do you have a formalized approach to identifying, equipping, and elevating employees to play a champion or ambassador role as part of scaling your program? If not yet formalized but you have key people who have demonstrated leadership in this area and you'd love to have them begin the process of formalizing that role, mention that — it could still be a great fit.
          </p>
          <textarea
            value={answers.champion_readiness}
            onChange={(e) => set("champion_readiness", e.target.value)}
            className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange h-32 resize-none"
            placeholder="A few sentences is plenty."
          />
        </>
      ),
      canAdvance: () => answers.champion_readiness.trim().length > 0,
    },
    {
      title: "What's drawing you to host a Regional Campus?",
      body: (
        <textarea
          value={answers.interest_reason}
          onChange={(e) => set("interest_reason", e.target.value)}
          className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange h-32 resize-none"
          placeholder="Tell us what's behind your interest."
        />
      ),
      canAdvance: () => true,
    },
    {
      title: "What can you contribute beyond the space?",
      body: (
        <RadioGroup
          name="contribution_level"
          value={answers.contribution_level}
          onChange={(v) => set("contribution_level", v)}
          options={[
            { value: "venue_only", label: "Venue space only — you handle the rest" },
            { value: "venue_catering", label: "Venue + catering" },
            { value: "venue_av", label: "Venue + A/V" },
            { value: "venue_full", label: "Venue + catering + A/V + other logistics" },
            { value: "discuss", label: "Let's discuss what we can offer" },
          ]}
        />
      ),
      canAdvance: () => !!answers.contribution_level,
    },
    {
      title: "Which quarter are you interested in?",
      body: (
        <select
          value={answers.preferred_quarter}
          onChange={(e) => set("preferred_quarter", e.target.value)}
          className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
        >
          <option value="">Select a timeframe</option>
          <option value="Q1">Q1 (Jan–Mar)</option>
          <option value="Q2">Q2 (Apr–Jun)</option>
          <option value="Q3">Q3 (Jul–Sep)</option>
          <option value="Q4">Q4 (Oct–Dec)</option>
          <option value="Flexible">Flexible</option>
        </select>
      ),
      canAdvance: () => !!answers.preferred_quarter,
    },
    {
      title: "Last step — how do we reach you?",
      body: (
        <div className="space-y-4">
          <Field label="Full Name" required value={answers.full_name} onChange={(v) => set("full_name", v)} />
          <Field label="Email Address" type="email" required value={answers.email} onChange={(v) => set("email", v)} />
          <Field label="Company / Organization" required value={answers.company} onChange={(v) => set("company", v)} />
          <Field label="City" value={answers.city} onChange={(v) => set("city", v)} />
        </div>
      ),
      canAdvance: () =>
        answers.full_name.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email) &&
        answers.company.trim().length > 0,
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    const { error: invokeError } = await supabase.functions.invoke("submit-form", {
      body: {
        type: "host_application",
        data: {
          full_name: answers.full_name,
          email: answers.email,
          company: answers.company,
          city: answers.city || "",
          venue_capacity: answers.venue_capacity,
          booking_lead_time: answers.booking_lead_time,
          champion_readiness: answers.champion_readiness,
          interest_reason: answers.interest_reason || "",
          contribution_level: answers.contribution_level,
          preferred_quarter: answers.preferred_quarter,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-hero-navy/60 p-4" onClick={close}>
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} className="absolute top-4 right-4 text-dark-grey hover:text-hero-navy" aria-label="Close">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <h3 className="text-hero-navy font-bold text-xl mb-3">Thanks — we've got it.</h3>
            <p className="text-dark-grey font-light">
              Nichole will review your responses and reach out within a few business days to talk through fit and timing.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-dark-grey font-medium mb-2">
                <span>Step {step + 1} of {steps.length}</span>
                <span>Host screening</span>
              </div>
              <div className="h-1 bg-light-grey rounded-full overflow-hidden">
                <div
                  className="h-full bg-hero-orange transition-all"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-hero-navy font-bold text-xl mb-4">{current.title}</h3>
            <div className="mb-6">{current.body}</div>

            {error && (
              <p className="text-sm text-destructive font-medium mb-3" role="alert">{error}</p>
            )}

            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || submitting}
                className="inline-flex items-center gap-2 text-dark-grey font-medium text-sm px-4 py-2.5 rounded-md hover:text-hero-navy disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Back
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!current.canAdvance() || submitting}
                  className="bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-6 py-3 hover:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submitting ? "Sending…" : "Submit"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!current.canAdvance()}
                  className="bg-hero-orange text-primary-foreground font-bold text-sm rounded-md px-6 py-3 hover:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  Continue <ArrowRight size={16} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RadioGroup = ({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="space-y-2">
    {options.map((o) => (
      <label
        key={o.value}
        className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
          value === o.value
            ? "border-hero-orange bg-hero-orange/5"
            : "border-light-grey hover:border-dark-grey/40"
        }`}
      >
        <input
          type="radio"
          name={name}
          checked={value === o.value}
          onChange={() => onChange(o.value)}
          className="accent-hero-orange"
        />
        <span className="text-dark-grey font-light text-sm">{o.label}</span>
      </label>
    ))}
  </div>
);

const Field = ({
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
    <label className="block text-hero-navy font-medium text-sm mb-1">
      {label}{required && <span className="text-hero-orange ml-0.5">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-light-grey rounded-md px-3 py-2.5 text-dark-grey font-light text-sm focus:outline-none focus:ring-2 focus:ring-hero-orange"
    />
  </div>
);

export default HostQuestionnaireModal;
