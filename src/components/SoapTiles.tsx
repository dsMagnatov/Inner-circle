import React, { useState, useEffect } from "react";

interface SoapTilesProps {
  scrollProgress: number; // Linked directly to custom layout scroll progress (0 to 1)
}

export default function SoapTiles({ scrollProgress }: SoapTilesProps) {
  // Simple hover state tracking to dynamically adjust adjacent tile offsets
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor window resize to calculate perfect transition scaling constraints
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Trigger visibility in the last stage of the scroll (e.g. scrollProgress > 0.75)
  const isVisible = scrollProgress > 0.75;
  
  // Calculate specific animations/offsets/opacity based on scrollProgress
  // We want a beautiful smooth transition when it enters
  const easeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.22));

  // Dynamic calculations for hover-based vertical shift to preserve gaps
  const getHoverOffset = (id: string) => {
    if (!hoveredId) return 0;
    
    const ids = ["tile-1", "tile-2", "tile-3"];
    const hoveredIndex = ids.indexOf(hoveredId);
    const currentIndex = ids.indexOf(id);

    if (currentIndex === hoveredIndex) return 0;
    
    // Shift up if current tile is above the hovered tile, shift down if below
    // On mobile, height is smaller (52px), on desktop it's (138px)
    const baseHeight = isMobile ? 52 : 138;
    const offsetAmt = baseHeight * 0.1; // scale 1.2 half difference
    return currentIndex < hoveredIndex ? -offsetAmt : offsetAmt;
  };

  // 3 identical tiles, dynamically sizing width (stretching fully on mobile, self-starting on desktop)
  const tiles = [
    {
      id: "tile-1",
      text: "Private Discord & Networking",
      className: "group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto md:self-start cursor-pointer origin-left transition-all duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1) whitespace-nowrap",
      baseXOffset: 120,
      delay: "0ms",
    },
    {
      id: "tile-2",
      text: "Weekly Market Alpha Drops",
      className: "group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto md:self-start cursor-pointer origin-left transition-all duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1) whitespace-nowrap",
      baseXOffset: 180,
      delay: "100ms",
    },
    {
      id: "tile-3",
      text: "Exclusive Web3 Tooling Access",
      className: "group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto md:self-start cursor-pointer origin-left transition-all duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1) whitespace-nowrap",
      baseXOffset: 240,
      delay: "200ms",
    },
  ];

  return (
    <div
      id="soap-tiles-sidebar-layout"
      className={`absolute left-4 right-4 md:left-[64px] top-[38%] md:top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-[10px] z-40 pointer-events-auto transition-all duration-[800ms] ease-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 md:-translate-x-12 pointer-events-none"
      }`}
    >
      {tiles.map((tile) => {
        const isHovered = hoveredId === tile.id;
        // On touch screens/mobiles disable scale zoom to avoid sticky visual behaviors
        const scale = (isHovered && !isMobile) ? 1.2 : 1.0;
        // Reduce translation distance under mobile layouts so they don't overshoot
        const responsiveOffset = isMobile ? tile.baseXOffset * 0.25 : tile.baseXOffset;
        const translateX = (easeProgress - 1) * responsiveOffset;
        const translateY = getHoverOffset(tile.id);

        return (
          <div
            key={tile.id}
            id={tile.id}
            onMouseEnter={() => setHoveredId(tile.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={tile.className}
            style={{
              transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
              opacity: easeProgress,
              filter: `blur(${(1 - easeProgress) * 12}px)`,
              willChange: "transform, opacity, filter",
              transitionDelay: hoveredId ? "0ms" : tile.delay,
            }}
          >
            {/* Center-aligned label text with custom responsive sizing */}
            <span 
              className="relative z-10 font-michroma font-medium text-[11px] sm:text-[14px] md:text-[23px] leading-[16px] sm:leading-[22px] md:leading-[34px] tracking-tight text-center select-none inline-block w-full"
              style={{ 
                letterSpacing: "-0.03em"
              }}
            >
              {tile.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

