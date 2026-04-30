import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { sortedPosts } from "@/data/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "~/notebook — a personal blog" },
      {
        name: "description",
        content:
          "A personal blog: notes on math, software experiments, and the occasional tea log.",
      },
      { property: "og:title", content: "~/notebook — a personal blog" },
      {
        property: "og:description",
        content:
          "Notes on math, software experiments, and the occasional tea log.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const recent = sortedPosts().slice(0, 3);

  return (
    <SiteLayout
      title="Welcome"
      sidebar={
        <div>
          <div className="otis-label text-xs">Status</div>
          <p className="mt-1 text-xs leading-relaxed">
            ✦ Currently: writing more, shipping less.
          </p>
        </div>
      }
    >
      <Panel subtitle="Come meet me in the Ruby Palace~">
        <p className="leading-relaxed">
          This is my little corner of the web — a notebook of things I'm
          thinking about, breaking, fixing, or steeping. Expect short posts, a
          lot of footnotes, and the occasional bad pun.
        </p>
        <p className="mt-2 leading-relaxed">
          Start with the <Link to="/blog">blog index</Link>, or jump into a
          recent post below.
        </p>
      </Panel>

      <Panel title="Recent posts">
        <ul className="divide-y divide-[#ddd]">
          {recent.map((p) => (
            <li key={p.slug} className="py-2 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="font-semibold"
                >
                  {p.title}
                </Link>
                <span className="font-mono text-xs text-[#557]">{p.date}</span>
                <div className="ml-auto flex gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="otis-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm leading-relaxed">{p.excerpt}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          <Link to="/blog">→ all posts</Link>
        </p>
      </Panel>
    </SiteLayout>
  );
}
