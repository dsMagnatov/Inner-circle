/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import VideoScrubber from "./components/VideoScrubber";
import SecondVideoScrubber from "./components/SecondVideoScrubber";
import ScrollExitSplitText from "./components/ScrollExitSplitText";
import SoapTiles from "./components/SoapTiles";
import CylindricalTextDrum from "./components/CylindricalTextDrum";
import { Marquee } from "./components/Marquee";
import {
  GithubWordmark,
  GoogleWordmark,
} from "./components/Logos";
import { NavigationItem } from "./types";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [lerpedScrollProgress, setLerpedScrollProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>("hero");
  const animationRef = useRef<number | null>(null);

  const scrollProgressRef = useRef<number>(0);

  // Sync latest scrollProgress to ref for stable background tick thread
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Smooth out scroll progress transitions with elite micro-momentum (inertia)
  useEffect(() => {
    let active = true;
    let currentLerp = 0;

    const tick = () => {
      if (!active) return;
      
      const target = scrollProgressRef.current;
      const diff = target - currentLerp;
      // High-end friction-based lerp constant for cinematic ease on transitions (0.08 feels smooth and immediate)
      const lerpFactor = 0.08;
      
      if (Math.abs(diff) > 0.0001) {
        currentLerp += diff * lerpFactor;
        setLerpedScrollProgress(currentLerp);
      } else {
        currentLerp = target;
        setLerpedScrollProgress(target);
      }
      
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      active = false;
    };
  }, []); // Run precisely once on mount to establish a stable cinematic thread

  // Separate function to update section IDs based on progress ratio (supports 1.50 range)
  const updateActiveSection = (progress: number) => {
    if (progress < 0.18) {
      setActiveSectionId("hero");
    } else if (progress >= 0.18 && progress < 0.45) {
      setActiveSectionId("projects");
    } else if (progress >= 0.45 && progress < 0.68) {
      setActiveSectionId("expertise");
    } else if (progress >= 0.68 && progress < 1.15) {
      setActiveSectionId("about");
    } else {
      setActiveSectionId("contact");
    }
  };

  // Custom gesture controller for desktop wheel and mobile touch gestures
  useEffect(() => {
    // Disable any native document scrolling behaviors
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // If we are currently executing programmatic navigation animation, stop it
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const delta = e.deltaY;
      setScrollProgress((prev) => {
        // High-precision custom scrub scale factor (tune for perfect experience)
        const scaleFactor = 0.0006;
        const next = prev + delta * scaleFactor;
        const clamped = Math.max(0, Math.min(3.5, next));
        updateActiveSection(clamped);
        return clamped;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        const currentTouchY = e.touches[0].clientY;
        const deltaTouchY = lastTouchY - currentTouchY; // Swiping up triggers forward video scrub
        lastTouchY = currentTouchY;

        setScrollProgress((prev) => {
          const scaleFactor = 0.0015;
          const next = prev + deltaTouchY * scaleFactor;
          const clamped = Math.max(0, Math.min(3.5, next));
          updateActiveSection(clamped);
          return clamped;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Programmatic custom scroll interpolation when navigation tabs are clicked
  const handleNavigateToSection = (item: NavigationItem | { id: string; scrollRatio: number }) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startProgress = scrollProgress;
    const targetProgress = item.scrollRatio;
    const duration = 1200; // 1.2s fluid transition timeline
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Smooth custom easeInOutCubic function
      const ease = progressRatio < 0.5
        ? 4 * progressRatio * progressRatio * progressRatio
        : 1 - Math.pow(-2 * progressRatio + 2, 3) / 2;

      const currentProgress = startProgress + (targetProgress - startProgress) * ease;
      setScrollProgress(currentProgress);
      updateActiveSection(currentProgress);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Second screen activation ratio between 1.15 and 1.65 (slower, more luxurious scroll travel)
  const secondScreenProgress = Math.max(0, Math.min(1, (lerpedScrollProgress - 1.15) / 0.50));

  // Cubic ease-out calculation for panel slide transition
  const easedRisingProgress = 1 - Math.pow(1 - secondScreenProgress, 3);

  // Mathematically smooth gradual blur from 0 to 64px (sine eased transition)
  const smoothBlurAmount = Math.sin(secondScreenProgress * Math.PI / 2) * 64;

  return (
    <main id="app-viewport-root" className="relative w-screen h-screen overflow-hidden bg-[#FF005E] text-white">
      
      {/* Sticky screen content viewport wrapper */}
      <div id="sticky-perspective-container" className="relative w-full h-full overflow-hidden">
        
        {/* FIRST SCREEN CONTENT LAYER: automatically blurs as the second screen rises */}
        <div
          id="first-screen-blur-layer"
          className="absolute inset-0 w-full h-full z-10 transition-transform duration-[100ms] ease-out animate-none"
          style={{
            filter: secondScreenProgress > 0 ? `blur(${smoothBlurAmount}px)` : "none",
          }}
        >
          {/* Background video layer responsive scrubbing (clamped exactly to 0-1 range) */}
          <VideoScrubber
            scrollProgress={Math.min(1.0, lerpedScrollProgress)}
            videoUrl="https://res.cloudinary.com/daklr2whx/video/upload/v1780415696/202606021731_ry2ado.mp4"
          />

          {/* ================== DISPLAY TITLE: INNER CIRCLE ================== */}
          {/* Placed exactly 40 pixels from the bottom, stretching to exactly 98% of the browser width. */}
          <div
            id="hero-massive-title-container"
            className="absolute bottom-[40px] left-[1%] right-[1%] w-[98%] pointer-events-none z-20 select-none flex justify-center items-center"
          >
            <ScrollExitSplitText
              scrollProgress={Math.min(1.0, lerpedScrollProgress)}
              containerClassName="w-full text-[10.4vw] leading-none font-michroma font-normal uppercase text-white whitespace-nowrap text-center transition-all duration-300 will-change-transform"
              style={{
                letterSpacing: "-0.07em",
              }}
            >
              INNER CIRCLE
            </ScrollExitSplitText>
          </div>

          {/* Dynamic high rounded soap-bubble interactive cards appearing at the end of the scroll */}
          <SoapTiles scrollProgress={lerpedScrollProgress} />
        </div>

        {/* Global Floating Header (keeps sharp overlay, z-50 for constant readability) */}
        <Header 
          activeSectionId={activeSectionId} 
          onNavigate={handleNavigateToSection} 
        />

        {/* SECOND SCREEN VIEWPORT LAYER WITH EMBEDDED AUTOPLAYING VIDEO BACKDROP */}
        <div
          id="second-screen-rising-panel"
          className="absolute bottom-0 left-0 w-full h-full bg-[#11010a] rounded-t-[48px] overflow-hidden z-40"
          style={{
            transform: `translateY(${(1 - easedRisingProgress) * 100}%)`,
            visibility: secondScreenProgress > 0 ? "visible" : "hidden",
            willChange: "transform",
          }}
        >
          {/* iOS Grab-Handle/Shutter/Pill centered at the top of the sheet */}
          <div 
            id="ios-drag-handle-pill" 
            className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-white rounded-full z-50 pointer-events-none" 
          />

          {/* High-performance frame-by-frame canvas-based Scrubber, fully synchronized with the rotation of the cylindrical text drum */}
          <SecondVideoScrubber scrollProgress={lerpedScrollProgress} />

          {/* Cylindrical scrolling text drum overlay */}
          <CylindricalTextDrum scrollProgress={lerpedScrollProgress} />

          {/* Logo Marquee ribbon aligned matching the text drum layout */}
          <div
            id="drum-partners-marquee-overlay"
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 w-full sm:w-[65%] md:w-[60%] pl-6 sm:pl-12 md:pl-20 pr-6 sm:pr-12 md:pr-16 z-50 pointer-events-auto"
          >
            <div className="w-full border-t border-white/[0.08] pt-6">
              <Marquee gap="80px" speed={25} fade={true}>
                <GoogleWordmark size={100} />
                <GithubWordmark size={100} />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/voiceflow-logo-svg-150px.svg"
                  alt="Voiceflow"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/zendesk-logo-svg-150px.svg"
                  alt="Zendesk"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/pendo-logo-svg-150px.svg"
                  alt="Pendo"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/glide-logo-svg-150px.svg"
                  alt="Glide"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/canva-logo-svg-150px.svg"
                  alt="Canva"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </Marquee>
            </div>
          </div>


        </div>

      </div>

    </main>
  );
}
