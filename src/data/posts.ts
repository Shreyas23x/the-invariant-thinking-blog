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
