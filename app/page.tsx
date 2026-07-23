import HomeClient from "@/components/HomeClient";
import { getAllPosts } from "@/lib/mdx";

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts.length > 0 ? posts[0] : null;

  return <HomeClient latestPost={latestPost} />;
}
