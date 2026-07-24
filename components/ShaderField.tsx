"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";
import { useWebGLStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;
uniform float uScrollProgress;
uniform vec2 uResolution;
uniform float uHoverIntensity;
uniform vec2 uMouseVelocity;
uniform float uSparkleSeed;

varying vec2 vUv;

// Classic Perlin 3D Noise 
// by Stefan Gustavson
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float fbm(vec3 x) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 3; ++i) {
    v += a * cnoise(x);
    x = x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  if (uIntensity < 0.001) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  vec2 aspectMouse = uMouse;
  aspectMouse.x *= uResolution.x / uResolution.y;

  // Velocity stretch: stretch coordinates along movement direction
  vec2 warp = uMouseVelocity * 2.0;
  vec2 warpedP = p - warp;

  // Domain warping (slowed down)
  vec3 pos = vec3(warpedP * 1.5, uTime * 0.03);
  pos.xy += uMouse * 0.5;

  float n = fbm(pos + fbm(pos + vec3(0.0, 0.0, uTime * 0.015)));
  
  // Palette: Emerald fading to black
  vec3 color1 = vec3(0.02, 0.59, 0.41); // #059669
  vec3 color2 = vec3(0.06, 0.73, 0.51); // #10b981
  vec3 colorBg = vec3(0.0);

  // Smoothstep for bright peaks
  float mask = smoothstep(0.0, 1.0, n + 0.5);
  mask = pow(mask, 2.0);
  
  // Modulate intensity based on target and scroll
  float activeIntensity = uIntensity * (1.0 - uScrollProgress * 0.3);

  vec3 finalColor = mix(colorBg, mix(color1, color2, mask), mask * activeIntensity);

  // Baked glow
  finalColor += color2 * pow(mask, 4.0) * activeIntensity * 0.5;

  // Sparkle Layer
  vec3 sparklePos = vec3(warpedP * 8.0, uSparkleSeed);
  float sparkleNoise = fbm(sparklePos);
  
  // Threshold to get only brightest glints
  float sparkles = smoothstep(0.75, 1.0, sparkleNoise);
  
  // Mask sparkle by inverse distance to mouse
  float distToMouse = length(p - aspectMouse);
  float mouseMask = smoothstep(0.7, 0.0, distToMouse);
  
  // Modulate sparkle density/brightness by uHoverIntensity
  float sparkleIntensity = mix(0.15, 1.2, uHoverIntensity);
  sparkles *= mouseMask * sparkleIntensity;
  
  // Additive blend sparkles
  finalColor += vec3(0.8, 1.0, 0.9) * sparkles * activeIntensity;

  // Radial vignette
  float dist = length(vUv - 0.5);
  float vignette = smoothstep(0.8, 0.2, dist);
  finalColor *= mix(1.0, vignette, activeIntensity);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const intensity = useWebGLStore((s) => s.intensity);
  const hoverTarget = useWebGLStore((s) => s.hoverTarget);
  const isReduced = prefersReducedMotion();

  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0 },
      uScrollProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHoverIntensity: { value: 0 },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uSparkleSeed: { value: Math.random() * 100 },
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [uniforms]);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        uniforms.uScrollProgress.value = self.progress;
      },
    });
    return () => st.kill();
  }, [uniforms]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    if (!isReduced) {
      uniforms.uTime.value += delta * 0.5; // Overall time slowed down
    }
    
    // Smoothly transition base intensity
    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uIntensity.value,
      intensity,
      delta * 2
    );

    // Smoothly transition hover intensity (spring feel matching /lib/motion.ts)
    materialRef.current.uniforms.uHoverIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHoverIntensity.value,
      isReduced ? 0 : hoverTarget,
      delta * 6
    );

    if (!isReduced) {
      targetMouse.current.set(state.pointer.x, state.pointer.y);
      currentMouse.current.lerp(targetMouse.current, delta * 4);
      uniforms.uMouse.value.copy(currentMouse.current);

      // Derive organic velocity directly from distance to target
      mouseVelocity.current.x = targetMouse.current.x - currentMouse.current.x;
      mouseVelocity.current.y = targetMouse.current.y - currentMouse.current.y;
      uniforms.uMouseVelocity.value.copy(mouseVelocity.current);

      uniforms.uSparkleSeed.value += delta * 0.05; // Slower sparkles
    } else {
      uniforms.uMouseVelocity.value.set(0, 0);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function ShaderField() {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const handleVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Global interaction tracker
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-shader-hover]")) {
        useWebGLStore.getState().setHoverTarget(1);
      } else {
        useWebGLStore.getState().setHoverTarget(0);
      }
    };
    const handleMouseLeave = () => {
      useWebGLStore.getState().setHoverTarget(0);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" aria-hidden>
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
