import { SiteLayout, Panel } from "@/components/SiteLayout";
import { EditableText } from "@/components/EditableText";
import { usePosts, postsByCategory, CATEGORIES, categoryLabel } from "@/lib/usePosts";
import { Link } from "react-router-dom";

export default function Index() {
  const { posts } = usePosts();
  const all = posts ?? [];
  const recent = all.slice(0, 3);

  return (
    <SiteLayout
      pageTitle="Invariant Thinking — CS, Math & NBA Analysis"
      pageDescription="A personal blog on CS projects, math olympiad problems, and NBA analysis."
      title="Welcome to Invariant Thinking"
      sidebar={
        <div>
          <div className="otis-label text-xs">Status</div>
          <p className="mt-1 text-xs leading-relaxed">
            ✦ Currently: shipping side projects, grinding olympiad sets,
            watching too much basketball.
          </p>
        </div>
      }
    >
      <Panel
        subtitle={
          <EditableText
            contentKey="home.tagline"
            fallback="A logbook for the three things I think about most."
          />
        }
      >
        <EditableText
          as="p"
          className="leading-relaxed block"
          multiline
          contentKey="home.intro"
          fallback="Invariant Thinking is my little corner of the web. I write about three things, and I try to keep them honest:"
        />
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const count = postsByCategory(all, cat).length;
            return (
              <li key={cat} className="border border-[#5266c0] bg-white p-3">
                <div className="font-bold text-[#000055]">{categoryLabel(cat)}</div>
                <div className="text-xs text-[#445]">
                  {count} {count === 1 ? "post" : "posts"}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 leading-relaxed">
          Start with the <Link to="/blog">blog index</Link>, or jump into a
          recent post below.
        </p>
      </Panel>

      <Panel title="Recent posts">
        <ul className="divide-y divide-[#ddd]">
          {recent.map((p) => (
            <li key={p.slug} className="py-2 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <Link to={`/blog/${p.slug}`} className="font-semibold">
                  {p.title}
                </Link>
                <span className="font-mono text-xs text-[#557]">{p.date}</span>
                <span className="otis-tag">{p.category}</span>
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
