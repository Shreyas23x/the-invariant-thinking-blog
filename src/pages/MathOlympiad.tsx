import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { usePosts, postsByCategory } from "@/lib/usePosts";

export default function MathOlympiad() {
  const { posts: allPosts } = usePosts();
  const posts = postsByCategory(allPosts ?? [], "Math Olympiad");

  return (
    <SiteLayout
      pageTitle="Math Olympiad — ~/FoxLog"
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
          Nothing logged yet. The journal will be a running, dated log of what I'm working on.
        </p>
      </Panel>

      <Panel title="My Problems" subtitle="Problems I've written, with solutions.">
        <a id="my-problems" />
        <p className="text-sm italic text-[#445]">Coming soon — original problems with full write-ups.</p>
      </Panel>

      <Panel title="Posts" subtitle="Longer write-ups: techniques, derivations, lessons.">
        <a id="posts" />
        {posts.length === 0 ? (
          <p className="text-sm italic text-[#445]">No posts yet.</p>
        ) : (
          <PostTable items={posts} />
        )}
      </Panel>
    </SiteLayout>
  );
}
