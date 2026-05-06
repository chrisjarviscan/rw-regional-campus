CREATE TABLE public.purchase_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  pack TEXT NOT NULL,
  preferred_campus TEXT,
  payment_method TEXT NOT NULL,
  seats_notes TEXT,
  extra_notes TEXT
);

ALTER TABLE public.purchase_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit purchase inquiry"
ON public.purchase_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read purchase inquiries"
ON public.purchase_inquiries
FOR SELECT
TO authenticated
USING (true);