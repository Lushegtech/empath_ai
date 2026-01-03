'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import BrandLayout from './BrandLayout';
import { motion } from 'framer-motion';

interface SummaryScreenProps {
  result: AnalysisResult;
  onViewDetails: () => void;
  onRetake: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ result, onViewDetails, onRetake }) => {
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl flex flex-col items-center gap-10"
      >
        {/* Header */}
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9C5B42] mb-2 block">
            Analysis Complete
          </span>
          <h1
            className="text-4xl sm:text-6xl font-serif text-[#10302A]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Your personality snapshot
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MAIN CARD - CARTOGRAPHIC REVEAL */}
          <div className="md:col-span-2 relative group">
            {/* Animated SVG Borders */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
              <motion.rect
                x="0.5" y="0.5"
                width="calc(100% - 1px)" height="calc(100% - 1px)"
                rx="12"
                fill="none"
                stroke="#10302A"
                strokeWidth="1"
                strokeOpacity="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.rect
                x="3.5" y="3.5"
                width="calc(100% - 7px)" height="calc(100% - 7px)"
                rx="10"
                fill="none"
                stroke="#10302A"
                strokeWidth="1"
                strokeOpacity="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
              />
            </svg>

            {/* Vellum Material - Fades In */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
              className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm rounded-xl overflow-hidden p-8 sm:p-10 flex flex-col items-center text-center gap-6 transition-shadow duration-500 hover:shadow-[0_30px_60px_-15px_rgba(16,48,42,0.15)]"
            >
              {/* Aurora Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-[#F1ECE2]/20 to-[#9C5B42]/10 opacity-70 pointer-events-none animate-pulse duration-[5000ms]"></div>

              <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 1.8, type: "spring" }}
                  className="w-20 h-20 rounded-full border border-[#10302A]/10 flex items-center justify-center bg-[#F1ECE2] shadow-inner"
                >
                  <span className="material-symbols-outlined text-4xl text-[#9C5B42]">psychology</span>
                </motion.div>
                <div className="transform transition-all">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.1 }}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10302A]/40 mb-3"
                  >
                    Archetype
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.3 }}
                    className="text-4xl sm:text-5xl font-serif text-[#10302A] mb-4"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {result.personalityType}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.5 }}
                    className="font-mono text-sm text-[#10302A]/60 max-w-lg mx-auto leading-relaxed"
                  >
                    {result.shortDescription}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* TRAITS - VELLUM STYLE (Staggered Fade) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.8 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 z-20 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 z-20 pointer-events-none"></div>
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm rounded-xl p-8 flex flex-col gap-6 h-full">
              <h3
                className="font-serif text-xl text-[#10302A]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Key Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keyTraits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#10302A] text-[#F1ECE2] font-mono text-[10px] uppercase tracking-wider rounded-sm border border-[#10302A]"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* DIMENSIONS - VELLUM STYLE (Staggered Fade) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.0 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 z-20 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 z-20 pointer-events-none"></div>
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm rounded-xl p-8 flex flex-col gap-6 h-full">
              <h3
                className="font-serif text-xl text-[#10302A]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Dimensions
              </h3>
              <div className="space-y-4">
                {result.dimensions.map((dim, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#10302A]/60">
                      <span>{dim.name}</span>
                      <span>{dim.score}%</span>
                    </div>
                    <div className="h-1 w-full bg-[#10302A]/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${dim.score}%` }}
                        transition={{ duration: 1, delay: 3.2 + idx * 0.1 }}
                        className="h-full bg-[#9C5B42]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={onViewDetails}
            className="group relative flex-1 h-14 bg-[#10302A] text-[#F1ECE2] rounded overflow-hidden flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-lg shadow-[#10302A]/10"
          >
            <span className="font-mono font-bold tracking-[0.2em] uppercase z-10 text-xs text-center">
              View Breakdown
            </span>
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-[#9C5B42] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0"></div>
          </button>

          <button
            onClick={onRetake}
            className="group relative flex-1 h-14 bg-transparent text-[#10302A] rounded overflow-hidden flex items-center justify-center gap-3 transition-all active:scale-[0.99] border border-[#10302A]/20 hover:border-[#10302A]/40"
          >
            <span className="font-mono font-bold tracking-[0.2em] uppercase z-10 text-xs text-center group-hover:text-[#9C5B42] transition-colors">
              Retake Test
            </span>
          </button>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default SummaryScreen;
