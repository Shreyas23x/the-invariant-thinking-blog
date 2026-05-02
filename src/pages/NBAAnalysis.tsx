import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { usePosts, postsByCategory } from "@/lib/usePosts";

export default function NBAAnalysis() {
  const { posts } = usePosts();
  const items = postsByCategory(posts ?? [], "NBA Analysis");
  return (
    <SiteLayout pageTitle="NBA Analysis — ~/FoxLog" title="NBA Analysis">
      <Panel subtitle="Numbers, networks, and notes on basketball.">
        {items.length === 0 ? (
          <p className="text-sm italic text-[#445]">Nothing here yet — coming soon.</p>
        ) : (
          <PostTable items={items} />
        )}
      </Panel>
    </SiteLayout>
  );
}
