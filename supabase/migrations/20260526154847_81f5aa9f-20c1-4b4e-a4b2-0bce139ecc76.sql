DROP POLICY IF EXISTS "Authenticated users can read drafts" ON public.business_case_drafts;
DROP POLICY IF EXISTS "Authenticated users can read host applications" ON public.host_applications;
DROP POLICY IF EXISTS "Authenticated users can read purchase inquiries" ON public.purchase_inquiries;
DROP POLICY IF EXISTS "Authenticated users can read clicks" ON public.mailto_clicks;

REVOKE SELECT ON public.business_case_drafts FROM authenticated, anon;
REVOKE SELECT ON public.host_applications FROM authenticated, anon;
REVOKE SELECT ON public.purchase_inquiries FROM authenticated, anon;
REVOKE SELECT ON public.mailto_clicks FROM authenticated, anon;