"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/reveal";

function HeroMesh() {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (prefersReducedMotion()) return;

    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.12;
      innerRef.current.rotation.y += delta * 0.18;
    }
    if (outerRef.current) {
      // Gentle pointer drift
      const px = state.pointer.x * 0.4;
      const py = state.pointer.y * 0.4;
      outerRef.current.rotation.y += (px - outerRef.current.rotation.y) * 0.04;
      outerRef.current.rotation.x += (-py - outerRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.5}>
      <group position={[2.8, 0, 0]}>
        {/* Solid inner core */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.1, 2]} />
          <meshStandardMaterial
            color="#059669"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Wireframe outer shell */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.45, 2]} />
          <MeshDistortMaterial
            color="#10b981"
            distort={0.25}
            speed={1.2}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  const isReduced = prefersReducedMotion();
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 8, 4]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, -4, -4]} intensity={1.5} color="#10b981" />

      {!isReduced && (
        <Stars
          radius={18}
          depth={55}
          count={2200}
          factor={3.5}
          saturation={0}
          fade
          speed={0.6}
        />
      )}

      {!isReduced && <HeroMesh />}

      {!isReduced && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            intensity={0.8}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 58 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
