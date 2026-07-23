import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { EASE_ENTRANCE, EASE_STANDARD, DUR_FAST } from "@/lib/motion";

export function useRowTilt<T extends HTMLElement = HTMLElement>({
  ready = true,
}: {
  ready?: boolean;
} = {}) {
  const rootRef = useRef<T>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const canHover = useRef(false);
  
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const rotXTo = useRef<((v: number) => void) | null>(null);
  const rotYTo = useRef<((v: number) => void) | null>(null);
  
  const rowRotYTo = useRef<((v: number) => void)[]>([]);
  const rowScaleTo = useRef<((v: number) => void)[]>([]);
  const rowEls = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!ready) return;

    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion();

    if (!canHover.current) return;

    if (previewRef.current) {
      gsap.set(previewRef.current, {
        autoAlpha: 0,
        scale: 0.85,
        xPercent: -50,
        yPercent: -50,
        transformPerspective: 1000,
        transformOrigin: "center center",
      });
      xTo.current = gsap.quickTo(previewRef.current, "x", { duration: DUR_FAST, ease: EASE_ENTRANCE });
      yTo.current = gsap.quickTo(previewRef.current, "y", { duration: DUR_FAST, ease: EASE_ENTRANCE });
      rotXTo.current = gsap.quickTo(previewRef.current, "rotationX", { duration: 0.8, ease: EASE_ENTRANCE });
      rotYTo.current = gsap.quickTo(previewRef.current, "rotationY", { duration: 0.8, ease: EASE_ENTRANCE });
    }

    rowEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { transformPerspective: 800 });
      rowRotYTo.current[i] = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: EASE_STANDARD });
      rowScaleTo.current[i] = gsap.quickTo(el, "scale", { duration: 0.35, ease: EASE_STANDARD });
    });

  }, [ready]);

  const handleMove = (e: React.MouseEvent) => {
    if (!canHover.current) return;
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    rotYTo.current?.(deltaX * 15);
    rotXTo.current?.(deltaY * -15);
  };

  const showPreview = (i: number) => {
    if (!canHover.current || !previewRef.current) return;
    gsap.to(previewRef.current, { autoAlpha: 1, scale: 1, duration: DUR_FAST * 0.8, ease: EASE_ENTRANCE });
    cardsRef.current.forEach((card, idx) => {
      if (card) gsap.to(card, { opacity: idx === i ? 1 : 0, duration: DUR_FAST * 0.5, ease: EASE_STANDARD });
    });
    rowRotYTo.current[i]?.(4);
    rowScaleTo.current[i]?.(1.008);
  };

  const hidePreview = (i?: number) => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.85, duration: DUR_FAST * 0.6, ease: EASE_ENTRANCE });
    if (i !== undefined) {
      rowRotYTo.current[i]?.(0);
      rowScaleTo.current[i]?.(1);
    }
  };

  return {
    rootRef,
    previewRef,
    cardsRef,
    rowEls,
    handleMove,
    showPreview,
    hidePreview,
    canHover,
  };
}
