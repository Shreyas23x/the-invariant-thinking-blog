import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  body: string;
  cover_image: string | null;
  sort_order: number;
  published: boolean;
};

export type Category = "CS Projects" | "Math Olympiad" | "NBA Analysis";
export const CATEGORIES: Category[] = ["CS Projects", "Math Olympiad", "NBA Analysis"];

export function usePosts(includeUnpublished = false) {
  const [posts, setPosts] = useState<DbPost[] | null>(null);

  const refresh = useCallback(async () => {
    let q = supabase.from("posts").select("*").order("date", { ascending: false });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data } = await q;
    setPosts((data as DbPost[]) ?? []);
  }, [includeUnpublished]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { posts, refresh };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<DbPost | null | undefined>(undefined);
  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => setPost((data as DbPost) ?? null));
  }, [slug]);
  return post;
}

export function postsByCategory(posts: DbPost[], category: Category) {
  return posts.filter((p) => p.category === category);
}
