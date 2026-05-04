import { supabase } from "@/integrations/supabase/client";

interface TrackArgs {
  ctaLabel: string;
  ctaLocation?: string;
  emailTo: string;
  subject?: string;
}

/** Fire-and-forget click record. Never blocks navigation. */
export const trackMailto = ({ ctaLabel, ctaLocation, emailTo, subject }: TrackArgs) => {
  try {
    void supabase.from("mailto_clicks").insert({
      cta_label: ctaLabel,
      cta_location: ctaLocation ?? null,
      email_to: emailTo,
      subject: subject ?? null,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch {
    // swallow — analytics must never break UX
  }
};
