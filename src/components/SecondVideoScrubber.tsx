import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface SecondVideoScrubberProps {
  scrollProgress: number; // Raw scrollProgress (ranges up to 3.50)
}

const DRUM_START = 1.45;
const DRUM_END = 3.50;

export default function SecondVideoScrubber({ scrollProgress }: SecondVideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const videoSrc = "/api/video-proxy?id=18NG1GuFG7wcgVMi6dbALT_dAuK0sUC5k";

  // Preload and initialize video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force reloading source
    video.load();

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (video.readyState >= 1) {
      setIsLoaded(true);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Sync scrollProgress range (DRUM_START to DRUM_END) to target video duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration || 4.2; // Fallback duration in seconds
    const range = DRUM_END - DRUM_START;
    const drumProgress = Math.max(0, Math.min(1, (scrollProgress - DRUM_START) / range));
    
    const target = drumProgress * duration;
    targetTimeRef.current = Math.max(0, Math.min(duration, target));
  }, [scrollProgress]);

  // High performance smooth scrubbing animation loop
  useEffect(() => {
    let active = true;
    const video = videoRef.current;

    const updateTime = () => {
      if (!active || !video) return;

      const duration = video.duration;
      if (duration && duration > 0) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        
        // Fluid inertia factor (at 0.15, the tracking is immediate yet silky smooth)
        const lerpFactor = 0.15;
        currentTimeRef.current += diff * lerpFactor;

        if (currentTimeRef.current < 0) currentTimeRef.current = 0;
        if (currentTimeRef.current > duration) currentTimeRef.current = duration;

        // Perform fast seeking inside video canvas stream
        if (!video.seeking && Math.abs(video.currentTime - currentTimeRef.current) > 0.01) {
          video.currentTime = currentTimeRef.current;
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateTime);

    return () => {
      active = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Handle subtle mouse parallax wiggle effect using GSAP
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.transformOrigin = "center center";

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth) - 0.5;
      const mouseY = (e.clientY / innerHeight) - 0.5;

      const targetX = -mouseX * 40;
      const targetY = -mouseY * 40;

      gsap.to(container, {
        x: targetX,
        y: targetY,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div id="second-video-bg-container" className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#11010a]">
      
      {/* 1.05 Scaled video wrapper for beautiful parallax effects */}
      <div 
        ref={containerRef}
        className="w-full h-full will-change-transform"
        style={{ scale: "1.05" }}
      >
        <video
          ref={videoRef}
          id="scroll-background-video-second"
          src={videoSrc}
          className="w-full h-full object-cover pointer-events-none"
          playsInline
          muted
          preload="auto"
        />
      </div>

      {/* Aesthetic preloading overlay */}
      {!isLoaded && (
        <div id="second-video-loader" className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-[#11010af4] transition-opacity duration-700">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pink-500/20 opacity-25 animate-ping" />
            <div className="w-10 h-10 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
          </div>
          <span className="mt-6 font-manrope font-semibold text-[11px] leading-[16px] uppercase tracking-[0.25em] text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)] text-center animate-pulse">
            LOADING DRUM STREAM...
          </span>
        </div>
      )}
    </div>
  );
}
