import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { sortedPosts } from "@/data/posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — ~/notebook" },
      {
        name: "description",
        content:
          "All posts from ~/notebook: math, software, and tea — in chronological reverse.",
      },
      { property: "og:title", content: "Blog — ~/notebook" },
      {
        property: "og:description",
        content: "All posts from ~/notebook in reverse chronological order.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const all = sortedPosts();
  const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort();

  return (
    <SiteLayout>
      <Panel
        title="Blog"
        subtitle="Posts, in reverse chronological order. Tags are decorative — click them anyway."
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="otis-tag">
              #{t}
            </span>
          ))}
        </div>

        <ol className="space-y-4">
          {all.map((p) => (
            <li key={p.slug} className="otis-card p-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="font-mono font-bold text-lg"
                >
                  {p.title}
                </Link>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.date}
                </span>
                <div className="ml-auto flex gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="otis-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2 leading-relaxed">{p.excerpt}</p>
              <div className="mt-3">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="font-mono text-sm font-semibold"
                >
                  read post →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </SiteLayout>
  );
}
