CREATE TABLE public.host_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  city text,
  venue_capacity text NOT NULL,
  booking_lead_time text NOT NULL,
  champion_readiness text NOT NULL,
  interest_reason text,
  contribution_level text NOT NULL,
  preferred_quarter text NOT NULL
);

ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit host application"
ON public.host_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read host applications"
ON public.host_applications
FOR SELECT
TO authenticated
USING (true);
