import { SiteLayout, Panel } from "@/components/SiteLayout";
import { EditableText } from "@/components/EditableText";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const inputCls =
    "w-full border border-[#999] bg-white px-2 py-1 text-sm focus:outline-none focus:border-[#5266c0]";

  return (
    <SiteLayout
      pageTitle="Contact — ~/FoxLog"
      pageDescription="Get in touch — email, social links, and a (frontend-only) message form."
      title="Contact"
      sidebar={
        <div>
          <div className="otis-label text-xs">Direct channels</div>
          <ul className="mt-1 space-y-1 text-xs">
            <li>
              ✉ <EditableText contentKey="contact.email" fallback="hello@example.com" />
            </li>
            <li>
              ⌨{" "}
              <a href="https://github.com" target="_blank" rel="noreferrer">
                github.com/you
              </a>
            </li>
          </ul>
          <p className="mt-2 text-xs italic text-[#445]">
            I read everything but I am slow to reply. Tea takes time.
          </p>
        </div>
      }
    >
      <Panel
        subtitle={
          <EditableText
            contentKey="contact.subtitle"
            fallback="The form is decorative for now — email is the real channel."
          />
        }
      >
        <form
          className="space-y-3 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label className="otis-label block text-sm mb-1" htmlFor="name">Name*</label>
            <input id="name" required className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className="otis-label block text-sm mb-1" htmlFor="email">Email*</label>
            <input id="email" type="email" required className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className="otis-label block text-sm mb-1" htmlFor="message">Message*</label>
            <textarea id="message" rows={5} required className={inputCls} placeholder="Say hi…" />
          </div>
          <button
            type="submit"
            className="border-2 border-[#2233b2] bg-[#5266c0] px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Send
          </button>
          {sent && (
            <p className="otis-tag !bg-[#aaffaa] !border-[#5a5]">
              ✓ Thanks! (this form is a demo — please email instead.)
            </p>
          )}
        </form>
      </Panel>
    </SiteLayout>
  );
}
