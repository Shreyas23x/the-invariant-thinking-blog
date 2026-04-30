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
    <SiteLayout>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Panel title="Welcome" subtitle="Come meet me in the Ruby Palace~">
            <p className="leading-relaxed">
              This is my little corner of the web — a notebook of things I'm
              thinking about, breaking, fixing, or steeping. Expect short
              posts, a lot of footnotes, and the occasional bad pun.
            </p>
            <p className="mt-3 leading-relaxed">
              Start with the{" "}
              <Link to="/blog" className="font-semibold">
                blog index
              </Link>
              , or jump into a recent post below.
            </p>
          </Panel>

          <Panel title="Recent posts">
            <ul className="divide-y divide-mint-foreground/15">
              {recent.map((p) => (
                <li key={p.slug} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="font-mono font-semibold text-base"
                    >
                      {p.title}
                    </Link>
                    <span className="font-mono text-xs text-mint-foreground/70">
                      {p.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{p.excerpt}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link to="/blog" className="otis-bar inline-block">
                → all posts
              </Link>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <div className="otis-card p-4">
            <div className="otis-label text-sm">About me</div>
            <p className="mt-2 text-sm leading-relaxed">
              Hi! I'm a person who likes problems that take a walk to solve.
              By day I write code; by evening I write notes about writing
              code.
            </p>
            <Link to="/about" className="mt-3 inline-block otis-tag">
              read more →
            </Link>
          </div>

          <div className="otis-card p-4">
            <div className="otis-label text-sm">Elsewhere</div>
            <ul className="mt-2 space-y-1 text-sm font-mono">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href="mailto:hello@example.com">Email ↗</a>
              </li>
              <li>
                <Link to="/contact">Contact form →</Link>
              </li>
            </ul>
          </div>

          <div className="otis-card p-4 bg-sky text-sky-foreground border-sky-foreground/20">
            <div className="otis-label text-sm !text-sky-foreground">
              Status
            </div>
            <p className="mt-2 text-sm">
              ✦ Currently: writing more, shipping less.
            </p>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
