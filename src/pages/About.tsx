import { SiteLayout, Panel } from "@/components/SiteLayout";
import { EditableText } from "@/components/EditableText";

export default function About() {
  return (
    <SiteLayout
      pageTitle="About — Invariant Thinking"
      pageDescription="About me: a short bio."
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
      <Panel
        subtitle={
          <EditableText contentKey="about.subtitle" fallback="The author, very briefly." />
        }
      >
        <EditableText
          as="p"
          className="block leading-relaxed"
          multiline
          contentKey="about.p1"
          fallback="Hi, I'm the person on the other end of this notebook."
        />
        <EditableText
          as="p"
          className="block mt-2 leading-relaxed"
          multiline
          contentKey="about.p2"
          fallback="I'm partial to small things that are well made."
        />
      </Panel>

      <Panel title="Likes">
        <EditableText
          as="p"
          className="block leading-relaxed"
          multiline
          contentKey="about.likes"
          fallback="Olympiad geometry, terminal colors, and the moment a proof clicks."
        />
      </Panel>
    </SiteLayout>
  );
}
