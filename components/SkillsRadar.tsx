"use client";

import { useRef, useState, useEffect, useMemo, KeyboardEvent } from "react";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";
import { DUR_STANDARD, EASE_ENTRANCE } from "@/lib/motion";
import { TOOLS } from "@/lib/coreToolsData";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { PROOFS } from "@/lib/proofsData";

// Define our standard categories
const CATEGORIES = ["Frontend", "Backend", "Mobile", "Systems", "AI/Tooling"];

// Simulated fetch from DB for the client side.
// In a real Server Component we'd pass these down as props, 
// but since this is interactive we can accept them as props.
export type RadarProjectData = {
  slug: string;
  name: string;
  isArchive: boolean;
  skillCategories: string[];
};

type SkillsRadarProps = {
  projects: RadarProjectData[];
};

export default function SkillsRadar({ projects }: SkillsRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);
  const pointsRef = useRef<SVGCircleElement[]>([]);
  const labelsRef = useRef<SVGTextElement[]>([]);
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 1. Compute Data
  const radarData = useMemo(() => {
    // Tally projects
    const projectTally: Record<string, RadarProjectData[]> = {};
    CATEGORIES.forEach(c => projectTally[c] = []);
    
    projects.forEach(p => {
      p.skillCategories?.forEach(cat => {
        if (projectTally[cat]) {
          projectTally[cat].push(p);
        }
      });
    });

    // Compute raw scores (Project Count * 1) + (Core Tool * 2)
    const rawScores = CATEGORIES.map(cat => {
      let score = projectTally[cat].length;
      TOOLS.forEach(tool => {
        if (tool.categories?.includes(cat)) {
          score += 2; // Arbitrary weight to represent "core proficiency"
        }
      });
      return { category: cat, score, projects: projectTally[cat], proofs: PROOFS.filter(p => p.categories.includes(cat)) };
    });

    // Normalize scores so the max is always touching the outer edge of the radar
    const maxScore = Math.max(...rawScores.map(s => s.score), 1);
    
    return rawScores.map(s => ({
      ...s,
      normalizedValue: Math.max(0.1, s.score / maxScore) // Minimum 10% radius so it doesn't vanish
    }));
  }, [projects]);

  // 2. Math for Radar Chart
  const size = 400;
  const center = size / 2;
  const radius = size * 0.35; // leave room for labels
  
  const getPoint = (index: number, total: number, value: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2; // start top
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle)
    };
  };

  // Pre-calculate target points
  const points = radarData.map((d, i) => getPoint(i, CATEGORIES.length, d.normalizedValue));
  const targetPointsString = points.map(p => `${p.x},${p.y}`).join(" ");
  
  // Starting points (all at center)
  const zeroPointsString = points.map(() => `${center},${center}`).join(" ");

  // 3. Animation
  useEffect(() => {
    const isReduced = prefersReducedMotion();
    if (isReduced) {
      if (polygonRef.current) polygonRef.current.setAttribute("points", targetPointsString);
      pointsRef.current.forEach((pt, i) => {
        if (pt) {
          pt.setAttribute("cx", points[i].x.toString());
          pt.setAttribute("cy", points[i].y.toString());
        }
      });
      return;
    }

    // Set initial
    if (polygonRef.current) polygonRef.current.setAttribute("points", zeroPointsString);

    return createRevealContext(containerRef, () => {
      // Animate Polygon
      gsap.to(polygonRef.current, {
        attr: { points: targetPointsString },
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        }
      });

      // Animate Points
      pointsRef.current.forEach((pt, i) => {
        if (!pt) return;
        gsap.to(pt, {
          attr: { cx: points[i].x, cy: points[i].y },
          duration: DUR_STANDARD,
          ease: EASE_ENTRANCE,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          }
        });
      });

      // Animate Labels
      gsap.from(labelsRef.current, {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        }
      });
    });
  }, [targetPointsString, zeroPointsString, points]);

  const handleKeyDown = (e: KeyboardEvent, cat: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveCategory(activeCategory === cat ? null : cat);
    }
  };

  const activeData = radarData.find(d => d.category === activeCategory);

  return (
    <section ref={containerRef} className="divider-top relative w-full py-24 md:py-32 bg-background flex flex-col md:flex-row gap-12 items-center justify-center">
      
      {/* Visualizer Side */}
      <div className="relative w-full max-w-[500px] aspect-square shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Background Web */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <polygon
              key={`web-${i}`}
              points={CATEGORIES.map((_, idx) => {
                const pt = getPoint(idx, CATEGORIES.length, scale);
                return `${pt.x},${pt.y}`;
              }).join(" ")}
              className="fill-none stroke-emerald-900/30 stroke-[1]"
            />
          ))}
          {CATEGORIES.map((_, idx) => {
            const pt = getPoint(idx, CATEGORIES.length, 1);
            return (
              <line 
                key={`axis-${idx}`} 
                x1={center} y1={center} 
                x2={pt.x} y2={pt.y} 
                className="stroke-emerald-900/30 stroke-[1]" 
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            ref={polygonRef}
            points={zeroPointsString} // start at center
            className="fill-emerald-500/10 stroke-emerald-400 stroke-[2] transition-colors duration-300"
          />

          {/* Interactive Points & Labels */}
          {radarData.map((d, i) => {
            const labelPt = getPoint(i, CATEGORIES.length, 1.25); // Push labels out
            const isActive = activeCategory === d.category;
            
            return (
              <g key={d.category} className="group cursor-pointer">
                <circle
                  ref={el => { if(el) pointsRef.current[i] = el; }}
                  cx={center}
                  cy={center} // start center
                  r={6}
                  className={cn(
                    "transition-all duration-300 outline-none",
                    isActive ? "fill-emerald-300 scale-150" : "fill-emerald-500 hover:scale-125"
                  )}
                  onMouseEnter={() => setActiveCategory(d.category)}
                  onClick={() => setActiveCategory(d.category)}
                  onKeyDown={(e) => handleKeyDown(e, d.category)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${d.category} details`}
                  aria-expanded={isActive}
                />
                
                <text
                  ref={el => { if(el) labelsRef.current[i] = el; }}
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className={cn(
                    "font-mono text-xs md:text-sm tracking-wider transition-colors duration-300",
                    isActive ? "fill-emerald-300 font-bold" : "fill-fg-muted group-hover:fill-emerald-400"
                  )}
                >
                  {d.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Details Side Panel */}
      <div className="w-full max-w-md min-h-[300px] flex flex-col justify-center">
        {activeData ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-end gap-4 border-b border-fg-primary/10 pb-4 mb-6">
              <h3 className="font-display text-heading-md text-emerald-400">{activeData.category}</h3>
              <span className="font-mono text-meta text-fg-muted mb-1">
                Score: {activeData.score}
              </span>
            </div>
            
            <div className="space-y-8">
              {activeData.projects.length > 0 && (
                <div>
                  <h4 className="font-mono text-meta text-fg-muted mb-3 uppercase tracking-wider">Applied In</h4>
                  <ul className="flex flex-wrap gap-2">
                    {activeData.projects.map(p => (
                      <li key={p.slug}>
                        <Link 
                          href={p.isArchive ? `/archive` : `/work/${p.slug}`}
                          className="inline-block px-3 py-1.5 border border-fg-primary/10 rounded-full font-mono text-xs text-fg-primary hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-colors"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeData.proofs.length > 0 && (
                <div>
                  <h4 className="font-mono text-meta text-fg-muted mb-3 uppercase tracking-wider">Certifications & Badges</h4>
                  <ul className="flex flex-col gap-2">
                    {activeData.proofs.map(p => (
                      <li key={p.id}>
                        <a 
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 font-mono text-sm text-fg-primary hover:text-emerald-400 transition-colors"
                        >
                          {p.name} {p.value ? <span>(<NumberTicker value={p.value} className="text-emerald-500" />{p.suffix})</span> : null}
                          <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeData.projects.length === 0 && activeData.proofs.length === 0 && (
                <p className="font-mono text-sm text-fg-muted">No explicit data tracked for this category yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-fg-muted fill-none stroke-[1.5]">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <p className="font-mono text-sm text-fg-muted max-w-[200px]">
              Hover or tap on an axis to view technical context.
            </p>
          </div>
        )}
      </div>

    </section>
  );
}
