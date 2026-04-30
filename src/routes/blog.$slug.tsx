import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { getPost, sortedPosts } from "@/data/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} — ~/notebook` : "Post — ~/notebook";
    const description = post?.excerpt ?? "A post on ~/notebook.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: PostPage,
});

function NotFound() {
  return (
    <SiteLayout>
      <Panel title="404 — post not found">
        <p>
          That post doesn't exist (yet?). Try the{" "}
          <Link to="/blog">blog index</Link>.
        </p>
      </Panel>
    </SiteLayout>
  );
}

function ErrorView({ error }: { error: Error }) {
  return (
    <SiteLayout>
      <Panel title="Something went wrong">
        <p>{error.message}</p>
      </Panel>
    </SiteLayout>
  );
}

function PostPage() {
  const { post } = Route.useLoaderData();
  const all = sortedPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  const paragraphs = post.body.split(/\n\s*\n/);

  return (
    <SiteLayout>
      <Panel title={post.title}>
        <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-sm">
          <span className="otis-label">date:</span>
          <span>{post.date}</span>
          <span className="mx-2 opacity-40">·</span>
          {post.tags.map((t) => (
            <span key={t} className="otis-tag">
              #{t}
            </span>
          ))}
        </div>

        <article className="space-y-4 leading-relaxed text-[1.02rem]">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
      </Panel>

      <nav className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="otis-card p-4 min-h-[5rem]">
          {older ? (
            <Link to="/blog/$slug" params={{ slug: older.slug }}>
              <div className="otis-label text-xs">← older</div>
              <div className="mt-1 font-mono font-semibold">{older.title}</div>
            </Link>
          ) : (
            <div className="otis-label text-xs opacity-50">← older</div>
          )}
        </div>
        <div className="otis-card p-4 min-h-[5rem] sm:text-right">
          {newer ? (
            <Link to="/blog/$slug" params={{ slug: newer.slug }}>
              <div className="otis-label text-xs">newer →</div>
              <div className="mt-1 font-mono font-semibold">{newer.title}</div>
            </Link>
          ) : (
            <div className="otis-label text-xs opacity-50">newer →</div>
          )}
        </div>
      </nav>

      <div className="mt-4">
        <Link to="/blog" className="otis-bar inline-block">
          ← back to all posts
        </Link>
      </div>
    </SiteLayout>
  );
}
