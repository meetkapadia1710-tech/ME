"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Icosahedron } from "@react-three/drei";

export default function CinematicScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // We want to create an explosion effect that reverses into a solid form.
  // Or a continuous rotation/unfold. Let's do an unfolding/assembling geometry.
  // Progress 0: Expanded / fragmented. Progress 1: Solid shape.
  
  // A solid icosahedron we can fragment:
  // @react-three/drei's Icosahedron doesn't easily fragment face by face unless we use InstancedMesh or split it manually.
  // Let's create an exploded view manually by creating multiple smaller tetrahedrons or faces.
  // Or simpler: wireframe scaling, rotation, and fading.
  
  // Let's use a group of 3 icosahedrons that rotate and scale into place.
  const shapes = useMemo(() => {
    return [
      { scale: 1.5, rotSpeed: [Math.PI, Math.PI / 2, 0], wireframe: true, color: "#10b981", opacity: 0.15 },
      { scale: 1.2, rotSpeed: [-Math.PI / 2, Math.PI, Math.PI / 4], wireframe: true, color: "#34d399", opacity: 0.25 },
      { scale: 1.0, rotSpeed: [0, -Math.PI, -Math.PI / 2], wireframe: false, color: "#064e3b", opacity: 0.9 },
    ];
  }, []);

  // Compute exact positions/rotations based on progress (0 to 1).
  // Easing function for progress (power 2 out)
  const easeProgress = 1 - Math.pow(1 - progress, 3);
  
  // Global rotation
  const globalRotX = progress * Math.PI * 0.5;
  const globalRotY = progress * Math.PI;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#6ee7b7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#064e3b" />
      <pointLight position={[0, 0, 0]} intensity={2.0} color="#10b981" distance={5} />

      <group ref={groupRef} rotation={[globalRotX, globalRotY, 0]}>
        {shapes.map((shape, i) => {
          // As progress goes 0 -> 1, they scale down from a dispersed state to their final scale
          const startScale = shape.scale * (2 + i);
          const currentScale = startScale - (startScale - shape.scale) * easeProgress;
          
          const rotX = shape.rotSpeed[0] * progress;
          const rotY = shape.rotSpeed[1] * progress;
          const rotZ = shape.rotSpeed[2] * progress;

          return (
            <Icosahedron
              key={i}
              args={[1, 0]}
              scale={[currentScale, currentScale, currentScale]}
              rotation={[rotX, rotY, rotZ]}
            >
              <meshStandardMaterial
                color={shape.color}
                wireframe={shape.wireframe}
                transparent
                opacity={shape.opacity * easeProgress} // fade in as it assembles
                roughness={0.2}
                metalness={0.8}
                side={THREE.DoubleSide}
              />
            </Icosahedron>
          );
        })}
      </group>
      
      {/* Background/ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(300).map(() => (Math.random() - 0.5) * 15)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#10b981"
          transparent
          opacity={progress * 0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
}
