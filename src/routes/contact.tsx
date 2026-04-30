import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Panel } from "@/components/SiteLayout";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ~/notebook" },
      {
        name: "description",
        content:
          "Get in touch — email, social links, and a (frontend-only) message form.",
      },
      { property: "og:title", content: "Contact — ~/notebook" },
      {
        property: "og:description",
        content: "Email, social links, and a small message form.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <Panel
        title="Contact"
        subtitle="The form is decorative for now — email is the real channel."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <label className="otis-label block text-sm mb-1" htmlFor="name">
                Name*
              </label>
              <input
                id="name"
                required
                className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="otis-label block text-sm mb-1" htmlFor="email">
                Email*
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                className="otis-label block text-sm mb-1"
                htmlFor="message"
              >
                Message*
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Say hi…"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-indigo px-4 py-2 font-mono font-semibold text-indigo-foreground hover:brightness-110 transition"
            >
              Send
            </button>
            {sent && (
              <p className="otis-bar !bg-mint !text-mint-foreground">
                ✓ Thanks! (this form is a demo — please email instead.)
              </p>
            )}
          </form>

          <aside className="space-y-3">
            <div className="otis-card p-4">
              <div className="otis-label text-sm">Direct channels</div>
              <ul className="mt-2 space-y-1 font-mono text-sm">
                <li>
                  ✉{" "}
                  <a href="mailto:hello@example.com">hello@example.com</a>
                </li>
                <li>
                  ⌨{" "}
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    github.com/you
                  </a>
                </li>
                <li>
                  🐘{" "}
                  <a
                    href="https://mastodon.social"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @you@mastodon.social
                  </a>
                </li>
              </ul>
            </div>
            <div className="otis-card p-4 bg-sky text-sky-foreground border-sky-foreground/20">
              <div className="otis-label text-sm !text-sky-foreground">
                Note
              </div>
              <p className="mt-2 text-sm">
                I read everything but I am slow to reply. Tea takes time.
              </p>
            </div>
          </aside>
        </div>
      </Panel>
    </SiteLayout>
  );
}
