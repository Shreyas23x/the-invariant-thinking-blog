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
  topicBg,
}: {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  topicBg?: string | null;
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
        <div id="header" className="otis-header relative flex items-center justify-center py-5">
          <Link to="/" className="group inline-flex items-center gap-3" style={{ color: "#ffffff" }}>
            <h1 id="sitetitle" className="text-3xl sm:text-4xl font-mono">
              ~/Invariant Thinking
            </h1>
            <TreeGraphIcon className="h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3" aria-hidden />
          </Link>
          <span className="absolute bottom-1 right-3 text-base" style={{ fontFamily: '"STIX Two Math", "STIX Two Text", "Times New Roman", serif' }}>
            𝔼(<em style={{ fontStyle: "italic" }}>i</em>)
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
            <div
              id="main"
              className="otis-main relative"
              style={
                topicBg
                  ? {
                      backgroundImage: `linear-gradient(rgba(114,254,225,0.94), rgba(114,254,225,0.94)), url(${topicBg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
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
                <span className="text-2xl" style={{ fontFamily: '"STIX Two Math", "STIX Two Text", "Times New Roman", serif' }}>
                    𝔼(<em style={{ fontStyle: "italic" }}>i</em>)
                  </span>
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

function TreeGraphIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="1.6" />
      <circle cx="7" cy="10" r="1.6" />
      <circle cx="17" cy="10" r="1.6" />
      <circle cx="5" cy="17" r="1.6" />
      <circle cx="9" cy="17" r="1.6" />
      <circle cx="15" cy="17" r="1.6" />
      <circle cx="19" cy="17" r="1.6" />
      <path d="M12 4v2.5a1 1 0 0 1-1 1H8a1 1 0 0 0-1 1v1.5M12 5.5a1 1 0 0 1 1 1h3a1 1 0 0 0 1 1v1.5M7 10l-1 4.5M7 10l1 4.5M17 10l-2 4.5M17 10l2 4.5" />
    </svg>
  );
}

function SiteFooter() {
  const views = useSiteViews();
  return (
    <footer className="mt-6 mb-4 text-center text-xs text-[#557]">
      © {new Date().getFullYear()}
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
