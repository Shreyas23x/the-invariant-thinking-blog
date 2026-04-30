import katex from "react-katex";
const { BlockMath, InlineMath } = katex as unknown as {
  BlockMath: React.ComponentType<{ math: string }>;
  InlineMath: React.ComponentType<{ math: string }>;
};

// Render a text segment with **bold** and *italic* markdown.
function renderInlineMarkdown(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  // Match **bold** first, then *italic*
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

// Renders a paragraph with inline `$...$` and converts standalone `$$...$$` paragraphs into block math.
export function MathParagraph({ text }: { text: string }) {
  const trimmed = text.trim();

  // Image paragraph: ![alt](url)
  const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imgMatch) {
    return (
      <div className="my-3">
        <img src={imgMatch[2]} alt={imgMatch[1]} className="max-w-full border border-[#bbb]" />
      </div>
    );
  }

  // Whole paragraph is a block formula
  const blockMatch = trimmed.match(/^\$\$([\s\S]+)\$\$$/);
  if (blockMatch) {
    return (
      <div className="my-2 overflow-x-auto">
        <BlockMath math={blockMatch[1].trim()} />
      </div>
    );
  }

  // Split on inline $...$
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
          <InlineMath key={i} math={p.value} />
        ) : (
          <span key={i}>{renderInlineMarkdown(p.value, `p${i}`)}</span>
        ),
      )}
    </p>
  );
}
