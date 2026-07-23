"use client";

import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/lenis";

/**
 * Client wrapper that starts Lenis + ScrollTrigger for the whole app.
 * `initSmoothScroll` returns its own cleanup, which useEffect runs on unmount.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => initSmoothScroll(), []);
  return <>{children}</>;
}
