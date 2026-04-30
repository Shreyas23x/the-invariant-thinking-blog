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
    <SiteLayout title="404 — post not found">
      <Panel>
        <p>
          That post doesn't exist (yet?). Try the <Link to="/blog">blog index</Link>.
        </p>
      </Panel>
    </SiteLayout>
  );
}

function ErrorView({ error }: { error: Error }) {
  return (
    <SiteLayout title="Something went wrong">
      <Panel>
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
    <SiteLayout
      title={post.title}
      sidebar={
        <div>
          <div className="otis-label text-xs">Meta</div>
          <p className="mt-1 text-xs">
            <b>date:</b> {post.date}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {post.tags.map((t) => (
              <span key={t} className="otis-tag">
                #{t}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <Panel>
        <article className="space-y-3 leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
      </Panel>

      <nav className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
        <div className="border border-[#bbb] bg-[#f6fbff] p-2 min-h-[3rem]">
          {older ? (
            <Link to="/blog/$slug" params={{ slug: older.slug }}>
              <div className="text-xs text-[#557]">← older</div>
              <div className="font-semibold">{older.title}</div>
            </Link>
          ) : (
            <div className="text-xs text-[#aab]">← older</div>
          )}
        </div>
        <div className="border border-[#bbb] bg-[#f6fbff] p-2 min-h-[3rem] sm:text-right">
          {newer ? (
            <Link to="/blog/$slug" params={{ slug: newer.slug }}>
              <div className="text-xs text-[#557]">newer →</div>
              <div className="font-semibold">{newer.title}</div>
            </Link>
          ) : (
            <div className="text-xs text-[#aab]">newer →</div>
          )}
        </div>
      </nav>

      <p className="mt-3 text-sm">
        <Link to="/blog">← back to all posts</Link>
      </p>
    </SiteLayout>
  );
}
