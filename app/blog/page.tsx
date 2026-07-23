import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/mdx";

const PAGE_TITLE = "Writing — Meet Kapadia";
const PAGE_DESCRIPTION = "Thoughts on software engineering, architecture, and building products.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main>
        <BlogList posts={posts} />
      </main>
      <Footer />
    </>
  );
}
