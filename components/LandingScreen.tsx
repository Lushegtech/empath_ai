'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 1. Load Fonts
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

  // 2. Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Modal Animation Logic - Use a ref to track if we should animate
  useEffect(() => {
    // Only start animation timer when modal opens
    if (!showHowItWorks) return;

    // The modal just opened, delay animation start
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(timer);
      // Reset on cleanup so next open animates fresh
      setIsLoaded(false);
    };
  }, [showHowItWorks]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F2F0EB] text-[#1A1A1A] font-sans overflow-hidden selection:bg-[#E05D44] selection:text-white">
      <GridPattern />
      <TopoLines />

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-between items-start pointer-events-none z-20 font-mono text-[10px] tracking-widest uppercase text-black/60">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-black">Interaction Style</span>
          <span>Status: Ready</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>{currentTime}</span>
          <span>Visitor: You</span>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        {/* Headline */}
        <div className="text-center max-w-4xl mb-12 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 sm:w-12 bg-[#E05D44]"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#E05D44]">
              Free Assessment
            </span>
            <span className="h-px w-8 sm:w-12 bg-[#E05D44]"></span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light leading-[0.9] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Map the <span className="italic text-[#E05D44]">terrain</span> <br />
            of your mind.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm sm:text-base font-mono text-black/60 max-w-md mx-auto leading-relaxed"
          >
            Understand why you click with some people and clash with others. It only takes 2
            minutes.
          </motion.p>
        </div>

        {/* The Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative group w-full max-w-md"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E05D44] to-transparent opacity-0 group-hover:opacity-100 animate-scan transition-opacity duration-300"></div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between text-xs font-mono text-black/40 uppercase tracking-wider">
                <span>Your Assessment</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${hovered ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}
                  ></span>
                  {hovered ? 'Ready to start' : 'Waiting'}
                </span>
              </div>

              <div className="h-14 w-full bg-[#F2F0EB]/80 rounded border border-black/5 flex items-center px-4 justify-between group-hover:border-[#E05D44]/30 transition-colors">
                <span className="font-serif italic text-xl sm:text-2xl text-black/80">
                  Start the quiz...
                </span>
                <span className="material-symbols-outlined text-black/20 group-hover:text-[#E05D44] transition-colors">
                  fingerprint
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-black/5 border border-black/5">
                  <span className="block text-[10px] font-mono uppercase text-black/40 mb-1">
                    Time
                  </span>
                  <span className="font-mono text-sm font-bold text-[#1A1A1A]">2 Minutes</span>
                </div>
                <div className="p-3 rounded bg-black/5 border border-black/5">
                  <span className="block text-[10px] font-mono uppercase text-black/40 mb-1">
                    Cost
                  </span>
                  <span className="font-mono text-sm font-bold text-[#1A1A1A]">Free</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onStart}
                  className="relative w-full h-12 bg-[#1A1A1A] text-[#F2F0EB] rounded overflow-hidden flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <span className="font-mono font-bold tracking-widest uppercase z-10 text-xs sm:text-sm">
                    Discover My Style
                  </span>
                  <div className="absolute inset-0 bg-[#E05D44] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ease-out"></div>
                </button>

                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="text-xs font-mono uppercase tracking-widest text-black/50 hover:text-[#E05D44] transition-colors py-2"
                >
                  How does it work?
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 flex justify-center text-[10px] font-mono text-black/30 tracking-widest uppercase">
        <p>Made with love - Miniapp Team</p>
      </footer>

      {/* --- MODAL (FIXED ALIGNMENT) --- */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-sm p-4"
          >
            <div className="bg-[#F2F0EB] p-8 sm:p-12 rounded-lg max-w-md w-full shadow-2xl relative overflow-hidden border border-[#E05D44]/20">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="absolute top-4 right-4 text-black/40 hover:text-[#E05D44] transition-colors z-10 font-mono text-xl"
              >
                ✕
              </button>

              <h2
                className="text-3xl font-serif text-[#1A1A1A] mb-2 text-center"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                How it works
              </h2>
              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-[#E05D44] mb-10">
                Simple & Quick
              </p>

              {/* FIX: Parent has px-2. Circle is w-8. Line is left-6. 
                  Calculation: px-2 (8px) + half-circle (16px) = 24px. 
                  Line position: left-6 (24px). Perfect Center. 
              */}
              <div className="relative px-2 mb-10">
                <div className="absolute left-6 top-2 bottom-4 w-px -translate-x-1/2 bg-black/10" />
                <div
                  className={`absolute left-6 top-2 w-px -translate-x-1/2 bg-[#E05D44] transition-all duration-[1500ms] ease-out ${isLoaded ? 'h-[85%]' : 'h-0'}`}
                />

                <div className="space-y-8 relative">
                  {[
                    {
                      id: '1',
                      title: 'Answer Questions',
                      desc: '12 simple questions about how you interact.',
                    },
                    {
                      id: '2',
                      title: 'We Analyze It',
                      desc: 'Our AI looks for patterns in your choices.',
                    },
                    { id: '3', title: 'Get Results', desc: 'See your style and how to use it.' },
                  ].map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex gap-6 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${idx * 300}ms` }}
                    >
                      {/* Restored to w-8 for alignment and readability */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center border transition-colors duration-500 bg-[#F2F0EB] ${isLoaded ? 'border-[#E05D44] text-[#E05D44]' : 'border-black/20 text-black/30'}`}
                      >
                        <span className="font-mono text-xs font-bold">{step.id}</span>
                      </div>

                      <div>
                        <h4 className="font-serif text-lg text-[#1A1A1A] leading-none mb-1">
                          {step.title}
                        </h4>
                        <p className="font-mono text-[10px] text-black/60 uppercase tracking-wide">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowHowItWorks(false);
                  onStart();
                }}
                className={`w-full h-12 bg-[#1A1A1A] text-[#F2F0EB] font-mono text-xs uppercase tracking-widest transition-all duration-700 hover:bg-[#E05D44] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '1000ms' }}
              >
                Let&apos;s Start
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingScreen;
