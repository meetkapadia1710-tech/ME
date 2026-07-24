export type Work = {
  num: string;
  slug: string;
  name: string;
  brief: string;
  year: string;
  tags: string[];
  thumbnail: string;
  playgroundType?: "none" | "iframe" | "interactive" | "video";
  skillCategories?: string[];
};

// NOTE: `year` values are PLACEHOLDERS — confirm/replace with the real ship year.
export const WORKS: Work[] = [
  {
    num: "01",
    slug: "playhub",
    name: "PlayHub",
    brief:
      "Cross-platform turf booking app for cricket and pickleball courts, with real-time booking, Razorpay payments, and role-based dashboards for players, owners, and admins.",
    year: "2025",
    tags: ["Mobile Development", "Full-Stack"],
    thumbnail: "/work/playhub/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Frontend", "Mobile", "Backend"],
  },
  {
    num: "02",
    slug: "locateme-family",
    name: "LocateMe Family",
    brief:
      "Consent-first family location-sharing app, built for trust rather than surveillance.",
    year: "2025",
    tags: ["Mobile Development", "Android"],
    thumbnail: "/work/locateme-family/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Mobile", "Systems"],
  },
  {
    num: "03",
    slug: "repograde",
    name: "RepoGrade",
    brief:
      "GitHub tool that scores repositories and auto-generates READMEs grounded in the actual code.",
    year: "2025",
    tags: ["Developer Tools", "Full-Stack", "AI"],
    thumbnail: "/work/repograde/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Frontend", "Backend", "Systems", "AI/Tooling"],
  },
];
