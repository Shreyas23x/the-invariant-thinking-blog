import { SiteLayout, Panel } from "@/components/SiteLayout";
import { PostTable } from "@/components/PostTable";
import { MathBody } from "@/components/MathText";
import { usePosts, postsByCategory } from "@/lib/usePosts";
import { useJournal, useQuestions } from "@/lib/useJournal";

export default function MathOlympiad() {
  const { posts: allPosts } = usePosts();
  const posts = postsByCategory(allPosts ?? [], "Math Olympiad");
  const { entries } = useJournal();
  const { questions } = useQuestions();

  return (
    <SiteLayout
      pageTitle="Math — Invariant Thinking"
      title="Math"
      sidebar={
        <div>
          <div className="otis-label text-xs">Sections</div>
          <ul className="mt-1 space-y-1 text-sm">
            <li><a href="#journal">» Journal</a></li>
            <li><a href="#my-problems">» My Questions</a></li>
            <li><a href="#posts">» Posts</a></li>
          </ul>
        </div>
      }
    >
      <Panel title="Journal" subtitle="Day-by-day notes from training, contests, and problem sets.">
        <a id="journal" />
        {entries.length === 0 ? (
          <p className="text-sm italic text-[#445]">Nothing logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="border-l-2 border-[#5266c0] pl-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-[#557]">{e.date}</span>
                  <span className="font-semibold">{e.title}</span>
                </div>
                {e.body && <div className="mt-1 text-sm"><MathBody body={e.body} /></div>}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="My Questions" subtitle="Problems I've written or collected, with solutions.">
        <a id="my-problems" />
        {questions.length === 0 ? (
          <p className="text-sm italic text-[#445]">Coming soon.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li key={q.id} className="border border-[#bbb] bg-white p-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold">{q.title}</span>
                  {q.source && <span className="otis-tag">{q.source}</span>}
                  {q.difficulty && <span className="otis-tag">{q.difficulty}</span>}
                  <span className="font-mono text-xs text-[#557] ml-auto">{q.date}</span>
                </div>
                {q.body && <div className="mt-2 text-sm"><MathBody body={q.body} /></div>}
              </li>
            ))}
          </ul>
        )}
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
