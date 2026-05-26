import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "ready" | "already" | "invalid" | "submitting" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const validate = async () => {
      if (!token) { setStatus("invalid"); return; }
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        if (!res.ok) { setStatus("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid === true) {
          setStatus("ready");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  const confirm = async () => {
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) { setStatus("error"); return; }
      if (data?.success || data?.reason === "already_unsubscribed") {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Unsubscribe | Realized Worth</title>
        <meta name="description" content="Unsubscribe from emails sent by Realized Worth's Regional Campus Series." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://rw-regional-campus.lovable.app/unsubscribe" />
        <meta property="og:url" content="https://rw-regional-campus.lovable.app/unsubscribe" />
        <meta property="og:title" content="Unsubscribe | Realized Worth" />
        <meta property="og:description" content="Manage your email subscription preferences for the Regional Campus Series." />
      </Helmet>
      <div className="max-w-md w-full bg-white border border-light-grey rounded-lg p-8 shadow-sm">
        <div className="w-12 h-1 bg-hero-orange mb-6" />
        <h1 className="text-hero-navy text-2xl font-bold mb-3">Unsubscribe</h1>

        {status === "loading" && <p className="text-dark-grey">Checking your link…</p>}

        {status === "ready" && (
          <>
            <p className="text-dark-grey mb-6">
              Click below to stop receiving emails from Realized Worth. You can always reach
              out to us directly at contact@rw.institute.
            </p>
            <button
              onClick={confirm}
              className="bg-hero-orange text-primary-foreground font-bold rounded-md px-6 py-3 hover:brightness-90 transition-all"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}

        {status === "submitting" && <p className="text-dark-grey">Processing…</p>}

        {status === "done" && (
          <p className="text-dark-grey">
            You've been unsubscribed. We won't send you any more emails.
          </p>
        )}

        {status === "already" && (
          <p className="text-dark-grey">
            You're already unsubscribed. No further action needed.
          </p>
        )}

        {status === "invalid" && (
          <p className="text-dark-grey">
            This unsubscribe link is invalid or has expired. If you're still receiving
            emails, please email contact@rw.institute and we'll remove you manually.
          </p>
        )}

        {status === "error" && (
          <p className="text-dark-grey">
            Something went wrong. Please email contact@rw.institute and we'll take care
            of it.
          </p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
