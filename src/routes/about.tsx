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
    <SiteLayout
      title="About"
      sidebar={
        <div>
          <div className="otis-label text-xs">Currently</div>
          <ul className="mt-1 space-y-1 text-xs">
            <li>📍 Somewhere with good tea</li>
            <li>💻 Building small tools</li>
            <li>📓 Writing more, shipping less</li>
          </ul>
        </div>
      }
    >
      <Panel subtitle="The author, very briefly.">
        <p className="leading-relaxed">
          Hi, I'm the person on the other end of this notebook. I write
          software for a living and write about math for joy. Most of what
          you'll find here falls into one of three buckets: a problem I chewed
          on, a tool I rewrote, or a tea I drank.
        </p>
        <p className="mt-2 leading-relaxed">
          I'm partial to small things that are well made — short proofs, short
          scripts, short walks. If a post here runs long, it's because I
          couldn't figure out how to make it shorter.
        </p>
        <p className="mt-2 leading-relaxed">
          The visual style of this site is borrowed (with great affection) from{" "}
          <a
            href="https://github.com/vEnhance/otis-web"
            target="_blank"
            rel="noreferrer"
          >
            OTIS-web
          </a>
          . If it makes you feel like you're checking a problem-set portal,
          that's the right vibe.
        </p>
      </Panel>

      <Panel title="Likes">
        <p className="leading-relaxed">
          Olympiad geometry, terminal colors, and the moment a proof clicks.
        </p>
      </Panel>
    </SiteLayout>
  );
}
