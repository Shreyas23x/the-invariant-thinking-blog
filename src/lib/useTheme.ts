import { useEffect } from "react";
import { usePageContent } from "./usePageContent";

export const THEME_VARS = [
  { key: "background", label: "Page background", default: "#ddeeee" },
  { key: "otis-header", label: "Header banner", default: "#5266c0" },
  { key: "otis-header-border", label: "Header border", default: "#2233b2" },
  { key: "otis-main", label: "Main content panel", default: "#72fee1" },
  { key: "otis-side", label: "Sidebar", default: "#b2fee1" },
  { key: "otis-nav", label: "Nav strip / tags", default: "#ccccff" },
  { key: "otis-h1", label: "H1 color", default: "#000055" },
  { key: "otis-h2", label: "H2 color", default: "#8f008f" },
] as const;

export function ThemeApplier() {
  const { get } = usePageContent();
  useEffect(() => {
    const root = document.documentElement;
    for (const v of THEME_VARS) {
      const val = get(`theme.${v.key}`, "");
      if (val) root.style.setProperty(`--${v.key}`, val);
      else root.style.removeProperty(`--${v.key}`);
    }
  }, [get]);
  return null;
}
