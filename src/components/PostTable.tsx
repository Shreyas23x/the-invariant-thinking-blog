import { Link } from "react-router-dom";
import type { DbPost } from "@/lib/usePosts";
import { topicFromTags, topicImage } from "@/lib/topics";

export function PostRow({ p }: { p: DbPost }) {
  const topic = topicFromTags(p.tags);
  const topicBg = topicImage(topic);
  const cardBg = p.cover_image || topicBg;
  const style = cardBg
    ? ({ ["--card-bg" as never]: `url(${cardBg})` } as React.CSSProperties)
    : undefined;

  return (
    <li className="blog-card mb-2 border border-[#bbb] bg-white p-3" style={style}>
      <Link to={`/blog/${p.slug}`} className="flex gap-3 items-start no-underline">
        {p.cover_image ? (
          <img
            src={p.cover_image}
            alt=""
            loading="lazy"
            className="w-20 h-20 object-cover border border-[#bbb] bg-white shrink-0"
          />
        ) : (
          <div className="w-20 h-20 border border-dashed border-[#bbb] bg-[#f0f4f4] shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-[#000055]">{p.title}</span>
            <span className="font-mono text-xs text-[#557]">{p.date}</span>
          </div>
          {p.excerpt && <div className="mt-1 text-xs text-[#445]">{p.excerpt}</div>}
          <div className="mt-1 flex flex-wrap gap-1">
            {p.tags.map((t) => (
              <span key={t} className="otis-tag">#{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </li>
  );
}

export function PostTable({ items }: { items: DbPost[] }) {
  return (
    <ul className="list-none p-0 m-0">
      {items.map((p) => (
        <PostRow key={p.slug} p={p} />
      ))}
    </ul>
  );
}
