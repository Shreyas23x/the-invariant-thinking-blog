export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  excerpt: string;
  body: string; // simple paragraphs separated by blank lines
};

export const posts: Post[] = [
  {
    slug: "the-quadratic-formula",
    title: "Where the quadratic formula comes from",
    date: "2025-04-29",
    tags: ["math", "algebra"],
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
    tags: ["meta", "intro"],
    excerpt:
      "A first post. Why I'm starting this notebook, and what you can expect to find inside the cabin.",
    body: `Welcome aboard! This little site is my personal logbook — somewhere between a blog, a wiki, and a scratchpad.

I plan to write about three things, mostly: math problems I'm chewing on, software experiments that didn't go to plan, and the occasional tea recommendation.

Posts will be short. Posts will be wrong sometimes. That's fine — a notebook is allowed to be wrong; that's the whole point of writing things down.`,
  },
  {
    slug: "on-problem-solving",
    title: "Notes on problem-solving",
    date: "2025-03-21",
    tags: ["math", "thinking"],
    excerpt:
      "Three habits that made hard problems feel less hard: small examples, named conjectures, and writing the lemma you wish existed.",
    body: `When I get stuck, I do three things, in this order.

First: shrink the problem. Try n = 1, 2, 3. Draw the picture. The point isn't the answer — it's noticing what *changes* between cases.

Second: name the thing. Even a bad name ("the wobbly set") gives you a handle. You can't do induction on a noun you haven't introduced.

Third: write the lemma you wish existed. Pretend you have it. Use it. If the rest of the proof falls into place, the lemma is probably true — and now you know exactly what to prove.`,
  },
  {
    slug: "tiny-tools",
    title: "Tiny tools I keep rewriting",
    date: "2025-04-12",
    tags: ["software", "tools"],
    excerpt:
      "Every year I rewrite the same three scripts: a Markdown indexer, a TODO scraper, and a tea timer. Here's why that's not a waste.",
    body: `I have rewritten the same Markdown indexer at least six times. Each version is a little better, a little smaller, a little more aware of what I actually use it for.

Rewriting tiny tools is not procrastination — it's how I learn the shape of a problem. The sixth indexer fits in 40 lines because the first one was 400.

If you have a tool you keep rewriting: keep going. The version where you finally throw away the abstraction is usually the best one.`,
  },
  {
    slug: "ruby-palace-tea",
    title: "Tea log: the ruby palace",
    date: "2025-04-26",
    tags: ["tea", "log"],
    excerpt:
      "A short review of a Yunnan black tea that has somehow ruined every other afternoon tea for me.",
    body: `A friend mailed me a small tin of "ruby palace" — a Yunnan black, golden-tipped, smells faintly like cocoa.

Western brew, 4g / 200ml / 90°C / 3 minutes. The first cup is honey. The second cup is bread crust. The third cup is the rain on a Sunday.

Verdict: dangerous. I will not be reviewing more tea this month, because nothing else stands a chance.`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function sortedPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
