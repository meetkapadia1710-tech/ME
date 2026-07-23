import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Archive from "@/components/Archive";

const PAGE_TITLE = "Archive — Meet Kapadia";
const PAGE_DESCRIPTION =
  "Everything else I've built. An archive of personal projects, team builds, hackathons, and client work.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default function ArchivePage() {
  return (
    <>
      <Nav />
      <main>
        <Archive />
      </main>
      <Footer />
    </>
  );
}
