import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ~/notebook" },
      {
        name: "description",
        content:
          "About me: a short bio, what I work on, and where this notebook is headed.",
      },
      { property: "og:title", content: "About — ~/notebook" },
      {
        property: "og:description",
        content: "A short bio, what I work on, and where this notebook is headed.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <Panel title="About" subtitle="The author, very briefly.">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4 leading-relaxed">
            <p>
              Hi, I'm the person on the other end of this notebook. I write
              software for a living and write about math for joy. Most of what
              you'll find here falls into one of three buckets: a problem I
              chewed on, a tool I rewrote, or a tea I drank.
            </p>
            <p>
              I'm partial to small things that are well made — short proofs,
              short scripts, short walks. If a post here runs long, it's
              because I couldn't figure out how to make it shorter.
            </p>
            <p>
              The visual style of this site is borrowed (with great affection)
              from a course-management system I grew up reading. If it makes
              you feel like you're checking a problem-set portal, that's the
              right vibe.
            </p>
          </div>

          <aside className="space-y-3">
            <div className="otis-card p-4">
              <div className="otis-label text-sm">Currently</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>📍 Somewhere with good tea</li>
                <li>💻 Building small tools</li>
                <li>📓 Writing more, shipping less</li>
              </ul>
            </div>
            <div className="otis-card p-4 bg-sky text-sky-foreground border-sky-foreground/20">
              <div className="otis-label text-sm !text-sky-foreground">
                Likes
              </div>
              <p className="mt-2 text-sm">
                Olympiad geometry, terminal colors, and the moment a proof
                clicks.
              </p>
            </div>
          </aside>
        </div>
      </Panel>
    </SiteLayout>
  );
}
