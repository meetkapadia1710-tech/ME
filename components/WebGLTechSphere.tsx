"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/reveal";

function TechNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || prefersReducedMotion()) return;
    
    // Constant rotation
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;
    
    // Smooth follow mouse interaction
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;
    meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={3}>
      <Icosahedron ref={meshRef} args={[1.5, 2]} scale={1.2}>
        <MeshDistortMaterial
          color="#10b981"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </Icosahedron>
    </Float>
  );
}

export default function WebGLTechSphere() {
  return (
    <div className="absolute top-0 right-0 z-[-1] h-[150%] w-full max-w-xl pointer-events-none opacity-60 md:w-1/2">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <TechNode />
      </Canvas>
    </div>
  );
}
