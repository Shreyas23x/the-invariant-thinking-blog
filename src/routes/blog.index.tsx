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
    <SiteLayout
      title="Blog"
      sidebar={
        <div>
          <div className="otis-label text-xs">Tags</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="otis-tag">
                #{t}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <Panel subtitle="Posts, in reverse chronological order.">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#5266c0] text-left">
              <th className="py-1 pr-3">Date</th>
              <th className="py-1 pr-3">Title</th>
              <th className="py-1">Tags</th>
            </tr>
          </thead>
          <tbody>
            {all.map((p, i) => (
              <tr
                key={p.slug}
                className={i % 2 === 0 ? "bg-[#f6fbff]" : "bg-white"}
              >
                <td className="py-1 pr-3 align-top font-mono text-xs whitespace-nowrap">
                  {p.date}
                </td>
                <td className="py-1 pr-3 align-top">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="font-semibold"
                  >
                    {p.title}
                  </Link>
                  <div className="text-xs text-[#445]">{p.excerpt}</div>
                </td>
                <td className="py-1 align-top">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="otis-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </SiteLayout>
  );
}
