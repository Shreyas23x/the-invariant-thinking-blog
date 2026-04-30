import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { usePosts, postsByCategory, CATEGORIES } from "@/lib/usePosts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — ~/FoxLog" },
      {
        name: "description",
        content:
          "All posts from FoxLog, grouped by CS Projects, Math Olympiad, and NBA Analysis.",
      },
      { property: "og:title", content: "Blog — ~/FoxLog" },
      { property: "og:description", content: "All posts grouped by category." },
    ],
  }),
  component: BlogIndex,
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function BlogIndex() {
  const { posts } = usePosts();
  const all = posts ?? [];

  return (
    <SiteLayout
      title="Blog"
      sidebar={
        <div>
          <div className="otis-label text-xs">Categories</div>
          <ul className="mt-1 space-y-1 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <a href={`#${slugify(c)}`}>» {c}</a>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {CATEGORIES.map((category) => {
        const items = postsByCategory(all, category);
        return (
          <Panel key={category} title={category}>
            <a id={slugify(category)} />
            {items.length === 0 ? (
              <p className="text-sm italic text-[#445]">
                Nothing here yet — coming soon.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#5266c0] text-left">
                    <th className="py-1 pr-3">Date</th>
                    <th className="py-1 pr-3">Title</th>
                    <th className="py-1">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p, i) => (
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
            )}
          </Panel>
        );
      })}
    </SiteLayout>
  );
}
