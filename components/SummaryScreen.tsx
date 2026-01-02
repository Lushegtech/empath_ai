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
          {/* MAIN CARD */}
          <div className="md:col-span-2 relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm p-8 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full border border-[#9C5B42]/30 flex items-center justify-center bg-[#F1ECE2]">
              <span className="material-symbols-outlined text-4xl text-[#9C5B42]">psychology</span>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                Archetype
              </p>
              <h2
                className="text-3xl sm:text-4xl font-serif text-[#10302A] mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {result.personalityType}
              </h2>
              <p className="font-mono text-sm text-black/60 max-w-lg mx-auto leading-relaxed">
                {result.shortDescription}
              </p>
            </div>
          </div>

          {/* TRAITS */}
          <div className="rounded-xl bg-white/40 border border-white/50 p-6 sm:p-8 flex flex-col gap-6">
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
                  className="px-3 py-1 bg-[#10302A] text-[#F1ECE2] font-mono text-[10px] uppercase tracking-wider rounded-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* DIMENSIONS */}
          <div className="rounded-xl bg-white/40 border border-white/50 p-6 sm:p-8 flex flex-col gap-6">
            <h3
              className="font-serif text-xl text-[#10302A]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Dimensions
            </h3>
            <div className="space-y-4">
              {result.dimensions.map((dim, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-black/60">
                    <span>{dim.name}</span>
                    <span>{dim.score}%</span>
                  </div>
                  <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${dim.score}%` }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      className="h-full bg-[#9C5B42]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={onViewDetails}
            className="flex-1 h-12 bg-[#10302A] text-[#F1ECE2] font-mono text-xs uppercase tracking-widest hover:bg-[#9C5B42] transition-colors flex items-center justify-center"
          >
            View Full Breakdown
          </button>
          <button
            onClick={onRetake}
            className="flex-1 h-12 border border-[#10302A] text-[#10302A] font-mono text-xs uppercase tracking-widest hover:bg-black/5 transition-colors flex items-center justify-center"
          >
            Retake Test
          </button>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default SummaryScreen;
