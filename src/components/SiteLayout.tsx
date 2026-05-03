import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useSiteViews } from "@/lib/useLikes";

const nav = [
  { to: "/", label: "Home" },
  { to: "/cs-projects", label: "CS Projects" },
  { to: "/math", label: "Math" },
  { to: "/nba-analysis", label: "NBA Analysis" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({
  title,
  children,
  sidebar,
  pageTitle,
  pageDescription,
}: {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}) {
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (pageTitle) document.title = pageTitle;
    if (pageDescription) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
      }
      m.setAttribute("content", pageDescription);
    }
  }, [pageTitle, pageDescription]);

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <div id="header" className="otis-header relative">
          <Link to="/">
            <h1 id="sitetitle" className="text-2xl sm:text-3xl font-mono">
              ~/Invariant Thinking
            </h1>
          </Link>
          <span className="absolute bottom-1 right-3 text-xs italic opacity-80">
            By r3v
          </span>
        </div>

        <div className="mt-2 flex justify-end text-sm">
          <div id="email_box">
            {user ? (
              <>
                👋, <b>{isAdmin ? "admin" : user.email}</b>
                {isAdmin && (
                  <>
                    {" · "}
                    <Link to="/admin" className="text-[#2233b2]">admin panel</Link>
                  </>
                )}
                {" · "}
                <a
                  className="text-[#c0392b]"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  (logout)
                </a>
              </>
            ) : (
              <>
                👋, <b>visitor</b>.
              </>
            )}
          </div>
        </div>

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
                <span className="col-span-8 text-left text-[#666]">
                  ~ a personal logbook
                </span>
                <span className="col-span-4 text-right" aria-hidden>
                  <span className="text-2xl">𝔼[i]</span>
                  <span className="ml-2 text-xs italic text-[#666]">r3v</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div id="side" className="otis-side">
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

        <SiteFooter />
      </div>
    </div>
  );
}

function SiteFooter() {
  const views = useSiteViews();
  return (
    <footer className="mt-6 mb-4 text-center text-xs text-[#557]">
      © {new Date().getFullYear()} — handcrafted with semicolons & tea
      <div className="mt-1">
        Theme inspired by{" "}
        <a href="https://web.evanchen.cc/" target="_blank" rel="noreferrer">
          Evan Chen's OTIS
        </a>
        .
      </div>
      <div className="mt-1 font-mono">
        ★ total site views: {views === null ? "…" : views.toLocaleString()}
      </div>
    </footer>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: ReactNode;
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
