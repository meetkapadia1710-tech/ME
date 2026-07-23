"use client";

import { useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    const isReduced = prefersReducedMotion();
    if (isReduced || typeof window === "undefined") return;

    // Set initial camera position
    camera.position.z = 5;

    // As you scroll down the DOM, the camera physically flies forward through the 3D space
    const tl = gsap.to(camera.position, {
      z: -150, // Fly 150 units deep into the scene
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 1.5 second smoothing for that buttery "flying" feel
      },
    });

    return () => {
      tl.kill();
    };
  }, [camera]);

  // Gentle constant rotation for life
  useFrame((_, delta) => {
    if (prefersReducedMotion()) return;
    camera.rotation.z += delta * 0.05;
  });

  return null;
}

export default function GlobalWebGL() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] h-screen w-screen bg-background">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: false, antialias: true }}
      >
        <color attach="background" args={["#09090b"]} /> {/* Matches Tailwind background */}
        
        {/* We use 3 layers of stars to create massive depth to fly through */}
        <Stars radius={10} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        {/* We can't use color prop on Stars directly, so we just use saturation */}
        <Stars radius={30} depth={100} count={2000} factor={6} saturation={1} fade speed={1.5} />
        <Stars radius={50} depth={150} count={1000} factor={8} saturation={0.5} fade speed={2} />
        
        <CameraController />
      </Canvas>
    </div>
  );
}
