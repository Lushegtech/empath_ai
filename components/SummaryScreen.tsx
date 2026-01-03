'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import BrandLayout from './BrandLayout';
import { motion } from 'framer-motion';

import EmailCaptureModal from './EmailCaptureModal';

interface SummaryScreenProps {
  result: AnalysisResult;
  onViewDetails: () => void;
  onRetake: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ result, onViewDetails, onRetake }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handleUnlock = (email: string) => {
    // In the future, we can save this email to context or local storage
    console.log('Lead Captured:', email);
    setShowEmailModal(false);
    onViewDetails();
  };

  return (
    <BrandLayout currentTime={currentTime}>
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleUnlock}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
        className="w-full max-w-4xl flex flex-col items-center gap-10"
      >
        {/* Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
          }}
          className="text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9C5B42] mb-3 block">
            Analysis Complete
          </span>
          <h1
            className="text-4xl sm:text-6xl font-serif text-[#10302A]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Your personality snapshot
          </h1>
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MAIN CARD - VELLUM STYLE */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'backOut' } },
            }}
            className="md:col-span-2 relative group"
          >
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 pointer-events-none"></div>
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm p-8 sm:p-10 flex flex-col items-center text-center gap-6 rounded-xl transition-all duration-500 hover:shadow-md">
              <div className="w-24 h-24 rounded-full border border-[#9C5B42]/20 flex items-center justify-center bg-[#F1ECE2] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#9C5B42]/5 animate-pulse rounded-full"></div>
                <span className="material-symbols-outlined text-5xl text-[#9C5B42]">
                  psychology
                </span>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10302A]/40 mb-3">
                  Archetype Identified
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-serif text-[#10302A] mb-4"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {result.personalityType}
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#10302A]/70 max-w-lg mx-auto leading-relaxed">
                  {result.shortDescription}
                </p>
              </div>
            </div>
          </motion.div>

          {/* TRAITS - VELLUM STYLE */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 pointer-events-none"></div>
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm p-6 sm:p-8 flex flex-col gap-6 rounded-xl h-full transition-all duration-500 hover:shadow-md">
              <h3
                className="font-serif text-2xl text-[#10302A]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Key Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keyTraits.map((trait, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-3 py-1.5 bg-[#10302A] text-[#F1ECE2] font-mono text-[10px] uppercase tracking-wider rounded-sm"
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* DIMENSIONS - VELLUM STYLE */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 pointer-events-none"></div>
            <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 pointer-events-none"></div>
            <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm p-6 sm:p-8 flex flex-col gap-6 rounded-xl h-full transition-all duration-500 hover:shadow-md">
              <h3
                className="font-serif text-2xl text-[#10302A]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Dimensions
              </h3>
              <div className="space-y-5">
                {result.dimensions.map((dim, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#10302A]/60">
                      <span>{dim.name}</span>
                      <span>{dim.score}%</span>
                    </div>
                    <div className="h-0.5 w-full bg-[#10302A]/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${dim.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.8 + idx * 0.1, ease: 'circOut' }}
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
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } },
          }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4"
        >
          <button
            onClick={() => setShowEmailModal(true)}
            className="relative flex-1 h-14 bg-[#10302A] text-[#F1ECE2] rounded overflow-hidden flex items-center justify-center gap-3 transition-all active:scale-[0.99] group shadow-lg shadow-[#10302A]/10 hover:shadow-xl hover:shadow-[#10302A]/20"
          >
            <span className="font-mono font-bold tracking-[0.2em] uppercase z-10 text-xs">
              Unlock Full Report
            </span>
            <div className="absolute inset-0 bg-[#9C5B42] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0"></div>
          </button>

          <button
            onClick={onRetake}
            className="flex-1 h-14 rounded border border-[#10302A]/20 text-[#10302A]/60 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#10302A]/5 hover:text-[#10302A] hover:border-[#10302A]/40 transition-all active:scale-[0.99]"
          >
            Retake Test
          </button>
        </motion.div>
      </motion.div>
    </BrandLayout>
  );
};

export default SummaryScreen;
