import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BrandLayout from './BrandLayout';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live Clock
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

  return (
    <BrandLayout currentTime={currentTime} showFooter={true}>
      {/* --- MAIN CONTENT --- */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 min-h-[60vh]">
        {/* Headline */}
        <div className="text-center max-w-4xl mb-12 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 sm:w-12 bg-[#9C5B42]"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#9C5B42]">
              know your nature
            </span>
            <span className="h-px w-8 sm:w-12 bg-[#9C5B42]"></span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light leading-[0.9] tracking-tight text-[#10302A]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Map the <span className="italic text-[#9C5B42]">terrain</span> <br />
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
          <div className="relative overflow-hidden rounded-xl">
            {/* Double Etched Border Container */}
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 z-20 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 z-20 pointer-events-none"></div>

            {/* Vellum Material */}
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(16,48,42,0.15)]">
              {/* Aurora Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-[#F1ECE2]/20 to-[#9C5B42]/10 opacity-70 pointer-events-none animate-pulse duration-[5000ms]"></div>

              <div className="p-8 sm:p-10 flex flex-col gap-8 relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between text-[10px] font-mono font-medium text-[#10302A]/60 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5 h-2.5 items-end opacity-50">
                      <motion.div
                        animate={{ height: [2, 10, 2] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="w-0.5 bg-[#10302A]"
                      />
                      <motion.div
                        animate={{ height: [6, 3, 6] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="w-0.5 bg-[#10302A]"
                      />
                      <motion.div
                        animate={{ height: [4, 8, 4] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        className="w-0.5 bg-[#10302A]"
                      />
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <span
                      className={`block w-1.5 h-1.5 rounded-full ${hovered ? 'bg-[#9C5B42] animate-pulse' : 'bg-black/20'}`}
                    ></span>
                    {hovered ? 'Ready' : 'Standby'}
                  </span>
                </div>

                {/* Main Action Block */}
                <div className="relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#10302A]/10"></div>
                  <h3
                    className="font-serif italic text-3xl sm:text-4xl text-[#10302A] leading-tight"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Ready to begin?
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Custom Consent Checkbox */}
                  <div
                    className="flex items-center justify-center gap-3 cursor-pointer group/checkbox"
                    onClick={() => setHasConsented(!hasConsented)}
                  >
                    <div
                      className={`w-4 h-4 border transition-colors duration-300 flex items-center justify-center ${hasConsented ? 'border-[#9C5B42] bg-[#9C5B42]' : 'border-[#10302A]/30 group-hover/checkbox:border-[#9C5B42]'}`}
                    >
                      {hasConsented && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-[#F1ECE2]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ${hasConsented ? 'text-[#10302A]' : 'text-[#10302A]/50 group-hover/checkbox:text-[#9C5B42]'}`}
                    >
                      I consent to the processing of my responses for analysis
                    </span>
                  </div>

                  <button
                    onClick={onStart}
                    disabled={!hasConsented}
                    className={`relative w-full h-14 rounded overflow-hidden flex items-center justify-center gap-3 transition-all duration-300 ${hasConsented ? 'bg-[#10302A] text-[#F1ECE2] shadow-lg shadow-[#10302A]/10 hover:shadow-xl hover:shadow-[#10302A]/20 active:scale-[0.99]' : 'bg-[#10302A]/5 border border-[#10302A]/10 text-[#10302A]/40 cursor-not-allowed'}`}
                  >
                    <span className="font-mono font-bold tracking-[0.2em] uppercase z-10 text-xs">
                      Start Quiz
                    </span>
                    {/* Button Hover Effect (Only active when consented) */}
                    {hasConsented && (
                      <div className="absolute inset-0 bg-[#9C5B42] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </BrandLayout>
  );
};

export default LandingScreen;
