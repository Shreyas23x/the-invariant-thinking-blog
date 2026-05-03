
-- Math journal entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads journal" ON public.journal_entries FOR SELECT USING (true);
CREATE POLICY "admins insert journal" ON public.journal_entries FOR INSERT WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "admins update journal" ON public.journal_entries FOR UPDATE USING (has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete journal" ON public.journal_entries FOR DELETE USING (has_role(auth.uid(),'admin'));

-- Math questions
CREATE TABLE public.math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  source TEXT,
  difficulty TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.math_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads questions" ON public.math_questions FOR SELECT USING (true);
CREATE POLICY "admins insert questions" ON public.math_questions FOR INSERT WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "admins update questions" ON public.math_questions FOR UPDATE USING (has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete questions" ON public.math_questions FOR DELETE USING (has_role(auth.uid(),'admin'));

-- Post likes (anonymous, by client_id)
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, client_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "anyone likes" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "owner unlikes" ON public.post_likes FOR DELETE USING (true);

-- Site views counter
CREATE TABLE public.site_stats (
  key TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0
);
INSERT INTO public.site_stats(key, count) VALUES ('total_views', 0) ON CONFLICT DO NOTHING;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads stats" ON public.site_stats FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.increment_site_views()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_count BIGINT;
BEGIN
  UPDATE public.site_stats SET count = count + 1 WHERE key = 'total_views' RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_site_views() TO anon, authenticated;

-- Triggers for updated_at
CREATE TRIGGER journal_touch BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER questions_touch BEFORE UPDATE ON public.math_questions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
