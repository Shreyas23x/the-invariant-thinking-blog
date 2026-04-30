import { BlockMath, InlineMath } from "react-katex";

// Renders a paragraph with inline `$...$` and converts standalone `$$...$$` paragraphs into block math.
export function MathParagraph({ text }: { text: string }) {
  const trimmed = text.trim();
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
        p.type === "math" ? <InlineMath key={i} math={p.value} /> : <span key={i}>{p.value}</span>,
      )}
    </p>
  );
}
