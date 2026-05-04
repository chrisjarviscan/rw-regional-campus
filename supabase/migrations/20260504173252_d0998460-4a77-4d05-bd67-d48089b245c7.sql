CREATE TABLE public.mailto_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cta_label TEXT NOT NULL,
  cta_location TEXT,
  email_to TEXT NOT NULL,
  subject TEXT,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT
);

ALTER TABLE public.mailto_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a click"
ON public.mailto_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read clicks"
ON public.mailto_clicks
FOR SELECT
TO authenticated
USING (true);