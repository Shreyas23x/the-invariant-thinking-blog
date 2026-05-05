import { useState } from "react";
import katex from "katex";
import "katex/contrib/mhchem"; // enables \ce{...} chemistry equations
import { TikzBlock } from "./TikzBlock";

const KATEX_MACROS: Record<string, string> = {
  // physics package essentials
  "\\bra": "\\left\\langle #1 \\right|",
  "\\ket": "\\left| #1 \\right\\rangle",
  "\\braket": "\\left\\langle #1 \\middle| #2 \\right\\rangle",
  "\\abs": "\\left| #1 \\right|",
  "\\norm": "\\left\\| #1 \\right\\|",
  "\\dv": "\\frac{d #1}{d #2}",
  "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
  "\\dd": "\\,d",
  // mathbb shortcuts
  "\\RR": "\\mathbb{R}",
  "\\NN": "\\mathbb{N}",
  "\\ZZ": "\\mathbb{Z}",
  "\\QQ": "\\mathbb{Q}",
  "\\CC": "\\mathbb{C}",
  "\\FF": "\\mathbb{F}",
  "\\eps": "\\varepsilon",
  // common shortcuts users expect to "just work"
  "\\neq": "\\ne",
};

function renderKatex(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math, {
      displayMode,
      macros: KATEX_MACROS,
      trust: true,
      strict: "ignore",
      throwOnError: false,
      errorColor: "#c0392b",
    });
  } catch (e) {
    return `<span style="color:#c0392b">${(e as Error).message}</span>`;
  }
}

function KatexInline({ math }: { math: string }) {
  return <span className="math-newtx" dangerouslySetInnerHTML={{ __html: renderKatex(math, false) }} />;
}

function KatexBlock({ math }: { math: string }) {
  return <div className="math-newtx my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: renderKatex(math, true) }} />;
}

/**
 * Inline tokens supported within a paragraph:
 *   **bold**, *italic*, [text](url), $$display math$$, $inline math$
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Tokenize in priority order. We use a single regex with alternation and
  // walk through matches to build a node list. $$...$$ MUST be tested before
  // $...$ to avoid the $-pair-collision bug.
  const re =
    /(\$\$([\s\S]+?)\$\$)|(\$([^$\n]+?)\$)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(<span key={`${keyPrefix}-t-${i}`}>{text.slice(last, m.index)}</span>);
    }
    if (m[2] !== undefined) {
      // $$ display math $$ — render as block but inside text flow if needed
      nodes.push(<KatexInline key={`${keyPrefix}-dm-${i}`} math={m[2].trim()} />);
    } else if (m[4] !== undefined) {
      nodes.push(<KatexInline key={`${keyPrefix}-im-${i}`} math={m[4]} />);
    } else if (m[6] !== undefined && m[7] !== undefined) {
      const url = m[7];
      const isExternal = /^https?:\/\//.test(url);
      nodes.push(
        <a
          key={`${keyPrefix}-l-${i}`}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
        >
          {m[6]}
        </a>,
      );
    } else if (m[9] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{m[9]}</strong>);
    } else if (m[11] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-i-${i}`}>{m[11]}</em>);
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) {
    nodes.push(<span key={`${keyPrefix}-t-end`}>{text.slice(last)}</span>);
  }
  return nodes;
}

function HideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-3 border border-[#9999cc] bg-[#f4f4ff]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="block w-full px-3 py-1.5 text-left text-sm font-semibold text-[#000055] hover:bg-[#e8e8ff]"
      >
        {open ? "▼" : "▶"} {title}
      </button>
      {open && <div className="border-t border-[#9999cc] bg-white p-3">{children}</div>}
    </div>
  );
}

/**
 * Render a single paragraph (already split on blank lines).
 * Handles standalone image, standalone block math, otherwise inline.
 */
function renderParagraph(text: string, key: string): React.ReactNode {
  const trimmed = text.trim();

  // Standalone image: ![alt](url)
  const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imgMatch) {
    return (
      <div key={key} className="my-3">
        <img src={imgMatch[2]} alt={imgMatch[1]} className="max-w-full border border-[#bbb]" />
      </div>
    );
  }

  // Standalone display math: $$ ... $$
  const blockMatch = trimmed.match(/^\$\$([\s\S]+?)\$\$$/);
  if (blockMatch) {
    return <KatexBlock key={key} math={blockMatch[1].trim()} />;
  }

  return <p key={key}>{renderInline(text, key)}</p>;
}

/**
 * Parse a full body into block-level structures.
 * Recognizes :::center / :::right / :::left / :::hide title="..." ... :::
 * and indented blockquotes via "> ".
 */
type Block =
  | { type: "para"; text: string }
  | { type: "tikz"; source: string }
  | { type: "align"; align: "center" | "right" | "left"; children: Block[] }
  | { type: "hide"; title: string; children: Block[] };

