import geometry from "@/assets/topic-geometry.jpg";
import combinatorics from "@/assets/topic-combinatorics.jpg";
import algebra from "@/assets/topic-algebra.jpg";
import numberTheory from "@/assets/topic-number-theory.jpg";

export type Topic = "geometry" | "combinatorics" | "algebra" | "number-theory";

const MAP: Record<Topic, string> = {
  geometry,
  combinatorics,
  algebra,
  "number-theory": numberTheory,
};

const ALIASES: Record<string, Topic> = {
  geometry: "geometry",
  geom: "geometry",
  combinatorics: "combinatorics",
  combo: "combinatorics",
  algebra: "algebra",
  alg: "algebra",
  "number-theory": "number-theory",
  numbertheory: "number-theory",
  nt: "number-theory",
};

export function topicFromTags(tags: string[] | null | undefined): Topic | null {
  if (!tags) return null;
  for (const t of tags) {
    const key = t.toLowerCase().replace(/\s+/g, "-");
    if (key in ALIASES) return ALIASES[key];
  }
  return null;
}

export function topicImage(topic: Topic | null): string | null {
  return topic ? MAP[topic] : null;
}
