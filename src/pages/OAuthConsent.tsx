import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data?: unknown; error?: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data?: { redirect_url?: string; redirect_to?: string }; error?: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data?: { redirect_url?: string; redirect_to?: string }; error?: { message: string } | null }>;
};

function oauthApi(): OAuthApi {
  const ns = (supabase.auth as unknown as { oauth?: OAuthApi }).oauth;
  if (!ns) throw new Error("OAuth server is not available in this project.");
  return ns;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = (data as any)?.redirect_url ?? (data as any)?.redirect_to;
      if (immediate && !(data as any)?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorizationId)
      : await oauthApi().denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  const clientName = (details as any)?.client?.name ?? "an app";

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white border-2 border-[#c0392b] p-6 max-w-md">
          <h1 className="text-lg font-bold mb-2">Authorization request</h1>
          <p className="text-sm">Could not load this authorization request: {error}</p>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p>Loading authorization request…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white border-2 border-[#5266c0] p-6 max-w-md w-full shadow-lg">
        <h1 className="text-xl font-bold mb-3">Connect {clientName} to your account</h1>
        <p className="text-sm mb-6">
          This lets <strong>{clientName}</strong> use Invariant Thinking as you.
        </p>
        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 border-2 border-[#2233b2] bg-[#5266c0] px-4 py-2 text-sm font-semibold text-white"
          >
            Approve
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 border-2 border-[#999] bg-[#eee] px-4 py-2 text-sm font-semibold"
          >
            Deny
          </button>
        </div>
      </div>
    </main>
  );
}
