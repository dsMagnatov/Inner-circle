import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  gap?: string | number;
  speed?: number; // Duration in seconds for a complete loop
  fade?: boolean;
}

export function Marquee({
  children,
  gap = "80px",
  speed = 25,
  fade = true,
}: MarqueeProps) {
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <div
      className="marquee-container w-full select-none"
      style={{
        maskImage: fade
          ? "linear-gradient(to right, transparent, white 15%, white 85%, transparent)"
          : "none",
        WebkitMaskImage: fade
          ? "linear-gradient(to right, transparent, white 15%, white 85%, transparent)"
          : "none",
      }}
    >
      <div
        className="marquee-track flex"
        style={{
          animationDuration: `${speed}s`,
          gap: gapValue,
        }}
      >
        {/* Track 1 */}
        <div className="flex shrink-0 items-center justify-around" style={{ gap: gapValue }}>
          {children}
        </div>
        {/* Track 2 (Carbon copy for seamless wrapping) */}
        <div className="flex shrink-0 items-center justify-around" style={{ gap: gapValue }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
