export type TechChoice = { name: string; why: string };

export type CaseStudyImages = {
  /** Full-width banner shown below the meta row. */
  hero: string;
  /** Side-by-side / stacked gallery screenshots. */
  screenshots?: string[];
  /** Video loops for the gallery. */
  videos?: string[];
};

export type CaseStudyData = {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  year: string;
  /** Short tags for the meta row. */
  stack: string[];
  overview: string;
  approach?: string;
  techStack?: TechChoice[];
  features?: string[];
  /** Visual assets — optional so existing pages compile without changes. */
  images?: CaseStudyImages;
  playgroundType?: "none" | "iframe" | "interactive" | "video";
  playgroundUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playgroundConfig?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any; // the loaded MDX content
  liveUrl?: string;
};

/** Canonical ordering — drives prev/next wrap-around and matches Selected Works. */
export const CASE_STUDY_ORDER = [

  { slug: "playhub", name: "PlayHub" },
  { slug: "locateme-family", name: "LocateMe Family" },
  { slug: "repograde", name: "RepoGrade" },
] as const;

/** Adjacent case studies with wrap-around (last -> first, first -> last). */
export function getAdjacent(slug: string) {
  const order = CASE_STUDY_ORDER;
  const i = order.findIndex((w) => w.slug === slug);
  const len = order.length;
  const safe = i === -1 ? 0 : i;
  return {
    prev: order[(safe - 1 + len) % len],
    next: order[(safe + 1) % len],
  };
}
