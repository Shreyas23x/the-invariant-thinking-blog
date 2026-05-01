import katex from "katex";
import "katex/contrib/mhchem"; // enables \ce{...} chemistry equations

// Macros that mimic common LaTeX packages: physics, mathbb shortcuts, etc.
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

function renderInlineMarkdown(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={`${keyPrefix}-t-${i}`}>{text.slice(last, m.index)}</span>);
    if (m[2] !== undefined) nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{m[2]}</strong>);
    else if (m[4] !== undefined) nodes.push(<em key={`${keyPrefix}-i-${i}`}>{m[4]}</em>);
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(<span key={`${keyPrefix}-t-end`}>{text.slice(last)}</span>);
  return nodes;
}

export function MathParagraph({ text }: { text: string }) {
  const trimmed = text.trim();

  const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imgMatch) {
    return (
      <div className="my-3">
        <img src={imgMatch[2]} alt={imgMatch[1]} className="max-w-full border border-[#bbb]" />
      </div>
    );
  }

  const blockMatch = trimmed.match(/^\$\$([\s\S]+)\$\$$/);
  if (blockMatch) return <KatexBlock math={blockMatch[1].trim()} />;

  const parts: Array<{ type: "text" | "math"; value: string }> = [];
  const re = /\$([^$\n]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "math", value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });

  return (
    <p>
      {parts.map((p, i) =>
        p.type === "math" ? (
          <KatexInline key={i} math={p.value} />
        ) : (
          <span key={i}>{renderInlineMarkdown(p.value, `p${i}`)}</span>
        ),
      )}
    </p>
  );
}
