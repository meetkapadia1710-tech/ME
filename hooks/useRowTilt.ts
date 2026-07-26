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
  
  /**
   * Pointer capability only — does this device hover at all?
   *
   * SelectedWorks uses this to decide click semantics: on touch devices the
   * first tap expands an inline thumbnail and the second navigates. This
   * deliberately does NOT consider prefers-reduced-motion. It used to, which
   * meant any desktop user with reduced motion enabled got the two-tap touch
   * behaviour — their first click on a case study was preventDefault()-ed and
   * appeared to do nothing.
   */
  const canHover = useRef(false);

  /** Whether the tilt/preview animations should run. Motion preference lives here. */
  const animate = useRef(false);


  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const rotXTo = useRef<((v: number) => void) | null>(null);
  const rotYTo = useRef<((v: number) => void) | null>(null);
  
  const rowRotYTo = useRef<((v: number) => void)[]>([]);
  const rowScaleTo = useRef<((v: number) => void)[]>([]);
  const rowEls = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!ready) return;

    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    animate.current = canHover.current && !prefersReducedMotion();

    if (!animate.current) return;

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
    if (!animate.current) return;
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
    if (!animate.current || !previewRef.current) return;
    gsap.to(previewRef.current, { autoAlpha: 1, scale: 1, duration: DUR_FAST * 0.8, ease: EASE_ENTRANCE });
    cardsRef.current.forEach((card, idx) => {
      if (card) gsap.to(card, { opacity: idx === i ? 1 : 0, duration: DUR_FAST * 0.5, ease: EASE_STANDARD });
    });
    rowRotYTo.current[i]?.(4);
    rowScaleTo.current[i]?.(1.008);
  };

  const hidePreview = (i?: number) => {
    if (!animate.current || !previewRef.current) return;
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
