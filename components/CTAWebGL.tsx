"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/reveal";

/** Scroll progress [0..1] piped in as a ref so it doesn't trigger re-renders */
type Props = { scrollProgress: React.MutableRefObject<number> };

function DistortMesh({ scrollProgress }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || prefersReducedMotion()) return;

    // Scroll-linked rotation: full rotation as page scrolls
    const prog = scrollProgress.current;
    mesh.rotation.y = prog * Math.PI * 2;
    mesh.rotation.x = prog * Math.PI * 0.5;

    // Pointer parallax (lerped, restrained ±8°)
    const targetX = state.pointer.y * 0.14;
    const targetY = state.pointer.x * 0.14;
    mesh.rotation.x += (targetX - mesh.rotation.x) * delta * 2;
    mesh.rotation.y += (targetY - mesh.rotation.y) * delta * 2;

    // Gentle float
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 3]} />
      <MeshDistortMaterial
        color="#10b981"
        distort={0.45}
        speed={1.8}
        roughness={0.15}
        metalness={0.2}
        wireframe
        transparent
        opacity={0.28}
      />
    </mesh>
  );
}

export default function CTAWebGL({ scrollProgress }: Props) {
  if (prefersReducedMotion()) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }} gl={{ alpha: true, antialias: false }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <DistortMesh scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
