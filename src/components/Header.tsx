import React, { useState } from "react";
import Logo from "./Logo";
import { NAVIGATION_ITEMS } from "../data";
import { NavigationItem } from "../types";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  activeSectionId: string;
  onNavigate: (item: NavigationItem) => void;
}

export default function Header({ activeSectionId, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        id="app-header"
        className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 md:top-[64px] md:left-[64px] md:right-[64px] flex items-center justify-between z-40 select-none pointer-events-auto"
      >
        {/* Left logo group */}
        <div 
          id="header-logo-group" 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => {
            onNavigate({ id: "hero", label: "Hero", scrollRatio: 0 });
            setIsMenuOpen(false);
          }}
        >
          <Logo />
          
          {/* Multiline description on the left - hidden on smaller viewports to prevent overflow */}
          <div 
            id="header-subtitle" 
            className="hidden sm:flex flex-col font-manrope font-normal tracking-wide text-[12px] leading-[16px] text-white"
          >
            <span>Full Workflow Automation.</span>
            <span>We Manage Everything. You</span>
            <span>Unwind.</span>
          </div>
        </div>

        {/* Desktop navigation menu */}
        <nav id="header-nav-container" className="hidden md:flex items-center gap-4">
          {NAVIGATION_ITEMS.map((item) => {
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item)}
                className="relative font-manrope font-medium text-[12px] leading-[16px] tracking-wider cursor-pointer text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Burger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/15 focus:outline-none transition-all active:scale-95 z-50 pointer-events-auto"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#11010a]/98 backdrop-blur-xl z-30 md:hidden flex flex-col justify-center items-center gap-6 px-12 transition-all duration-300">
          <div className="flex flex-col gap-6 text-center w-full">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeSectionId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item);
                    setIsMenuOpen(false);
                  }}
                  className={`font-michroma text-[16px] uppercase tracking-widest py-4 px-6 border-b border-white/5 transition-all duration-300 ${
                    isActive ? "text-[#FF005E] font-semibold" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

