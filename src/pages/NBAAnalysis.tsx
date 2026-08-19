import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { usePosts, postsByCategory } from "@/lib/usePosts";

export default function NBAAnalysis() {
  const { posts } = usePosts();
  const items = postsByCategory(posts ?? [], "NBA Analysis");
  return (
    <SiteLayout pageTitle="NBA Analysis — Invariant Thinking" title="NBA Analysis">
      <Panel subtitle="Everything basketball related. I'm a Grizzlies fan 4life.">
        {items.length === 0 ? (
          <p className="text-sm italic text-[#445]">Nothing here yet — coming soon.</p>
        ) : (
          <PostTable items={items} />
        )}
      </Panel>
    </SiteLayout>
  );
}
