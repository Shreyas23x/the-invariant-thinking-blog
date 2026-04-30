import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { postsByCategory } from "@/data/posts";

export const Route = createFileRoute("/nba-analysis")({
  head: () => ({
    meta: [
      { title: "NBA Analysis — ~/FoxLog" },
      { name: "description", content: "Numbers, networks, and notes on basketball." },
      { property: "og:title", content: "NBA Analysis — ~/FoxLog" },
      { property: "og:description", content: "Basketball, but with the numbers showing." },
    ],
  }),
  component: NBA,
});

function NBA() {
  const items = postsByCategory("NBA Analysis");
  return (
    <SiteLayout title="NBA Analysis">
      <Panel subtitle="Numbers, networks, and notes on basketball.">
        {items.length === 0 ? (
          <p className="text-sm italic text-[#445]">Nothing here yet — coming soon.</p>
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
