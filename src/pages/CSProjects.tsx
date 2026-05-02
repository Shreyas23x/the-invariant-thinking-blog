import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { usePosts, postsByCategory } from "@/lib/usePosts";

export default function CSProjects() {
  const { posts } = usePosts();
  const items = postsByCategory(posts ?? [], "CS Projects");
  return (
    <SiteLayout pageTitle="CS Projects — ~/FoxLog" title="CS Projects">
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
