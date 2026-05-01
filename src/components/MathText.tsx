import { BlockMath, InlineMath } from "react-katex";
import "katex/contrib/mhchem"; // enables \ce{...} chemistry equations

// Macros that mimic common LaTeX packages: physics, cancel, color, etc.
// KaTeX supports a `macros` option per render. We define a shared set.
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
  "\\eval": "\\left. #1 \\right|",
  // common shortcuts
  "\\RR": "\\mathbb{R}",
  "\\NN": "\\mathbb{N}",
  "\\ZZ": "\\mathbb{Z}",
  "\\QQ": "\\mathbb{Q}",
  "\\CC": "\\mathbb{C}",
  "\\FF": "\\mathbb{F}",
  "\\eps": "\\varepsilon",
  // cancel-like (KaTeX has \cancel built-in)
};

const KATEX_OPTS = {
  macros: KATEX_MACROS,
  trust: true,
  strict: false as const,
  throwOnError: false,
};

function renderInlineMarkdown(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={`${keyPrefix}-t-${i}`}>{text.slice(last, m.index)}</span>);
    if (m[2] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{m[2]}</strong>);
    } else if (m[4] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-i-${i}`}>{m[4]}</em>);
    }
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
  if (blockMatch) {
    return (
      <div className="my-2 overflow-x-auto math-newtx">
        <BlockMath math={blockMatch[1].trim()} settings={KATEX_OPTS} />
      </div>
    );
  }

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
          <span key={i} className="math-newtx">
            <InlineMath math={p.value} settings={KATEX_OPTS} />
          </span>
        ) : (
          <span key={i}>{renderInlineMarkdown(p.value, `p${i}`)}</span>
        ),
      )}
    </p>
  );
}
