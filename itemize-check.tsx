// Temporary check for itemize/enumerate + \textit/\textbf support in MathText.
import { renderToStaticMarkup } from "react-dom/server";
import { MathBody, parseBlocks } from "./src/components/MathText";

const body = [
  "Intro with \\textit{italic text} and \\textbf{bold text} plus \\emph{emphasis} and \\underline{underlined}.",
  "",
  "\\begin{itemize}",
  "\\item First point about $x^2$",
  "\\item Second point",
  "\\end{itemize}",
  "",
  "\\itemize",
  "\\item Shorthand one",
  "\\item Shorthand two",
  "",
  "After the shorthand list, normal paragraph resumes.",
  "",
  "\\begin{enumerate}",
  "\\item Numbered one",
  "\\item Numbered two",
  "\\end{enumerate}",
  "",
  ":::center",
  "\\begin{itemize}",
  "\\item Centered list item",
  "\\end{itemize}",
  ":::",
].join("\n");

const html = renderToStaticMarkup(<MathBody body={body} />);

const fails: string[] = [];
function expect(cond: boolean, label: string) {
  if (!cond) fails.push(label);
}

expect(html.includes("<em>italic text</em>"), "\\textit renders as <em>");
expect(html.includes("<strong>bold text</strong>"), "\\textbf renders as <strong>");
expect(html.includes("<em>emphasis</em>"), "\\emph renders as <em>");
expect(html.includes("<u>underlined</u>"), "\\underline renders as <u>");
expect((html.match(/<ul[^>]*>/g) ?? []).length === 3, "three <ul> lists rendered");
expect(html.includes("<ol"), "enumerate renders as <ol>");
expect(html.includes("First point about"), "item text present");
expect(/katex/.test(html) && html.includes("x"), "math inside items renders via KaTeX");
expect(html.includes("After the shorthand list"), "text after bare \\itemize resumes");
expect(html.includes("<li>Shorthand one"), "bare \\itemize items render");
expect(html.includes("Centered list item"), "list inside :::center renders");

const blocks = parseBlocks(body);
expect(blocks.some((b) => b.type === "list" && b.env === "itemize" && b.items.length === 2), "parseBlocks itemize shape");
expect(blocks.some((b) => b.type === "list" && b.env === "enumerate" && b.items.length === 2), "parseBlocks enumerate shape");

if (fails.length) {
  console.error("FAILED:", fails);
  console.error(html.slice(0, 2000));
  process.exit(1);
}
console.log("All itemize/\\textit checks passed.");
