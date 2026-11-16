import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface ScrollExitSplitTextProps {
  children: string;
  scrollProgress: number; // Linked directly to our custom layout scroll progress (0 to 1)
  containerClassName?: string;
  textClassName?: string;
  stagger?: number;
  style?: React.CSSProperties;
}

export default function ScrollExitSplitText({
  children,
  scrollProgress,
  containerClassName = "",
  textClassName = "",
  stagger = 0.03,
  style = {},
}: ScrollExitSplitTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Split lines, then words, then characters
  const lines = children.split("\n");

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const chars = containerRef.current.querySelectorAll(".char");
    if (chars.length === 0) return;

    // Create a GSAP timeline for the text exit animation
    const tl = gsap.timeline({ paused: true });

    // Initial and target properties exactly as specified in the prompt:
    // Initial: opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: "50% 0%"
    // Scrolled: opacity: 0, yPercent: 300, y: "15vh", scaleY: 1.2, scaleX: 0.9 (falling deep past browser edge)
    tl.fromTo(
      chars,
      {
        opacity: 1,
        yPercent: 0,
        y: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: "50% 0%",
      },
      {
        opacity: 0,
        yPercent: 300,
        y: "25vh",
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: stagger,
        ease: "power2.inOut",
      }
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [children, stagger]);

  // Animate the timeline.progress smoothly to match scrollProgress
  // This provides beautiful scrub inertia/zlag (equivalent to ScrollTrigger scrub: 1.5)
  useEffect(() => {
    if (timelineRef.current) {
      gsap.to(timelineRef.current, {
        progress: scrollProgress,
        duration: 0.6, // Smooth lag time
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      id="scroll-exit-split-text-root"
      className={`select-none text-center pointer-events-none ${containerClassName}`}
      style={style}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <div
            key={lineIdx}
            className="flex flex-wrap justify-center items-center py-[2px]"
          >
            {words.map((word, wordIdx) => {
              const charsInWord = Array.from(word);
              return (
                <span
                  key={wordIdx}
                  className="inline-flex mr-[0.3em] last:mr-0 select-none whitespace-nowrap"
                >
                  {charsInWord.map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="char inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                  {/* Non-breaking space is maintained */}
                  {wordIdx < words.length - 1 && (
                    <span className="select-none">&nbsp;</span>
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
