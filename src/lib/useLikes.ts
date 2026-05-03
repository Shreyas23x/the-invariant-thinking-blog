import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

function getClientId(): string {
  let id = localStorage.getItem("invariant_client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("invariant_client_id", id);
  }
  return id;
}

export function useLikes(postId: string | undefined) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!postId) return;
    const clientId = getClientId();
    const { count: c } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    setCount(c ?? 0);
    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("client_id", clientId)
      .maybeSingle();
    setLiked(!!data);
  }, [postId]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = useCallback(async () => {
    if (!postId || busy) return;
    setBusy(true);
    const clientId = getClientId();
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("client_id", clientId);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, client_id: clientId });
    }
    await refresh();
    setBusy(false);
  }, [postId, liked, busy, refresh]);

  return { count, liked, toggle, busy };
}

export function useSiteViews() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fired = sessionStorage.getItem("invariant_view_fired");
    async function go() {
      if (!fired) {
        sessionStorage.setItem("invariant_view_fired", "1");
        const { data } = await supabase.rpc("increment_site_views");
        if (typeof data === "number") { setCount(data); return; }
      }
      const { data } = await supabase
        .from("site_stats")
        .select("count")
        .eq("key", "total_views")
        .maybeSingle();
      setCount((data?.count as number) ?? 0);
    }
    go();
  }, []);

  return count;
}
