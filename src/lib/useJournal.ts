import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  date: string;
  sort_order: number;
};

export type MathQuestion = {
  id: string;
  title: string;
  body: string;
  source: string | null;
  difficulty: string | null;
  date: string;
  sort_order: number;
};

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("date", { ascending: false });
    setEntries((data as JournalEntry[]) ?? []);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { entries, refresh };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("math_questions")
      .select("*")
      .order("date", { ascending: false });
    setQuestions((data as MathQuestion[]) ?? []);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { questions, refresh };
}
