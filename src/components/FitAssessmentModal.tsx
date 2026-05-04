import { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

interface FitAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  onExpressInterest: () => void;
}

type Choice = { label: string; score: number };
type Question = { id: string; prompt: string; choices: Choice[] };

// Tourist / Traveler / Guide framework — higher score = closer to Guide stage
const QUESTIONS: Question[] = [
  {
    id: "role",
    prompt: "Which best describes your role with employee volunteering at your company?",
    choices: [
      { label: "I volunteer occasionally when something is organized for me.", score: 0 },
      { label: "I help run or coordinate volunteer events on the side.", score: 1 },
      { label: "Leading or shaping our volunteering program is part of my job.", score: 2 },
      { label: "I own the strategy for employee volunteering across the company.", score: 3 },
    ],
  },
  {
    id: "experience",
    prompt: "How long have you been involved in leading or coordinating volunteer work?",
    choices: [
      { label: "Less than a year, or I'm just getting started.", score: 0 },
      { label: "One to three years.", score: 1 },
      { label: "Three to seven years.", score: 2 },
      { label: "More than seven years.", score: 3 },
    ],
  },
  {
    id: "scope",
    prompt: "What's the scope of what you're working on right now?",
    choices: [
      { label: "Running individual events and activities.", score: 0 },
      { label: "Coordinating a recurring program (e.g., a month of service).", score: 1 },
      { label: "Building or rebuilding the program's strategy and structure.", score: 2 },
      { label: "Trying to shift the company's culture around volunteering.", score: 3 },
    ],
  },
  {
    id: "tension",
    prompt: "Which statement sounds most like you?",
    choices: [
      { label: "I want a clearer picture of what 'good' volunteering looks like.", score: 1 },
      { label: "I know what I want, but I'm stuck on how to get there.", score: 2 },
      { label: "I'm doing this work and want to sharpen my craft with peers.", score: 3 },
      { label: "I'm not sure volunteering is really my responsibility yet.", score: 0 },
    ],
  },
  {
    id: "bringing",
    prompt: "Are you considering coming with a colleague or two?",
    choices: [
      { label: "Yes — we're planning to come together.", score: 2 },
      { label: "Maybe — I'm exploring it for myself first.", score: 1 },
      { label: "No — just me.", score: 1 },
    ],
  },
];

type Result = { title: string; body: string; cta: "interest" | "info" };

const resultFor = (score: number): Result => {
  if (score >= 10) {
    return {
      title: "You're in the right place.",
      body:
        "You're already doing the work — leading, coordinating, or shaping volunteering at your company. The Regional Campus is built for people at your stage. You'll find peers wrestling with the same questions and a structured space to sharpen your craft. Bring a colleague if you can; the experience compounds.",
      cta: "interest",
    };
  }
  if (score >= 6) {
    return {
      title: "This is likely a strong fit.",
      body:
        "You're past the volunteer-on-the-side stage and into shaping how it actually runs. The campus will give you frameworks, peers, and time away from the day-to-day to think clearly about what you're building. Worth a conversation before you commit.",
      cta: "interest",
    };
  }
  return {
    title: "It might be early — let's talk.",
    body:
      "The Regional Campus is designed for people whose job (or significant part of it) is leading employee volunteering. If you're earlier in the journey, the campus can still be valuable, but a short conversation will help us figure out whether now is the right moment, or whether something else fits better.",
    cta: "info",
  };
};

const FitAssessmentModal = ({ open, onClose, onExpressInterest }: FitAssessmentModalProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (!open) return null;

  const total = QUESTIONS.length;
  const isResult = step === total;
  const current = QUESTIONS[step];
  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  const handleChoose = (qid: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const result = isResult ? resultFor(score) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-hero-navy/60 p-4" onClick={handleClose}>
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-dark-grey hover:text-hero-navy"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!isResult && current && (
          <>
            <div className="flex items-center justify-between mb-6">
              <span className="text-hero-orange font-bold text-xs uppercase tracking-[0.15em]">
                Question {step + 1} of {total}
              </span>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="text-dark-grey hover:text-hero-navy text-sm inline-flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
            </div>

            <div className="w-full h-1 bg-light-grey rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-hero-orange transition-all"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>

            <h3 className="text-hero-navy font-bold text-lg md:text-xl mb-5">{current.prompt}</h3>

            <div className="space-y-2">
              {current.choices.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleChoose(current.id, c.score)}
                  className="w-full text-left border border-light-grey rounded-md px-4 py-3 text-dark-grey font-light text-sm hover:border-hero-orange hover:bg-hero-orange/5 transition-all"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {isResult && result && (
          <div>
            <span className="text-hero-orange font-bold text-xs uppercase tracking-[0.15em]">Your read</span>
            <h3 className="text-hero-navy font-bold text-xl md:text-2xl mt-2 mb-4">{result.title}</h3>
            <p className="text-dark-grey font-light text-base mb-6 leading-relaxed">{result.body}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              {result.cta === "interest" ? (
                <button
                  onClick={() => {
                    handleClose();
                    setTimeout(onExpressInterest, 220);
                  }}
                  className="group bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-6 py-3 hover:brightness-90 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                >
                  Express Interest
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <a
                  href="mailto:contact@rw.institute?subject=Is the Regional Campus right for me%3F"
                  className="bg-hero-orange text-primary-foreground font-bold text-base rounded-md px-6 py-3 hover:brightness-90 transition-all text-center"
                >
                  Talk to us first
                </a>
              )}
              <button
                onClick={reset}
                className="border border-light-grey text-dark-grey font-medium text-sm rounded-md px-6 py-3 hover:border-hero-navy hover:text-hero-navy transition-all"
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitAssessmentModal;
