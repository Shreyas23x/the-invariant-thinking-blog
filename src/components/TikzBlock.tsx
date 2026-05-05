import { useEffect, useRef } from "react";

let tikzjaxLoaded: Promise<void> | null = null;

function loadTikzJax(): Promise<void> {
  if (tikzjaxLoaded) return tikzjaxLoaded;
  tikzjaxLoaded = new Promise((resolve, reject) => {
    if (document.querySelector('script[data-tikzjax]')) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://tikzjax.com/v1/tikzjax.js";
    s.async = true;
    s.dataset.tikzjax = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load TikZJax"));
    document.head.appendChild(s);
  });
  return tikzjaxLoaded;
}

export function TikzBlock({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadTikzJax().then(() => {
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = "";
      const script = document.createElement("script");
      script.type = "text/tikz";
      script.text = source;
      ref.current.appendChild(script);
      // Trigger TikZJax to process the new script
      const w = window as unknown as { process_tikz?: (el: Element) => void };
      if (typeof w.process_tikz === "function") {
        w.process_tikz(script);
      }
    }).catch(() => {
      if (ref.current) {
        ref.current.innerHTML = '<span style="color:#c0392b">TikZ failed to load</span>';
      }
    });
    return () => { cancelled = true; };
  }, [source]);

  return <div ref={ref} className="my-3 flex justify-center overflow-x-auto" />;
}
