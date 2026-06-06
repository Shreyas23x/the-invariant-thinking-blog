import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type DbPost } from "@/lib/usePosts";
import { MathBody } from "@/components/MathText";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <SiteLayout pageTitle="Admin — Invariant Thinking" title="Admin">
        <Panel><p>Loading…</p></Panel>
      </SiteLayout>
    );
  }

  if (!user) return <LoginForm />;
  if (!isAdmin) {
    return (
      <SiteLayout pageTitle="Admin — Invariant Thinking" title="Admin">
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
    <SiteLayout pageTitle="Admin login — Invariant Thinking" title="Admin login">
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
  const [tab, setTab] = useState<"posts" | "journal" | "questions" | "theme">("posts");

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
    <SiteLayout pageTitle="Admin panel — Invariant Thinking" title="Admin panel">
      <Panel subtitle="Manage posts, journal entries, and math questions.">
        <div className="mb-3 flex gap-2 flex-wrap">
          <Link to="/" className="border border-[#999] bg-white px-3 py-1 text-sm">← Back to site</Link>
          {(["posts","journal","questions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border px-3 py-1 text-sm ${tab===t ? "border-[#2233b2] bg-[#5266c0] text-white font-semibold" : "border-[#999] bg-white"}`}
            >{t}</button>
          ))}
        </div>

        {tab === "posts" && (
          <>
            <div className="mb-3">
              <button
                onClick={() => setCreating(true)}
                className="border-2 border-[#2233b2] bg-[#5266c0] px-3 py-1 text-sm font-semibold text-white"
              >+ New post</button>
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
          </>
        )}

        {tab === "journal" && <JournalManager />}
        {tab === "questions" && <QuestionsManager />}
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
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadFile(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file, {
      contentType: file.type || undefined,
    });
    if (error) { setError(error.message); return null; }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    if (url) setCoverImage(url);
  }

  async function onInlineUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    if (url) setBody((b) => `${b}\n\n![](${url})\n`);
    e.target.value = "";
  }

  async function onPdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    if (url) setBody((b) => `${b}\n\n[pdf:${f.name}](${url})\n`);
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
    <SiteLayout pageTitle="Edit post — Invariant Thinking" title={isNew ? "New post" : `Edit: ${post!.title}`}>
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
            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
              <label className="otis-label">Body</label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#445]">
                  **bold** · *italic* · $inline$ · $$display$$ · [text](url) · ![](img-url) · [pdf:name](url) ·
                  {" :::center :::"} · {":::right :::"} · {':::hide title="reveal" :::'}
                </span>

                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="border border-[#2233b2] bg-white px-2 py-0.5 text-xs font-semibold text-[#2233b2] whitespace-nowrap"
                >
                  👁 Preview
                </button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={22}
              className="w-full border border-[#999] bg-white px-2 py-1 font-mono text-xs"
            />
            <div className="mt-1 text-xs flex flex-wrap gap-3">
              <label>Insert image: <input type="file" accept="image/*" onChange={onInlineUpload} className="text-xs" /></label>
              <label>Attach PDF: <input type="file" accept="application/pdf" onChange={onPdfUpload} className="text-xs" /></label>
            </div>
            {(() => {
              const pdfs = Array.from(body.matchAll(/\[pdf:([^\]]+)\]\(([^)\s]+)\)/g));
              if (pdfs.length === 0) return null;
              return (
                <div className="mt-2 border border-[#9999cc] bg-[#f4f4ff] p-2">
                  <div className="otis-label text-xs mb-1">Attached PDFs</div>
                  <ul className="space-y-1 text-xs">
                    {pdfs.map((m, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-2">
                        <span className="truncate">📄 {m[1]}</span>
                        <button
                          type="button"
                          onClick={() => {
                            // Remove the exact occurrence; also trim any extra surrounding blank lines.
                            const token = m[0];
                            const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                            setBody((b) => b.replace(new RegExp(`\\n*\\s*${escaped}\\s*\\n*`), "\n\n"));
                          }}
                          className="border border-[#c0392b] px-2 py-0.5 text-[#c0392b]"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

          </div>
          {showPreview && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowPreview(false)}
            >
              <div
                className="bg-white border-2 border-[#2233b2] max-w-4xl w-full max-h-[90vh] overflow-auto p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3 sticky top-0 bg-white pb-2 border-b border-[#ddd]">
                  <div className="otis-label text-sm">Live preview — {title || "(untitled)"}</div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="border border-[#999] bg-white px-3 py-1 text-xs"
                  >
                    Close ✕
                  </button>
                </div>
                {body.trim() ? (
                  <MathBody body={body} />
                ) : (
                  <p className="text-xs italic text-[#445]">Nothing to preview yet…</p>
                )}
              </div>
            </div>
          )}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <span>
              <b>{published ? "Public" : "Private (draft)"}</b> —{" "}
              {published ? "visible to all visitors" : "only you can see it"}
            </span>
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

function JournalManager() {
  const [entries, setEntries] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", body: "", date: new Date().toISOString().slice(0,10) });

  async function refresh() {
    const { data } = await supabase.from("journal_entries").select("*").order("date", { ascending: false });
    setEntries(data ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function save() {
    if (!draft.title) return;
    if (editingId) {
      await supabase.from("journal_entries").update(draft).eq("id", editingId);
    } else {
      await supabase.from("journal_entries").insert(draft);
    }
    setDraft({ title: "", body: "", date: new Date().toISOString().slice(0,10) });
    setEditingId(null);
    refresh();
  }
  function startEdit(e: any) {
    setEditingId(e.id);
    setDraft({ title: e.title, body: e.body, date: e.date });
  }
  async function del(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("journal_entries").delete().eq("id", id);
    refresh();
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="border border-[#bbb] bg-[#f6fbff] p-3 space-y-2">
        <div className="font-semibold">{editingId ? "Edit entry" : "New journal entry"}</div>
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Title" className="w-full border border-[#999] bg-white px-2 py-1" />
        <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          className="border border-[#999] bg-white px-2 py-1" />
        <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          rows={6} placeholder="Body (markdown + LaTeX)"
          className="w-full border border-[#999] bg-white px-2 py-1 font-mono text-xs" />
        <div className="flex gap-2">
          <button onClick={save} className="border-2 border-[#2233b2] bg-[#5266c0] px-3 py-1 text-white font-semibold">
            {editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setDraft({ title:"", body:"", date: new Date().toISOString().slice(0,10) }); }}
              className="border border-[#999] bg-white px-3 py-1">Cancel</button>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="border border-[#bbb] bg-white p-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-mono text-xs text-[#557]">{e.date}</span>
              <span className="font-semibold">{e.title}</span>
              <span className="ml-auto space-x-2 text-xs">
                <button onClick={() => startEdit(e)} className="text-[#2233b2]">edit</button>
                <button onClick={() => del(e.id)} className="text-[#c0392b]">delete</button>
              </span>
            </div>
            {e.body && <div className="mt-1 text-xs text-[#445] whitespace-pre-wrap">{e.body.slice(0, 200)}{e.body.length>200 ? "…" : ""}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", body: "", source: "", difficulty: "", date: new Date().toISOString().slice(0,10) });

  async function refresh() {
    const { data } = await supabase.from("math_questions").select("*").order("date", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function save() {
    if (!draft.title) return;
    const payload = { ...draft, source: draft.source || null, difficulty: draft.difficulty || null };
    if (editingId) {
      await supabase.from("math_questions").update(payload).eq("id", editingId);
    } else {
      await supabase.from("math_questions").insert(payload);
    }
    setDraft({ title: "", body: "", source: "", difficulty: "", date: new Date().toISOString().slice(0,10) });
    setEditingId(null);
    refresh();
  }
  function startEdit(q: any) {
    setEditingId(q.id);
    setDraft({ title: q.title, body: q.body, source: q.source ?? "", difficulty: q.difficulty ?? "", date: q.date });
  }
  async function del(id: string) {
    if (!confirm("Delete this question?")) return;
    await supabase.from("math_questions").delete().eq("id", id);
    refresh();
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="border border-[#bbb] bg-[#f6fbff] p-3 space-y-2">
        <div className="font-semibold">{editingId ? "Edit question" : "New question"}</div>
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Title (e.g. USAMO 2017/4)" className="w-full border border-[#999] bg-white px-2 py-1" />
        <div className="grid gap-2 sm:grid-cols-3">
          <input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })}
            placeholder="Source" className="border border-[#999] bg-white px-2 py-1" />
          <input value={draft.difficulty} onChange={(e) => setDraft({ ...draft, difficulty: e.target.value })}
            placeholder="Difficulty" className="border border-[#999] bg-white px-2 py-1" />
          <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className="border border-[#999] bg-white px-2 py-1" />
        </div>
        <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          rows={8} placeholder="Statement + solution (markdown + LaTeX)"
          className="w-full border border-[#999] bg-white px-2 py-1 font-mono text-xs" />
        <div className="flex gap-2">
          <button onClick={save} className="border-2 border-[#2233b2] bg-[#5266c0] px-3 py-1 text-white font-semibold">
            {editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setDraft({ title:"", body:"", source:"", difficulty:"", date: new Date().toISOString().slice(0,10) }); }}
              className="border border-[#999] bg-white px-3 py-1">Cancel</button>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((q) => (
          <li key={q.id} className="border border-[#bbb] bg-white p-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold">{q.title}</span>
              {q.source && <span className="otis-tag">{q.source}</span>}
              {q.difficulty && <span className="otis-tag">{q.difficulty}</span>}
              <span className="font-mono text-xs text-[#557] ml-auto">{q.date}</span>
              <span className="space-x-2 text-xs">
                <button onClick={() => startEdit(q)} className="text-[#2233b2]">edit</button>
                <button onClick={() => del(q.id)} className="text-[#c0392b]">delete</button>
              </span>
            </div>
            {q.body && <div className="mt-1 text-xs text-[#445] whitespace-pre-wrap">{q.body.slice(0, 200)}{q.body.length>200 ? "…" : ""}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
