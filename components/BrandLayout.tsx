'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- VISUAL ASSETS ---
const TopoLines = () => (
  <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none overflow-hidden select-none">
    <svg
      className="w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        d="M-58 368C126 314 318 102 546 162C774 222 754 518 1006 518C1258 518 1358 310 1490 310"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
        d="M-58 418C146 384 348 202 566 262C784 322 734 618 1026 598C1318 578 1388 380 1490 410"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="10%"
        cy="20%"
        r="80"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        className="opacity-40"
      />
      <circle
        cx="90%"
        cy="80%"
        r="120"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        className="opacity-40"
      />
    </svg>
  </div>
);

const GridPattern = () => (
  <div
    className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  ></div>
);

interface BrandLayoutProps {
  children: React.ReactNode;
  currentTime?: string;
  className?: string;
  showFooter?: boolean;
}

const BrandLayout: React.FC<BrandLayoutProps> = ({
  children,
  currentTime,
  className = '',
  showFooter = true,
}) => {
  // Load Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Space+Mono:ital,wght@0,400;0,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col bg-[#F2F0EB] text-[#1A1A1A] font-sans overflow-hidden selection:bg-[#E05D44] selection:text-white ${className}`}
    >
      <GridPattern />
      <TopoLines />

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-between items-start pointer-events-none z-20 font-mono text-[10px] tracking-widest uppercase text-black/60">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-black">Interaction Style</span>
          <span>Status: Active</span>
        </div>
        {currentTime && (
          <div className="flex flex-col gap-1 text-right">
            <span>{currentTime}</span>
            <span>Visitor: You</span>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-start md:justify-center pt-28 pb-12 px-4 sm:p-6 w-full">
        {children}
      </main>

      {showFooter && (
        <footer className="relative z-10 p-6 flex justify-center text-[10px] font-mono text-black/30 tracking-widest uppercase">
          <p>Made with love - Miniapp Team</p>
        </footer>
      )}
    </div>
  );
};

export default BrandLayout;
