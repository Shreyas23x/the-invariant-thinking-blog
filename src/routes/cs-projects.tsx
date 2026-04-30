import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { postsByCategory } from "@/data/posts";

export const Route = createFileRoute("/cs-projects")({
  head: () => ({
    meta: [
      { title: "CS Projects — ~/FoxLog" },
      { name: "description", content: "Posts and notes from CS projects I'm shipping or breaking." },
      { property: "og:title", content: "CS Projects — ~/FoxLog" },
      { property: "og:description", content: "CS projects: posts, notes, write-ups." },
    ],
  }),
  component: CSProjects,
});

function CSProjects() {
  const items = postsByCategory("CS Projects");
  return (
    <SiteLayout title="CS Projects">
      <Panel subtitle="Write-ups, experiments, and tiny tools I keep rewriting.">
        {items.length === 0 ? (
          <p className="text-sm italic text-[#445]">Nothing here yet — coming soon.</p>
        ) : (
          <PostTable items={items} />
        )}
      </Panel>
    </SiteLayout>
  );
}

function PostTable({ items }: { items: ReturnType<typeof postsByCategory> }) {
  return (
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
  );
}
