import { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { ARCHIVE_STUDIES } from "@/lib/archiveData";

export function generateStaticParams() {
  return ARCHIVE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = ARCHIVE_STUDIES.find((s) => s.slug === params.slug);
  if (!data) return {};
  return {
    title: `${data.name} | Archive`,
    description: data.overview,
  };
}

export default function ArchiveCaseStudy({ params }: { params: { slug: string } }) {
  const data = ARCHIVE_STUDIES.find((s) => s.slug === params.slug);

  if (!data) {
    notFound();
  }

  return <CaseStudy data={data} type="archive" />;
}
