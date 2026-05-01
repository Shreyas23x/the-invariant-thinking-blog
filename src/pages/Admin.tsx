import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type DbPost } from "@/lib/usePosts";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <SiteLayout pageTitle="Admin — ~/FoxLog" title="Admin">
        <Panel><p>Loading…</p></Panel>
      </SiteLayout>
    );
  }

  if (!user) return <LoginForm />;
  if (!isAdmin) {
    return (
      <SiteLayout pageTitle="Admin — ~/FoxLog" title="Admin">
        <Panel>
          <p>You're signed in but not an admin. Contact the owner if this is wrong.</p>
        </Panel>
      </SiteLayout>
    );
  }

  return <AdminDashboard />;
}

function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await (mode === "signin" ? signIn(email, password) : signUp(email, password));
    setBusy(false);
    if (error) setError(error);
  }

  return (
    <SiteLayout pageTitle="Admin login — ~/FoxLog" title="Admin login">
      <Panel
        subtitle={
          mode === "signin"
            ? "Sign in to edit posts and page content."
            : "First-time setup: the first account becomes the admin."
        }
      >
        <form onSubmit={submit} className="max-w-sm space-y-3">
          <div>
            <label className="otis-label block text-sm mb-1">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#999] bg-white px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="otis-label block text-sm mb-1">Password</label>
            <input
              type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#999] bg-white px-2 py-1 text-sm"
            />
          </div>
          {error && <p className="text-xs text-[#c0392b]">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="border-2 border-[#2233b2] bg-[#5266c0] px-4 py-1.5 text-sm font-semibold text-white"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create admin account"}
          </button>
          <p className="text-xs">
            {mode === "signin" ? (
              <>No account yet?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>Sign up</a>
              </>
            ) : (
              <>Already have one?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("signin"); }}>Sign in</a>
              </>
            )}
          </p>
        </form>
      </Panel>
    </SiteLayout>
  );
}

function AdminDashboard() {
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [editing, setEditing] = useState<DbPost | null>(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });
    setPosts((data as DbPost[]) ?? []);
  }

  useEffect(() => { refresh(); }, []);

  if (editing || creating) {
    return (
      <PostEditor
        post={editing}
        onClose={() => { setEditing(null); setCreating(false); refresh(); }}
      />
    );
  }

  return (
    <SiteLayout pageTitle="Admin panel — ~/FoxLog" title="Admin panel">
      <Panel subtitle="Manage posts. Click any text on the public site to edit it inline.">
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setCreating(true)}
            className="border-2 border-[#2233b2] bg-[#5266c0] px-3 py-1 text-sm font-semibold text-white"
          >+ New post</button>
          <Link to="/" className="border border-[#999] bg-white px-3 py-1 text-sm">← Back to site</Link>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#5266c0] text-left">
              <th className="py-1 pr-3">Date</th>
              <th className="py-1 pr-3">Title</th>
              <th className="py-1 pr-3">Category</th>
              <th className="py-1 pr-3">Status</th>
              <th className="py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-[#f6fbff]" : "bg-white"}>
                <td className="py-1 pr-3 align-top font-mono text-xs">{p.date}</td>
                <td className="py-1 pr-3 align-top">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-[#445]">/{p.slug}</div>
                </td>
                <td className="py-1 pr-3 align-top text-xs">{p.category}</td>
                <td className="py-1 pr-3 align-top text-xs">{p.published ? "✓ live" : "draft"}</td>
                <td className="py-1 align-top text-xs space-x-2">
                  <button onClick={() => setEditing(p)} className="text-[#2233b2]">edit</button>
                  <Link to={`/blog/${p.slug}`} className="text-[#2233b2]">view</Link>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${p.title}"?`)) return;
                      await supabase.from("posts").delete().eq("id", p.id);
                      refresh();
                    }}
                    className="text-[#c0392b]"
                  >delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </SiteLayout>
  );
}

function PostEditor({ post, onClose }: { post: DbPost | null; onClose: () => void }) {
  const isNew = !post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0]);
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) { setError(error.message); return null; }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadImage(f);
    if (url) setCoverImage(url);
  }

  async function onInlineUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadImage(f);
    if (url) setBody((b) => `${b}\n\n![](${url})\n`);
    e.target.value = "";
  }

  async function save() {
    setSaving(true);
    setError("");
    const finalSlug = slug || autoSlug(title);
    const payload = {
      title, slug: finalSlug, date, category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      excerpt, body, cover_image: coverImage || null, published,
    };
    const { error } = isNew
      ? await supabase.from("posts").insert(payload)
      : await supabase.from("posts").update(payload).eq("id", post!.id);
    setSaving(false);
    if (error) setError(error.message);
    else onClose();
  }

  return (
    <SiteLayout pageTitle="Edit post — ~/FoxLog" title={isNew ? "New post" : `Edit: ${post!.title}`}>
      <Panel>
        <div className="space-y-3 text-sm">
          <div>
            <label className="otis-label block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew && !slug) setSlug(autoSlug(e.target.value));
              }}
              className="w-full border border-[#999] bg-white px-2 py-1"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="otis-label block mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-[#999] bg-white px-2 py-1 font-mono text-xs" />
            </div>
            <div>
              <label className="otis-label block mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-[#999] bg-white px-2 py-1" />
            </div>
            <div>
              <label className="otis-label block mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-[#999] bg-white px-2 py-1">
                {CATEGORIES.map((c) => (<option key={c}>{c}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="otis-label block mb-1">Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-[#999] bg-white px-2 py-1" />
          </div>
          <div>
            <label className="otis-label block mb-1">Cover image</label>
            <div className="flex flex-wrap items-center gap-2">
              <input type="file" accept="image/*" onChange={onCoverUpload} className="text-xs" />
              {coverImage && (
                <>
                  <img src={coverImage} alt="" className="h-12 w-12 object-cover border" />
                  <button type="button" onClick={() => setCoverImage("")} className="text-xs text-[#c0392b]">remove</button>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="otis-label block mb-1">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full border border-[#999] bg-white px-2 py-1" />
          </div>
          <div>
            <label className="otis-label block mb-1">
              Body (Markdown + LaTeX: **bold**, *italic*, $inline$, $$display$$, ![](url))
            </label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={20} className="w-full border border-[#999] bg-white px-2 py-1 font-mono text-xs" />
            <div className="mt-1 text-xs">
              Insert image:{" "}
              <input type="file" accept="image/*" onChange={onInlineUpload} className="text-xs" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <span>Published (visible to visitors)</span>
          </label>
          {error && <p className="text-xs text-[#c0392b]">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving || !title} className="border-2 border-[#2233b2] bg-[#5266c0] px-4 py-1.5 font-semibold text-white">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={onClose} className="border border-[#999] bg-white px-4 py-1.5">Cancel</button>
          </div>
        </div>
      </Panel>
    </SiteLayout>
  );
}
