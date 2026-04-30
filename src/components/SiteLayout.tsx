import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {/* Header — indigo banner */}
        <header className="rounded-2xl bg-indigo text-indigo-foreground shadow-[0_2px_0_0_rgba(0,0,0,0.15)] border border-black/20">
          <div className="flex items-center gap-3 px-6 py-6 sm:px-8 sm:py-8">
            <span className="text-3xl sm:text-4xl" aria-hidden>⛵</span>
            <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight">
              ~/notebook
            </h1>
            <span className="ml-auto hidden sm:inline-block otis-tag !bg-indigo-foreground/10 !text-indigo-foreground !border-indigo-foreground/30">
              v1.0
            </span>
          </div>
        </header>

        {/* Login-status style strip */}
        <div className="mt-3 flex justify-end">
          <span className="otis-tag">logged in as: visitor</span>
        </div>

        {/* Nav bar */}
        <nav className="mt-3 flex flex-wrap gap-2">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "otis-bar transition-colors hover:brightness-105 " +
                  (active
                    ? "!bg-indigo !text-indigo-foreground !border-indigo"
                    : "")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Main panel */}
        <main className="mt-4">{children}</main>

        <footer className="mt-10 mb-4 text-center text-xs font-mono text-muted-foreground">
          <p>
            © {new Date().getFullYear()} — handcrafted with semicolons & tea ·{" "}
            <Link to="/about">about</Link> ·{" "}
            <Link to="/contact">contact</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="otis-panel overflow-hidden">
      <div className="otis-panel-header text-lg sm:text-xl">{title}</div>
      <div className="p-5 sm:p-7">
        {subtitle && (
          <p className="mb-4 italic text-mint-foreground/80">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
