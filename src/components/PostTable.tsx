import { Link } from "react-router-dom";
import type { DbPost } from "@/lib/usePosts";

export function PostRow({ p, alt }: { p: DbPost; alt?: boolean }) {
  return (
    <tr className={alt ? "bg-[#f6fbff]" : "bg-white"}>
      <td className="py-2 pr-3 align-top w-20">
        {p.cover_image ? (
          <Link to={`/blog/${p.slug}`}>
            <img
              src={p.cover_image}
              alt=""
              className="w-16 h-16 object-cover border border-[#bbb] bg-white"
            />
          </Link>
        ) : (
          <div className="w-16 h-16 border border-dashed border-[#bbb] bg-[#f0f4f4]" />
        )}
      </td>
      <td className="py-2 pr-3 align-top font-mono text-xs whitespace-nowrap">{p.date}</td>
      <td className="py-2 pr-3 align-top">
        <Link to={`/blog/${p.slug}`} className="font-semibold">
          {p.title}
        </Link>
        <div className="text-xs text-[#445]">{p.excerpt}</div>
      </td>
      <td className="py-2 align-top">
        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="otis-tag">
              #{t}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}

export function PostTable({ items }: { items: DbPost[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-[#5266c0] text-left">
          <th className="py-1 pr-3 w-20">Cover</th>
          <th className="py-1 pr-3">Date</th>
          <th className="py-1 pr-3">Title</th>
          <th className="py-1">Tags</th>
        </tr>
      </thead>
      <tbody>
        {items.map((p, i) => (
          <PostRow key={p.slug} p={p} alt={i % 2 === 0} />
        ))}
      </tbody>
    </table>
  );
}
