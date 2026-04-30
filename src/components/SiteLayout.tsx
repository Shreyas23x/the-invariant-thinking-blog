import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/cs-projects", label: "CS Projects" },
  { to: "/math-olympiad", label: "Math Olympiad" },
  { to: "/nba-analysis", label: "NBA Analysis" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * Faithful replication of the OTIS-web layout.html structure:
 *   .container
 *     #header       <- purple-blue banner with site title
 *     #email_box    <- top-right login/status strip
 *     #content
 *       #main       <- bright mint, contains .entry > h1#pagetitle + .entrywrap
 *       #side       <- lighter mint sidebar with #navigation_box
 */
export function SiteLayout({
  title,
  children,
  sidebar,
}: {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
}) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        {/* #header */}
        <div id="header" className="otis-header relative">
          <Link to="/">
            <h1 id="sitetitle" className="text-2xl sm:text-3xl">
              𝔽(x) ~/FoxLog
            </h1>
          </Link>
          <span className="absolute bottom-1 right-3 text-xs italic opacity-80">
            By r3v
          </span>
        </div>

        {/* #email_box — small status strip, right-aligned, like OTIS */}
        <div className="mt-2 flex justify-end text-sm">
          <div id="email_box">
            👋, <b>visitor</b>.{" "}
            <a className="text-[#c0392b]" href="#" onClick={(e) => e.preventDefault()}>
              (logout)
            </a>
          </div>
        </div>

        {/* #content — main + side, like OTIS row layout */}
        <div id="content" className="mt-3 grid gap-3 md:grid-cols-12">
          <div className="md:col-span-9">
            <div id="main" className="otis-main">
              <div className="entry">
                {title && (
                  <h1 id="pagetitle" className="mb-3 text-2xl">
                    {title}
                  </h1>
                )}
                <div className="entrywrap otis-entrywrap">{children}</div>
              </div>

              <div className="mt-3 grid grid-cols-12 items-center text-sm">
                <span className="col-span-8 text-left">
                  <a
                    className="text-[#666]"
                    href="https://github.com/vEnhance/otis-web/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Report issue or feature request
                  </a>
                </span>
                <span className="col-span-4 text-right text-2xl" aria-hidden>
                  𝔼[X]
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div id="side" className="otis-side">
              {/* #navigation_box */}
              <div id="navigation_box" className="otis-navbox">
                <div className="otis-label text-xs uppercase tracking-wide">
                  Navigation
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {nav.map((item) => {
                    const active =
                      item.to === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.to);
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className={active ? "font-bold underline" : ""}
                        >
                          » {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {sidebar && <div className="mt-3 text-sm">{sidebar}</div>}

              <div className="mt-3 text-xs text-[#335]">
                <div className="otis-label text-xs">Elsewhere</div>
                <ul className="mt-1 space-y-1">
                  <li>
                    <a href="https://github.com" target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  </li>
                  <li>
                    <a href="mailto:hello@example.com">Email ↗</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 mb-4 text-center text-xs text-[#557]">
          © {new Date().getFullYear()} — handcrafted with semicolons & tea
        </footer>
      </div>
    </div>
  );
}

/**
 * A "section" inside the white .entrywrap — for stacking multiple
 * content blocks on one page, in the OTIS visual style.
 */
export function Panel({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5 last:mb-0">
      {title && <h2 className="mt-0 mb-2 text-xl">{title}</h2>}
      {subtitle && <p className="mb-3 italic text-[#445]">{subtitle}</p>}
      {children}
    </section>
  );
}
