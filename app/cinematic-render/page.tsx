"use client";

import { useSearchParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import CinematicScene from "@/components/CinematicScene";
import { Suspense } from "react";

const TOTAL_FRAMES = 120;

function CinematicContent() {
  const searchParams = useSearchParams();
  const frameStr = searchParams.get("frame");
  const frame = frameStr ? parseInt(frameStr, 10) : 0;
  
  // Progress goes from 0 to 1
  const progress = Math.max(0, Math.min(1, frame / (TOTAL_FRAMES - 1)));

  return (
    <div className="h-screen w-screen bg-[#0a0a0a]">
      {/* 
        We use preserveDrawingBuffer so playwright can screenshot it successfully.
        We fix the pixelRatio to 1 so the screenshots are consistently 1280px wide (or whatever playwright sets).
      */}
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={1}
      >
        <Suspense fallback={null}>
          <CinematicScene progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function CinematicRenderPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#0a0a0a]" />}>
      <CinematicContent />
    </Suspense>
  );
}
