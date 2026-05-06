CREATE TABLE public.business_case_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  company_name text NOT NULL,
  presenter_name text,
  presenter_email text,
  presenter_role text,
  audience_role text,
  decision_maker text,
  preferred_city text,
  preferred_quarter text,
  seats_requested text,
  headcount_bracket text,
  has_champions text,
  has_formal_training text,
  selected_challenges text[],
  desired_outcomes text[],
  sponsor_name text,
  budget_range text,
  primary_ask text,
  extra_notes text,
  research_snapshot jsonb
);

ALTER TABLE public.business_case_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a draft"
  ON public.business_case_drafts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read drafts"
  ON public.business_case_drafts FOR SELECT
  TO authenticated
  USING (true);