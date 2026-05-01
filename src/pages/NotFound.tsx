import { Link } from "react-router-dom";
import { SiteLayout, Panel } from "@/components/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout pageTitle="404 — ~/FoxLog" title="404 — page not found">
      <Panel>
        <p>That page doesn't exist. Try the <Link to="/">homepage</Link> or the <Link to="/blog">blog</Link>.</p>
      </Panel>
    </SiteLayout>
  );
}
