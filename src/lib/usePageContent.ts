import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type Map = Record<string, string>;

let cache: Map | null = null;
const listeners = new Set<(m: Map) => void>();

async function load() {
  const { data } = await supabase.from("page_content").select("key,value");
  const map: Map = {};
  (data ?? []).forEach((r: { key: string; value: string }) => (map[r.key] = r.value));
  cache = map;
  listeners.forEach((l) => l(map));
  return map;
}

export function usePageContent() {
  const [map, setMap] = useState<Map>(cache ?? {});

  useEffect(() => {
    listeners.add(setMap);
    if (!cache) load();
    return () => {
      listeners.delete(setMap);
    };
  }, []);

  const get = useCallback(
    (key: string, fallback = "") => map[key] ?? fallback,
    [map]
  );

  const update = useCallback(async (key: string, value: string) => {
    const { error } = await supabase
      .from("page_content")
      .upsert({ key, value }, { onConflict: "key" });
    if (!error) {
      const next = { ...(cache ?? {}), [key]: value };
      cache = next;
      listeners.forEach((l) => l(next));
    }
    return { error: error?.message };
  }, []);

  return { get, update, refresh: load };
}
