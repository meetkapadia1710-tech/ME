import { pgTable, text, serial, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";

export type TechChoice = { name: string; why: string };
export type PlaygroundConfig = Record<string, unknown>;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  year: text("year").notNull(),
  type: text("type", { enum: ["Personal", "Team", "Client", "Hackathon", "Systems"] }).notNull(),
  tags: text("tags").array().notNull(),
  githubUrl: text("github_url"),
  featured: boolean("featured").default(false).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  heroImageUrl: text("hero_image_url"),
  overview: text("overview").notNull(),
  approach: text("approach"),
  skillCategories: text("skill_categories").array(),
  techStack: jsonb("tech_stack").$type<TechChoice[]>(),
  keyFeatures: text("key_features").array(),
  playgroundType: text("playground_type", { enum: ["none", "iframe", "interactive", "video"] }).default("none").notNull(),
  playgroundUrl: text("playground_url"),
  playgroundConfig: jsonb("playground_config").$type<PlaygroundConfig>(),
  liveUrl: text("live_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    featuredIdx: index("projects_featured_idx").on(table.featured),
    slugIdx: index("projects_slug_idx").on(table.slug),
    createdAtIdx: index("projects_created_at_idx").on(table.createdAt),
  };
});

// Blog posts are MDX files in content/posts, read through lib/mdx.ts — not a
// database table. There used to be a `posts` table here with full admin CRUD,
// but nothing public ever read it: the blog index, post pages, sitemap, and
// command palette all load from disk. Writing a post in the admin had no
// effect on the site, so the table and its admin UI were removed.
