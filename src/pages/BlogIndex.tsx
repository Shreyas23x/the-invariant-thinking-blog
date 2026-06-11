import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { usePosts, postsByCategory, CATEGORIES, categoryLabel } from "@/lib/usePosts";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogIndex() {
  const { posts } = usePosts();
  const all = posts ?? [];

  return (
    <SiteLayout
      pageTitle="Blog — Invariant Thinking"
      title="Blog"
      sidebar={
        <div>
          <div className="otis-label text-xs">Categories</div>
          <ul className="mt-1 space-y-1 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}><a href={`#${slugify(c)}`}>» {c}</a></li>
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
              <p className="text-sm italic text-[#445]">Nothing here yet — coming soon.</p>
            ) : (
              <PostTable items={items} />
            )}
          </Panel>
        );
      })}
    </SiteLayout>
  );
}
