import "dotenv/config";
import { db } from "../db";
import { projects } from "../db/schema";
import { ARCHIVE_STUDIES } from "../lib/archiveData";

async function main() {
  console.log("Starting archive migration...");
  
  for (const study of ARCHIVE_STUDIES) {
    console.log(`Migrating ${study.slug}...`);
    
    // Type checking for 'type' enum
    const validTypes = ["Personal", "Team", "Client", "Hackathon", "Systems"];
    let typeToInsert = study.role;
    if (!validTypes.includes(typeToInsert)) {
      typeToInsert = "Personal"; // Fallback
    }
    
    await db.insert(projects).values({
      name: study.name,
      slug: study.slug,
      tagline: study.tagline,
      type: typeToInsert as "Personal" | "Team" | "Client" | "Hackathon" | "Systems",
      year: study.year,
      tags: study.stack,
      overview: study.overview,
      liveUrl: study.slug === "bd-buildcon" ? "https://bdbuildcon.com" : null, // add placeholder just to be safe if any
      featured: false,
    }).onConflictDoNothing({ target: projects.slug });
  }

  console.log("Migration complete.");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
