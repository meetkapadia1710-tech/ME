"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  title?: React.ReactNode;
  className?: string;
}

export function SectionHeading({ label, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-10 md:grid-cols-12 mb-12 md:mb-16", className)}>
      <div className="md:col-span-3">
        <div className="overflow-hidden">
          <span
            data-reveal-heading
            className="inline-block font-mono text-meta text-fg-muted uppercase tracking-[0.15em]"
          >
            {label}
          </span>
        </div>
      </div>
      {title && (
        <div className="md:col-span-9">
          <div className="max-w-3xl overflow-hidden">
            {typeof title === "string" ? (
              <h2
                data-reveal-heading
                className="font-display text-heading-lg tracking-tight text-fg-primary"
              >
                {title}
              </h2>
            ) : (
              title
            )}
          </div>
        </div>
      )}
    </div>
  );
}
