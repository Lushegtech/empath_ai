'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// --- VISUAL ASSETS ---
const TopoLines = () => (
  <div className="absolute inset-0 z-0 opacity-[0.12] text-[#6B796A] pointer-events-none overflow-hidden select-none">
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
      backgroundImage: 'radial-gradient(#10302A 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  ></div>
);

const Gyroscope = ({ speedMultiplier = 1 }: { speedMultiplier?: number }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08] select-none">
    {/* Ring 1 - Outer Slow Clockwise */}
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full border border-[#10302A] border-dashed"
      animate={{ rotate: 360 }}
      transition={{ duration: 120 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
      style={{ borderSpacing: '20px' }}
    />

    {/* Ring 2 - Middle Medium Counter-Clockwise */}
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full border border-[#10302A]/80 opacity-60"
      animate={{ rotate: -360 }}
      transition={{ duration: 80 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
    />

    {/* Ring 3 - Inner Fast Clockwise (Eccentric) */}
    <motion.div
      className="absolute w-[450px] h-[450px] rounded-full border-[0.5px] border-[#9C5B42]"
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{
        rotate: { duration: 60 / speedMultiplier, repeat: Infinity, ease: 'linear' },
        scale: { duration: 10 / speedMultiplier, repeat: Infinity, ease: 'easeInOut' },
      }}
    />

    {/* Center Axis Marker */}
    <div className="absolute w-2 h-2 rounded-full bg-[#9C5B42] opacity-50" />
  </div>
);

const Particles = () => {
  const [particles, setParticles] = useState<
    Array<{ top: string; left: string; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParticles(
        [...Array(12)].map(() => ({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 5,
        }))
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#9C5B42] opacity-20"
          style={{ top: p.top, left: p.left }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

interface BrandLayoutProps {
  children: React.ReactNode;
  currentTime?: string;
  className?: string;
  showFooter?: boolean;
  speedMultiplier?: number;
  showGyroscope?: boolean;
  showTopoLines?: boolean;
}

const BrandLayout: React.FC<BrandLayoutProps> = ({
  children,
  currentTime,
  className = '',
  showFooter = true,
  speedMultiplier = 1,
  showGyroscope = false,
  showTopoLines = true,
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
      className={`relative flex min-h-screen w-full flex-col bg-[#F1ECE2] text-[#10302A] font-sans overflow-hidden selection:bg-[#9C5B42] selection:text-white ${className}`}
    >
      <GridPattern />
      {showGyroscope && <Gyroscope speedMultiplier={speedMultiplier} />}
      <Particles />
      {showTopoLines && <TopoLines />}

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-between items-start pointer-events-none z-20 font-mono text-[10px] tracking-widest uppercase text-black/60">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-black">Interaction Style</span>
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
