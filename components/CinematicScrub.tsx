"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";
import { cn } from "@/lib/utils";

const TOTAL_FRAMES = 120;

// Format frame index as "frame-0000.jpeg"
const getFrameUrl = (index: number) => {
  const padded = index.toString().padStart(4, "0");
  return `/cinematic/frame-${padded}.jpeg`;
};

export default function CinematicScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReduced, setIsReduced] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  
  // Track loaded frames so we don't draw blanks if user scrolls too fast
  const [loadedCount, setLoadedCount] = useState(0);

  // Initialize GSAP and Reduced Motion check
  useEffect(() => {
    setIsReduced(prefersReducedMotion());
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Frame loading logic
  useEffect(() => {
    if (isReduced) return;

    let hasStartedLoading = false;

    // Load a single frame and return a promise
    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          setLoadedCount((prev) => Math.max(prev, index + 1));
          resolve();
        };
        img.onerror = () => {
          resolve(); // Resolve anyway to not break the chain
        };
      });
    };

    // Sequential loader to prevent network thrashing
    const loadSequence = async () => {
      // Priority load first 10 frames concurrently for smooth immediate start
      const firstBatch = Array.from({ length: Math.min(10, TOTAL_FRAMES) }, (_, i) => i);
      await Promise.all(firstBatch.map(loadFrame));

      // Load the rest sequentially in background
      for (let i = 10; i < TOTAL_FRAMES; i++) {
        await loadFrame(i);
      }
    };

    // We only want to start loading when the user is somewhat close to the section.
    // Using IntersectionObserver on the container with a rootMargin.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedLoading) {
          hasStartedLoading = true;
          loadSequence();
          observer.disconnect();
        }
      },
      { rootMargin: "1000px 0px" } // trigger when within ~1000px
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (isReduced) {
      // If reduced motion is true, just load the final frame and draw it
      const img = new Image();
      img.src = getFrameUrl(TOTAL_FRAMES - 1);
      img.onload = () => {
        imagesRef.current[TOTAL_FRAMES - 1] = img;
        drawFrame(TOTAL_FRAMES - 1);
      };
    }

    return () => observer.disconnect();
  }, [isReduced]);

  // Canvas drawing logic
  const drawImageFit = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const { width: cW, height: cH } = canvas;
    const { width: iW, height: iH } = img;
    const ratio = Math.max(cW / iW, cH / iH);
    const renderW = iW * ratio;
    const renderH = iH * ratio;
    const x = (cW - renderW) / 2;
    const y = (cH - renderH) / 2;
    
    // Clear & Draw
    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, x, y, renderW, renderH);
  };

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We try to draw the exact frame requested.
    // If it's not loaded yet, fallback to the highest loaded frame we have that is <= requested frame.
    let imgToDraw = null;
    
    // Look backwards from requested index for the most recent loaded frame
    for (let i = frameIndex; i >= 0; i--) {
      if (imagesRef.current[i]) {
        imgToDraw = imagesRef.current[i];
        break;
      }
    }

    // If still no frame (meaning we haven't even loaded frame 0), do nothing
    if (imgToDraw) {
      drawImageFit(ctx, imgToDraw, canvas);
    }
  };

  // Setup ScrollTrigger
  useEffect(() => {
    if (isReduced) return;
    if (!containerRef.current || !pinRef.current || !canvasRef.current) return;

    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
        // Redraw current frame
        if (ScrollTrigger.getById("cinematic-st")) {
          const st = ScrollTrigger.getById("cinematic-st") as globalThis.ScrollTrigger;
          const frameIndex = Math.floor(st.progress * (TOTAL_FRAMES - 1));
          drawFrame(frameIndex);
        } else {
          drawFrame(0);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Initial draw loop to catch the image once it loads, until user scrolls
    let initialDrawTimer: NodeJS.Timeout;
    const attemptInitialDraw = () => {
      if (imagesRef.current[0]) {
        drawFrame(0);
      } else {
        initialDrawTimer = setTimeout(attemptInitialDraw, 50);
      }
    };
    attemptInitialDraw();

    // Add a GSAP timeline for the text overlay
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        scrub: true,
      },
    });

    tl.to("#cinematic-text", { opacity: 1, duration: 0.2, ease: "power1.inOut" })
      .to("#cinematic-text", { opacity: 0, duration: 0.2, ease: "power1.inOut" }, 0.8);

    let lastDrawnFrame = -1;
    let rafId: number;

    const st = ScrollTrigger.create({
      id: "cinematic-st",
      trigger: containerRef.current,
      pin: pinRef.current,
      start: "top top",
      end: "+=300%",
      scrub: 1, // Increased from 0.1 for buttery smooth inertia
      onUpdate: (self) => {
        const frameIndex = Math.floor(self.progress * (TOTAL_FRAMES - 1));
        if (frameIndex !== lastDrawnFrame) {
          lastDrawnFrame = frameIndex;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => drawFrame(frameIndex));
        }
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.kill();
      st.kill();
    };
  }, [isReduced]); 

  return (
    <section 
      ref={containerRef} 
      className={cn(
        "relative w-full bg-[#0a0a0a]",
        isReduced ? "h-screen" : "h-[400vh]" // Reduced motion = simple static block, normal = tall scrolling area
      )}
    >
      <div 
        ref={pinRef} 
        className={cn(
          "relative h-screen w-full overflow-hidden",
          isReduced ? "sticky top-0" : ""
        )}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover brightness-[1.2] contrast-[1.1]"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Overlay copy */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
           <h2 className="font-display text-heading-lg text-white opacity-0 md:text-display drop-shadow-[0_0_20px_rgba(0,0,0,1)]" id="cinematic-text">
             Assembly.
           </h2>
        </div>
      </div>
    </section>
  );
}
