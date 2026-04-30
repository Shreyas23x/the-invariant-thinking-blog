export type Category = "CS Projects" | "Math Olympiad" | "NBA Analysis";

export const CATEGORIES: Category[] = [
  "CS Projects",
  "Math Olympiad",
  "NBA Analysis",
];

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  tags: string[];
  excerpt: string;
  body: string; // simple paragraphs separated by blank lines
};

export const posts: Post[] = [
  {
    slug: "the-quadratic-formula",
    title: "Where the quadratic formula comes from",
    date: "2025-04-29",
    category: "Math Olympiad",
    tags: ["algebra", "derivation"],
    excerpt:
      "Completing the square, slowly, until the quadratic formula falls out on its own — no memorisation required.",
    body: `Everyone learns the quadratic formula. Far fewer people are shown where it comes from. The whole derivation is just one trick — *completing the square* — applied carefully. Let's do it together.

We want to solve $ax^2 + bx + c = 0$, where $a \\neq 0$.

Step 1. Divide through by $a$ so the leading coefficient is $1$:

$$x^2 + \\frac{b}{a}\\,x + \\frac{c}{a} = 0.$$

Step 2. Move the constant term to the other side:

$$x^2 + \\frac{b}{a}\\,x = -\\frac{c}{a}.$$

Step 3. Here is the trick. We want the left-hand side to be a perfect square $(x + k)^2 = x^2 + 2kx + k^2$. Matching the middle term forces $2k = b/a$, so $k = b/(2a)$. Add $k^2 = b^2/(4a^2)$ to both sides:

$$x^2 + \\frac{b}{a}\\,x + \\frac{b^2}{4a^2} = \\frac{b^2}{4a^2} - \\frac{c}{a}.$$

Step 4. The left side is now a perfect square, and we tidy the right side over a common denominator:

$$\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}.$$

Step 5. Take square roots — remembering the $\\pm$ — and solve for $x$:

$$x + \\frac{b}{2a} = \\pm\\frac{\\sqrt{b^2 - 4ac}}{2a}, \\qquad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}.$$

That's the quadratic formula, and the quantity $\\Delta = b^2 - 4ac$ is the *discriminant*. If $\\Delta > 0$ there are two real roots; if $\\Delta = 0$ a repeated root $x = -b/(2a)$; if $\\Delta < 0$ two complex conjugate roots.

A small sanity check. Take $x^2 - 5x + 6 = 0$, so $a=1$, $b=-5$, $c=6$, and $\\Delta = 25 - 24 = 1$. Then $x = (5 \\pm 1)/2$, giving $x = 3$ or $x = 2$. And indeed $(x-2)(x-3) = x^2 - 5x + 6$. ✓

The reason I like this derivation: the formula isn't a magic incantation, it's the residue of one geometric idea. "Completing the square" is literally that — turning an L-shaped region $x^2 + bx$ into a square by adding a small corner of area $(b/2)^2$. Once you've seen the picture, the formula is impossible to forget.`,
  },
  {
    slug: "hello-world",
    title: "Hello, world ~",
    date: "2025-03-04",
    category: "CS Projects",
    tags: ["meta", "intro"],
    excerpt:
      "A first post. Why I'm starting FoxLog, and what you can expect to find inside.",
    body: `Welcome to FoxLog! This little site is my personal logbook — somewhere between a blog, a wiki, and a scratchpad.

I plan to write about three things, mostly: CS projects I'm shipping (or breaking), math olympiad problems I'm chewing on, and NBA analysis when the numbers get interesting.

Posts will be short. Posts will be wrong sometimes. That's fine — a notebook is allowed to be wrong; that's the whole point of writing things down.`,
  },
  {
    slug: "amgm-warmup",
    title: "An AM-GM warmup I keep coming back to",
    date: "2025-03-21",
    category: "Math Olympiad",
    tags: ["inequalities", "AM-GM"],
    excerpt:
      "A tiny three-variable inequality that teaches you when AM-GM is the right hammer — and when it isn't.",
    body: `Here is a problem I give myself whenever I haven't done olympiad inequalities in a while. For positive reals $a, b, c$ with $abc = 1$, prove

$$\\frac{1}{a+b+1} + \\frac{1}{b+c+1} + \\frac{1}{c+a+1} \\leq 1.$$

The tempting move is to AM-GM the denominators directly. That gives a bound in the wrong direction — a classic trap. The fix: substitute $a = x/y$, $b = y/z$, $c = z/x$ (which is automatic once $abc = 1$), clear denominators, and the inequality becomes a clean SOS.

Lesson I keep relearning: AM-GM is a *finishing* tool, not an *opening* tool. Open with substitution or normalisation; close with AM-GM.`,
  },
  {
    slug: "tiny-tools",
    title: "Tiny tools I keep rewriting",
    date: "2025-04-12",
    category: "CS Projects",
    tags: ["tools", "scripts"],
    excerpt:
      "Every year I rewrite the same three scripts: a Markdown indexer, a TODO scraper, and a tea timer. Here's why that's not a waste.",
    body: `I have rewritten the same Markdown indexer at least six times. Each version is a little better, a little smaller, a little more aware of what I actually use it for.

Rewriting tiny tools is not procrastination — it's how I learn the shape of a problem. The sixth indexer fits in 40 lines because the first one was 400.

If you have a tool you keep rewriting: keep going. The version where you finally throw away the abstraction is usually the best one.`,
  },
  {
    slug: "jokic-passing-network",
    title: "Mapping Jokić's passing network",
    date: "2025-04-26",
    category: "NBA Analysis",
    tags: ["jokic", "passing", "viz"],
    excerpt:
      "A weekend project: pulling play-by-play data and drawing the directed graph of who Jokić passes to, weighted by assist value.",
    body: `Spent a Saturday pulling play-by-play data from the public NBA stats endpoints and drawing Nikola Jokić's passing graph as a directed, weighted network.

Two things jumped out. First: the edge from Jokić to the corner-three shooter is *thicker* than to the cutter at the rim — even though the cut feels more iconic. Volume isn't always where the highlights live.

Second: the network is unusually *flat*. Most stars have one or two dominant edges. Jokić's top five teammates each receive roughly the same share — which is part of why the Denver offense is so hard to scout.

Next step: weight the edges by points-per-pass instead of raw assists, and see if the picture changes.`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function sortedPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function postsByCategory(category: Category) {
  return sortedPosts().filter((p) => p.category === category);
}
