import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface VideoScrubberProps {
  scrollProgress: number; // 0 to 1 value representing overall scroll progress
  videoUrl?: string; // Kept for interface compatibility with parent
}

export default function VideoScrubber({ scrollProgress }: VideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const videoSrc = "/api/video-proxy?id=1pgE86jw-ynzjezcmdAA6tmeLXgllF4h7";

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

  // Sync scrollProgress to target video current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration || 4.2; // Fallback duration in seconds
    const target = scrollProgress * duration;
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
    <div id="video-bg-container" className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#FF005E]">
      
      {/* 1.05 Scaled video wrapper for beautiful parallax effects */}
      <div 
        ref={containerRef}
        className="w-full h-full will-change-transform"
        style={{ scale: "1.05" }}
      >
        <video
          ref={videoRef}
          id="scroll-background-video"
          src={videoSrc}
          className="w-full h-full object-cover pointer-events-none"
          playsInline
          muted
          preload="auto"
        />
      </div>

      {/* Aesthetic preloading overlay */}
      {!isLoaded && (
        <div id="video-loader" className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-[#FF005Ef4] transition-opacity duration-700">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-20 animate-ping" />
            <div className="w-10 h-10 rounded-full border-4 border-[#ea1f63]/20 border-t-[#ea1f63] animate-spin" />
          </div>
          <span className="mt-6 font-manrope font-semibold text-[12px] leading-[16px] uppercase tracking-[0.25em] text-pink-500 drop-shadow-[0_0_8px_rgba(234,31,99,0.4)] text-center">
            LOADING SCROLL STREAM...
          </span>
        </div>
      )}
    </div>
  );
}
