import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { postsByCategory } from "@/data/posts";

export const Route = createFileRoute("/math-olympiad")({
  head: () => ({
    meta: [
      { title: "Math Olympiad — ~/FoxLog" },
      { name: "description", content: "Olympiad journal, my own problems, and posts." },
      { property: "og:title", content: "Math Olympiad — ~/FoxLog" },
      { property: "og:description", content: "Olympiad journal, problems, and posts." },
    ],
  }),
  component: MathOlympiad,
});

function MathOlympiad() {
  const posts = postsByCategory("Math Olympiad");

  return (
    <SiteLayout
      title="Math Olympiad"
      sidebar={
        <div>
          <div className="otis-label text-xs">Sections</div>
          <ul className="mt-1 space-y-1 text-sm">
            <li><a href="#journal">» Journal</a></li>
            <li><a href="#my-problems">» My Problems</a></li>
            <li><a href="#posts">» Posts</a></li>
          </ul>
        </div>
      }
    >
      <Panel title="Journal" subtitle="Day-by-day notes from training, contests, and problem sets.">
        <a id="journal" />
        <p className="text-sm italic text-[#445]">
          Nothing logged yet. The journal will be a running, dated log of what I'm
          working on — problems attempted, ideas tried, things that didn't work.
        </p>
      </Panel>

      <Panel title="My Problems" subtitle="Problems I've written, with solutions.">
        <a id="my-problems" />
        <p className="text-sm italic text-[#445]">
          Coming soon — original problems with full write-ups.
        </p>
      </Panel>

      <Panel title="Posts" subtitle="Longer write-ups: techniques, derivations, lessons.">
        <a id="posts" />
        {posts.length === 0 ? (
          <p className="text-sm italic text-[#445]">No posts yet.</p>
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
              {posts.map((p, i) => (
                <tr key={p.slug} className={i % 2 === 0 ? "bg-[#f6fbff]" : "bg-white"}>
                  <td className="py-1 pr-3 align-top font-mono text-xs whitespace-nowrap">{p.date}</td>
                  <td className="py-1 pr-3 align-top">
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="font-semibold">
                      {p.title}
                    </Link>
                    <div className="text-xs text-[#445]">{p.excerpt}</div>
                  </td>
                  <td className="py-1 align-top">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="otis-tag">#{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </SiteLayout>
  );
}
