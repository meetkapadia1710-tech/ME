import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.meta.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  try {
    const post = getPostBySlug(params.slug);
    const title = `${post.meta.title} — Meet Kapadia`;
    return {
      title,
      description: post.meta.excerpt,
      openGraph: { title, description: post.meta.excerpt },
      twitter: { title, description: post.meta.excerpt },
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return {
      title: "Not Found",
    };
  }
}

export default function BlogPostPage({ params }: Props) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.meta.slug === params.slug);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const mdxOptions = {
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "vitesse-dark",
            keepBackground: false,
          },
        ],
      ],
    },
  };

  return (
    <>
      <Nav />
      <main>
          <article className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
            <header className="mb-16 md:mb-24">
              <div className="mb-6 flex flex-wrap gap-3 font-mono text-meta uppercase tracking-widest text-fg-muted">
                <time dateTime={post.meta.date}>{post.meta.date}</time>
                <span>&bull;</span>
                <span>{post.meta.readingTime}</span>
              </div>
              <h1 className="mb-8 font-display text-heading-md font-medium tracking-tight md:text-heading-lg lg:text-heading-xl md:leading-tight">
                {post.meta.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-fg-primary/5 px-3 py-1 font-mono text-meta-sm uppercase tracking-wider text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-invert max-w-[65ch]">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <MDXRemote source={post.content} options={mdxOptions as any} />
            </div>
            
            <div className="mt-24 md:mt-32 border-t border-fg-primary/10 pt-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  {prevPost && (
                    <Link
                      href={`/blog/${prevPost.meta.slug}`}
                      className="group flex flex-col items-start gap-3"
                    >
                      <span className="font-mono text-meta uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg-primary/60">
                        Previous Post
                      </span>
                      <span className="font-display text-heading-sm font-medium transition-colors group-hover:text-fg-primary/80">
                        {prevPost.meta.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="flex justify-end">
                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.meta.slug}`}
                      className="group flex flex-col items-end gap-3 text-right"
                    >
                      <span className="font-mono text-meta uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg-primary/60">
                        Next Post
                      </span>
                      <span className="font-display text-heading-sm font-medium transition-colors group-hover:text-fg-primary/80">
                        {nextPost.meta.title}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
      </main>
      <Footer />
    </>
  );
}
