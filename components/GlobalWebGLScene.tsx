"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Icosahedron, MeshDistortMaterial, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";
import { useWebGLStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HeroScene() {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (prefersReducedMotion()) return;
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.15;
      innerRef.current.rotation.y += delta * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y -= delta * 0.15;
      
      // Pointer interaction
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      outerRef.current.rotation.x += (targetY - outerRef.current.rotation.x) * 0.05;
      outerRef.current.rotation.y += (targetX - outerRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={[3, 0, 0]} scale={1.2}>
        {/* Inner solid core */}
        <Icosahedron ref={innerRef} args={[1.2, 2]}>
          <meshStandardMaterial color="#059669" roughness={0.3} metalness={0.8} />
        </Icosahedron>
        {/* Outer wireframe shell */}
        <Icosahedron ref={outerRef} args={[1.5, 2]}>
          <MeshDistortMaterial
            color="#10b981"
            distort={0.3}
            speed={1.5}
            roughness={0.2}
            wireframe
            transparent
            opacity={0.4}
          />
        </Icosahedron>
      </group>
    </Float>
  );
}

function ApproachScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Scroll-linked rotation for the Approach CTA
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (meshRef.current) {
          meshRef.current.rotation.y = self.progress * Math.PI * 2;
          meshRef.current.rotation.x = self.progress * Math.PI * 0.5;
        }
      },
    });
    return () => st.kill();
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || prefersReducedMotion()) return;

    const targetX = state.pointer.y * 0.14;
    const targetY = state.pointer.x * 0.14;
    mesh.rotation.x += (targetX - mesh.rotation.x) * delta * 2;
    mesh.rotation.y += (targetY - mesh.rotation.y) * delta * 2;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 3]} />
      <meshPhysicalMaterial
        color="#10b981"
        roughness={0.15}
        metalness={0.5}
        transmission={0.5} // glass-like
        thickness={1}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function SceneManager() {
  const activeScene = useWebGLStore((s) => s.activeScene);
  const isReduced = prefersReducedMotion();

  return (
    <>
      {/* Universal Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#10b981" />

      {/* Background Stars (always present) */}
      {!isReduced && (
        <group>
          <Stars radius={20} depth={60} count={2500} factor={4} saturation={0} fade speed={1} />
        </group>
      )}

      {/* Conditionally render geometry based on route */}
      {!isReduced && activeScene === "hero" && <HeroScene />}
      {!isReduced && activeScene === "approach-cta" && <ApproachScene />}

      {/* Post-processing (skip on reduced motion) */}
      {!isReduced && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.5} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </>
  );
}

export default function GlobalWebGLScene() {
  // If completely reduced, we might skip rendering the canvas entirely, 
  // but it's often safer to just render empty so React doesn't complain about hooks.
  // Actually, stars look fine with reduced motion if they don't move, but we disabled them above.

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" aria-hidden>
      <Canvas
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Cap pixel ratio for performance
      >
        <SceneManager />
      </Canvas>
    </div>
  );
}