function parseBlocks(body: string): Block[] {
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  function readUntilEnd(): Block[] {
    const inner: string[] = [];
    while (i < lines.length) {
      const ln = lines[i];
      if (/^\s*:::\s*$/.test(ln)) {
        i++;
        break;
      }
      // nested directives
      const dir = ln.match(/^\s*:::\s*(center|right|left)\s*$/);
      const hideDir = ln.match(/^\s*:::\s*hide(?:\s+title="([^"]*)")?\s*$/);
      if (dir || hideDir) {
        // flush inner accumulated paragraphs first
        flushInnerToBlocks(inner, innerBlocks);
        inner.length = 0;
        if (dir) {
          i++;
          const children = readUntilEnd();
          innerBlocks.push({ type: "align", align: dir[1] as any, children });
        } else if (hideDir) {
          i++;
          const children = readUntilEnd();
          innerBlocks.push({ type: "hide", title: hideDir[1] || "Click to reveal", children });
        }
        continue;
      }
      inner.push(ln);
      i++;
    }
    flushInnerToBlocks(inner, innerBlocks);
    const result = innerBlocks.slice();
    innerBlocks.length = 0;
    return result;
  }

  // mutable scratch arrays scoped via closure
  const innerBlocks: Block[] = [];

  function flushInnerToBlocks(buf: string[], out: Block[]) {
    const text = buf.join("\n");
    const paras = text.split(/\n\s*\n/);
    for (const p of paras) {
      if (p.trim() === "") continue;
      out.push({ type: "para", text: p });
    }
  }

  // top-level pass — simpler version (no shared scratch needed)
  const top: Block[] = [];
  let buf: string[] = [];
  function flushTop() {
    if (buf.length === 0) return;
    const text = buf.join("\n");
    const paras = text.split(/\n\s*\n/);
    for (const p of paras) {
      if (p.trim() === "") continue;
      top.push({ type: "para", text: p });
    }
    buf = [];
  }
  function readBlockUntilEnd(): Block[] {
    const innerBuf: string[] = [];
    const innerOut: Block[] = [];
    function flushInner() {
      if (innerBuf.length === 0) return;
      const text = innerBuf.join("\n");
      const paras = text.split(/\n\s*\n/);
      for (const p of paras) {
        if (p.trim() === "") continue;
        innerOut.push({ type: "para", text: p });
      }
      innerBuf.length = 0;
    }
    while (i < lines.length) {
      const ln = lines[i];
      if (/^\s*:::\s*$/.test(ln)) {
        i++;
        break;
      }
      if (/^\s*```tikz\s*$/.test(ln)) {
        flushInner();
        i++;
        const src: string[] = [];
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
          src.push(lines[i]); i++;
        }
        if (i < lines.length) i++;
        innerOut.push({ type: "tikz", source: src.join("\n") });
        continue;
      }
      const dir = ln.match(/^\s*:::\s*(center|right|left)\s*$/);
      const hideDir = ln.match(/^\s*:::\s*hide(?:\s+title="([^"]*)")?\s*$/);
      if (dir) {
        flushInner();
        i++;
        innerOut.push({ type: "align", align: dir[1] as any, children: readBlockUntilEnd() });
        continue;
      }
      if (hideDir) {
        flushInner();
        i++;
        innerOut.push({ type: "hide", title: hideDir[1] || "Click to reveal", children: readBlockUntilEnd() });
        continue;
      }
      innerBuf.push(ln);
      i++;
    }
    flushInner();
    return innerOut;
  }

  while (i < lines.length) {
    const ln = lines[i];
    const dir = ln.match(/^\s*:::\s*(center|right|left)\s*$/);
    const hideDir = ln.match(/^\s*:::\s*hide(?:\s+title="([^"]*)")?\s*$/);
    if (dir) {
      flushTop();
      i++;
      top.push({ type: "align", align: dir[1] as any, children: readBlockUntilEnd() });
      continue;
    }
    if (hideDir) {
      flushTop();
      i++;
      top.push({ type: "hide", title: hideDir[1] || "Click to reveal", children: readBlockUntilEnd() });
      continue;
    }
    buf.push(ln);
    i++;
  }
  flushTop();
  // Silence unused readUntilEnd noise
  void readUntilEnd;
  return top;
}

function renderBlock(b: Block, key: string): React.ReactNode {
  if (b.type === "para") return renderParagraph(b.text, key);
  if (b.type === "align") {
    const cls =
      b.align === "center" ? "text-center" : b.align === "right" ? "text-right" : "text-left";
    return (
      <div key={key} className={cls}>
        {b.children.map((c, i) => renderBlock(c, `${key}-${i}`))}
      </div>
    );
  }
  if (b.type === "hide") {
    return (
      <HideBlock key={key} title={b.title}>
        {b.children.map((c, i) => renderBlock(c, `${key}-${i}`))}
      </HideBlock>
    );
  }
  return null;
}

/** Render a single paragraph string (legacy export, used by older callers). */
export function MathParagraph({ text }: { text: string }) {
  return <>{renderParagraph(text, "p")}</>;
}

/** Render a full body including alignment + hide directives. */
export function MathBody({ body }: { body: string }) {
  const blocks = parseBlocks(body);
  return (
    <div className="space-y-3 leading-relaxed">
      {blocks.map((b, i) => renderBlock(b, `b-${i}`))}
    </div>
  );
}
