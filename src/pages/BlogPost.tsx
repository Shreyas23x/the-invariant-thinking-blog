import { Link, useParams } from "react-router-dom";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { MathBody } from "@/components/MathText";
import { usePost, usePosts } from "@/lib/usePosts";
import { useLikes } from "@/lib/useLikes";
import { topicFromTags, topicImage } from "@/lib/topics";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = usePost(slug);
  const { posts } = usePosts();
  const { count, liked, toggle, busy } = useLikes(post?.id);

  if (post === undefined) {
    return (
      <SiteLayout title="Loading…">
        <Panel><p>Loading post…</p></Panel>
      </SiteLayout>
    );
  }

  if (post === null) {
    return (
      <SiteLayout title="404 — post not found">
        <Panel>
          <p>That post doesn't exist (yet?). Try the <Link to="/blog">blog index</Link>.</p>
        </Panel>
      </SiteLayout>
    );
  }

  const all = posts ?? [];
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const topic = topicFromTags(post.tags);
  const topicBg = topicImage(topic);

  return (
    <SiteLayout
      pageTitle={`${post.title} — Invariant Thinking`}
      pageDescription={post.excerpt}
      title={post.title}
      sidebar={
        <div>
          <div className="otis-label text-xs">Meta</div>
          <p className="mt-1 text-xs"><b>date:</b> {post.date}</p>
          <p className="text-xs"><b>category:</b> {post.category}</p>
          {topic && <p className="text-xs"><b>topic:</b> {topic.replace("-", " ")}</p>}
          <div className="mt-1 flex flex-wrap gap-1">
            {post.tags.map((t) => (<span key={t} className="otis-tag">#{t}</span>))}
          </div>
          <button
            onClick={toggle}
            disabled={busy}
            className="mt-3 flex items-center gap-1 border border-[#5266c0] bg-white px-3 py-1 text-sm hover:bg-[#ccccff]"
            aria-label={liked ? "unlike" : "like"}
          >
            <span className={liked ? "text-[#8f008f]" : "text-[#5266c0]"} aria-hidden>
              {liked ? "★" : "☆"}
            </span>
            <span>{count}</span>
          </button>
        </div>
      }
    >
      <Panel>
        <div
          className={topicBg ? "topic-bg p-3 -m-3 mb-3" : ""}
          style={topicBg ? { backgroundImage: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(${topicBg})` } : undefined}
        >
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt=""
              className="mb-4 w-full max-h-96 object-contain bg-[#f6fbff] border border-[#bbb]"
            />
          )}
          <article>
            <MathBody body={post.body} />
          </article>
        </div>
      </Panel>

      <nav className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
        <div className="border border-[#bbb] bg-[#f6fbff] p-2 min-h-[3rem]">
          {older ? (
            <Link to={`/blog/${older.slug}`}>
              <div className="text-xs text-[#557]">← older</div>
              <div className="font-semibold">{older.title}</div>
            </Link>
          ) : (<div className="text-xs text-[#aab]">← older</div>)}
        </div>
        <div className="border border-[#bbb] bg-[#f6fbff] p-2 min-h-[3rem] sm:text-right">
          {newer ? (
            <Link to={`/blog/${newer.slug}`}>
              <div className="text-xs text-[#557]">newer →</div>
              <div className="font-semibold">{newer.title}</div>
            </Link>
          ) : (<div className="text-xs text-[#aab]">newer →</div>)}
        </div>
      </nav>

      <p className="mt-3 text-sm">
        <Link to="/blog">← back to all posts</Link>
      </p>
    </SiteLayout>
  );
}
