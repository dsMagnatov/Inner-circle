import React, { useRef } from "react";

interface CylindricalTextDrumProps {
  scrollProgress: number; // Mapped from root scroll trigger (ranges up to 3.50)
}

interface TextSegment {
  text: string;
  highlight: boolean;
}

const LINES: (string | TextSegment[])[] = [
  [
    { text: "Welcome to the ", highlight: false },
    { text: "ultimate convergence", highlight: true }
  ],
  [
    { text: "of ", highlight: false },
    { text: "digital rebels", highlight: true },
    { text: ", ", highlight: false },
    { text: "underground creators", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "and ", highlight: false },
    { text: "top-tier product builders", highlight: true },
    { text: " who", highlight: false }
  ],
  [
    { text: "refuse to follow ", highlight: false },
    { text: "guidelines", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "This is where ", highlight: false },
    { text: "high-end design principles", highlight: true }
  ],
  [
    { text: "meet ", highlight: false },
    { text: "pure technical execution", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "without the ", highlight: false },
    { text: "corporate bureaucracy", highlight: true },
    { text: " and", highlight: false }
  ],
  [
    { text: "meaningless ", highlight: false },
    { text: "standard aesthetics", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "We ", highlight: false },
    { text: "gather in the shadows", highlight: true },
    { text: " to build", highlight: false }
  ],
  [
    { text: "the ", highlight: false },
    { text: "next generation", highlight: true },
    { text: " of ", highlight: false },
    { text: "scalable interfaces", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "automated workflows", highlight: true },
    { text: ", and ", highlight: false },
    { text: "decentralized assets", highlight: true }
  ],
  [
    { text: "that move the ", highlight: false },
    { text: "cultural needle forward", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "Experience ", highlight: false },
    { text: "zero-bullshit networking", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "weekly ", highlight: false },
    { text: "alpha allocations", highlight: true },
    { text: ", and ", highlight: false },
    { text: "unreleased", highlight: true }
  ],
  [
    { text: "toolkits", highlight: true },
    { text: " to shape the ", highlight: false },
    { text: "internet's landscape", highlight: true },
    { text: ".", highlight: false }
  ],
  "",
  [
    { text: "This is ", highlight: false },
    { text: "not another social club", highlight: true }
  ],
  [
    { text: "for casual enthusiasts or ", highlight: false },
    { text: "template consumers", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "This is a ", highlight: false },
    { text: "highly selective environment", highlight: true }
  ],
  [
    { text: "engineered for ", highlight: false },
    { text: "hyper-productive creators", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "UI/UX visionaries", highlight: true },
    { text: ", and ", highlight: false },
    { text: "AI prompt architects", highlight: true }
  ],
  [
    { text: "who operate at the ", highlight: false },
    { text: "absolute limits", highlight: true }
  ],
  [
    { text: "of ", highlight: false },
    { text: "digital product creation", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "Our ", highlight: false },
    { text: "framework is simple", highlight: true },
    { text: ":", highlight: false }
  ],
  [
    { text: "eliminate intermediate noise", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "automate the execution layer", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "and ", highlight: false },
    { text: "deploy elite digital products", highlight: true }
  ],
  [
    { text: "while others are still ", highlight: false },
    { text: "scheduling meetings", highlight: true },
    { text: ".", highlight: false }
  ],
  [
    { text: "We loop through ", highlight: false },
    { text: "complex design systems", highlight: true },
    { text: ",", highlight: false }
  ],
  [
    { text: "break conventional grids", highlight: true },
    { text: ", and", highlight: false }
  ],
  [
    { text: "execute fluid interactions", highlight: true },
    { text: " that", highlight: false }
  ],
  [
    { text: "redefine digital environments", highlight: true },
    { text: ".", highlight: false }
  ]
];

export default function CylindricalTextDrum({ scrollProgress }: CylindricalTextDrumProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Second screen active scroll starts at 1.45 and goes up to 3.50
  // Map this 2.05 range to scroll index across all text lines.
  const drumStart = 1.45;
  const drumEnd = 3.50;
  const range = drumEnd - drumStart;
  
  const currentScrollProgress = Math.max(0, Math.min(1, (scrollProgress - drumStart) / range));
  
  // Calculate index position of scroll center
  const targetIndex = currentScrollProgress * (LINES.length - 1);
  const R = 380; // Curved drum cylinder radius
  const lineHeight = 32; // Tight, perfect spacing in pixels between adjacent lines in center space

  return (
    <div 
      className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[60%] z-30 flex flex-col items-start justify-center pointer-events-none select-none text-left pl-6 sm:pl-12 md:pl-20 py-16"
      style={{
        perspective: "1000px",
        perspectiveOrigin: "25% 50%", // Focus perspective directly on the left-side text column
      }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-[85vh] flex flex-col justify-center items-start overflow-visible"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {LINES.map((line, idx) => {
          const indexDiff = idx - targetIndex;
          
          // Compute Y offset precisely with direct line-height control
          const translateY = indexDiff * lineHeight;
          
          // Map to angular projection on the convex cylinder
          const angleRad = translateY / R;
          const angleDeg = (angleRad * 180) / Math.PI;

          // Symmetrical decay for alpha values:
          // Fully 1.0 in the center, extended boundaries to show 2 more lines on top and 2 more lines on bottom smoothly
          const cosVal = Math.cos(angleRad);
          const targetOpacity = Math.max(0, (cosVal - 0.20) / (1 - 0.20));
          const isVisible = targetOpacity > 0.001;

          // Bulge coordinates:
          // Z value pushes the text forward in the center, and curves it back at top/bottom
          const translateZ = Math.cos(angleRad) * R - R;

          // Bulging scale: fully 1.0 at center, shrinking backwards at margins
          const baseScale = 0.78 + (Math.cos(angleRad) * 0.22);
          
          // Static depth-based blur: text gets progressively blurred as it rotates away from the center
          // This creates a premium defocus effect without any dynamic performance impact.
          // Limit max blur so the boundary edges remain elegant and fully anti-aliased.
          const depthBlur = Math.min(8.0, Math.max(0, (Math.abs(indexDiff) - 1.5) * 0.75));

          if (line === "") {
            // Render an empty step in the drum to maintain perfectly smooth curvature
            return (
              <div
                key={`empty-${idx}`}
                className="absolute w-full flex justify-start items-center"
                style={{
                  display: isVisible ? "flex" : "none",
                  opacity: targetOpacity * 0.3,
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) scale(${baseScale})`,
                  willChange: "transform, opacity",
                  height: `${lineHeight}px`,
                }}
              />
            );
          }

          return (
            <div
              key={`line-${idx}`}
              className="absolute w-full flex justify-start items-center pointer-events-none select-none"
              style={{
                display: isVisible ? "flex" : "none",
                opacity: targetOpacity,
                transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angleDeg * 0.8}deg) scale(${baseScale})`,
                filter: depthBlur > 0.1 ? `blur(${depthBlur.toFixed(2)}px)` : "none",
                willChange: "transform, opacity",
                transformOrigin: "left center",
              }}
            >
              <p 
                className="font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] max-w-full tracking-tight text-left select-none whitespace-nowrap"
                style={{
                  letterSpacing: "-0.035em",
                }}
              >
                {Array.isArray(line) ? (
                  line.map((part, pIdx) => (
                    <span 
                      key={pIdx} 
                      className={part.highlight ? "text-white font-bold opacity-100" : "text-white/60"}
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  line
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
