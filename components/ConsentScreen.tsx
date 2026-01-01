'use client';

import React, { useState, useEffect } from 'react';
import BrandLayout from './BrandLayout';
import { motion } from 'framer-motion';

interface ConsentScreenProps {
  onConsent: () => void;
}

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

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
    <BrandLayout currentTime={currentTime}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg"
      >
        <div className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E05D44] to-transparent opacity-50"></div>

          <div className="p-8 sm:p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h1
                className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Before we begin
              </h1>
              <p className="font-mono text-xs sm:text-sm text-black/60 uppercase tracking-wide">
                Personality Insights
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs sm:text-sm text-black/70 leading-relaxed text-justify">
              <p>
                This test is a tool designed for self-reflection and personal insight using advanced
                AI analysis. It can help you understand your preferences and tendencies.
              </p>
              <p>
                Please note that this is not a scientific or diagnostic tool. The results are
                intended for personal exploration and should not be considered a professional
                psychological evaluation.
              </p>
            </div>

            <div className="pt-6 border-t border-black/5">
              <div
                className="flex items-center gap-4 group cursor-pointer select-none"
                onClick={() => setIsChecked(!isChecked)}
              >
                <div
                  className={`relative flex items-center justify-center w-5 h-5 border transition-all duration-300 ${isChecked ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'bg-transparent border-black/30 group-hover:border-[#E05D44]'}`}
                >
                  {isChecked && (
                    <span className="material-symbols-outlined text-[#F2F0EB] text-sm font-bold">
                      check
                    </span>
                  )}
                </div>
                <label className="font-mono text-xs uppercase tracking-wide text-black/80 cursor-pointer group-hover:text-black transition-colors">
                  I understand and want to continue.
                </label>
              </div>

              <div className="mt-8 relative group/btn">
                <button
                  onClick={onConsent}
                  disabled={!isChecked}
                  className={`relative w-full h-12 bg-[#1A1A1A] text-[#F2F0EB] rounded overflow-hidden flex items-center justify-center gap-3 transition-all duration-500 ${!isChecked ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-lg'}`}
                >
                  <span className="font-mono font-bold tracking-widest uppercase z-10 text-xs sm:text-sm">
                    Begin Questions
                  </span>
                  {isChecked && (
                    <div className="absolute inset-0 bg-[#E05D44] transform translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0 ease-out"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default ConsentScreen;
