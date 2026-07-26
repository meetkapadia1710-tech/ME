import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { requireTestDatabaseUrl } from '../e2e/require-test-db';

// This script truncates `projects`, so it gets the same guard as the E2E
// teardown: a dedicated POSTGRES_TEST_URL, never a fallback.
const sql = neon(requireTestDatabaseUrl('seed-test-db'));
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding test database...");

  // Clear existing data
  await db.delete(schema.projects);

  // Seed Projects
  // We need exactly 4 featured projects to test the limit logic
  await db.insert(schema.projects).values([
    {
      slug: "test-featured-1",
      name: "Featured Project 1",
      tagline: "Tagline 1",
      year: "2024",
      type: "Personal",
      tags: ["React"],
      featured: true,
      overview: "Overview 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "test-featured-2",
      name: "Featured Project 2",
      tagline: "Tagline 2",
      year: "2024",
      type: "Team",
      tags: ["Next.js"],
      featured: true,
      overview: "Overview 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "test-featured-3",
      name: "Featured Project 3",
      tagline: "Tagline 3",
      year: "2024",
      type: "Client",
      tags: ["Tailwind"],
      featured: true,
      overview: "Overview 3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "test-featured-4",
      name: "Featured Project 4",
      tagline: "Tagline 4",
      year: "2024",
      type: "Hackathon",
      tags: ["GSAP"],
      featured: true,
      overview: "Overview 4",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // One non-featured project
    {
      slug: "test-unfeatured",
      name: "Unfeatured Project",
      tagline: "Tagline",
      year: "2023",
      type: "Personal",
      tags: ["Python"],
      featured: false,
      overview: "Overview",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log("Test database seeded successfully.");
}

seed().catch((err) => {
  console.error("Failed to seed test database:", err);
  process.exit(1);
});
