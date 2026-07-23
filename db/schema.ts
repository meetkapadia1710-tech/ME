import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export type TechChoice = { name: string; why: string };

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
  techStack: jsonb("tech_stack").$type<TechChoice[]>(),
  keyFeatures: text("key_features").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(), // MDX/markdown
  tags: text("tags").array().notNull(),
  readingTime: text("reading_time"),
  publishedAt: timestamp("published_at"), // null = draft
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
