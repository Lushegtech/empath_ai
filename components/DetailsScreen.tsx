'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import BrandLayout from './BrandLayout';
import { motion } from 'framer-motion';

interface DetailsScreenProps {
  result: AnalysisResult;
  onBack: () => void;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ result, onBack }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`My Interaction Style: ${result.personalityType}`);
    const body = encodeURIComponent(
      `I just discovered my Interaction Style!\n\n` +
      `My personality type: ${result.personalityType}\n` +
      `${result.shortDescription}\n\n` +
      `Key traits: ${result.keyTraits.join(', ')}\n\n` +
      `Take the test yourself: ${window.location.origin}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <BrandLayout currentTime={currentTime}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
        className="w-full max-w-4xl flex flex-col gap-8 pb-12"
      >
        {/* Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/10 pb-6"
        >
          <div>
            <button
              onClick={onBack}
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black/40 hover:text-[#9C5B42] transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back to Summary
            </button>
            <h1
              className="text-3xl sm:text-4xl font-serif text-[#10302A]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Detailed Analysis
            </h1>
          </div>
          <div className="px-4 py-2 bg-[#10302A] text-[#F1ECE2] text-xs font-mono uppercase tracking-widest rounded-sm border border-[#10302A]/20 shadow-sm">
            Type: {result.personalityType}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {result.detailedBreakdown.map((trait, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 pointer-events-none"></div>
              <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 pointer-events-none"></div>
              <div className="relative bg-[#F9F7F5]/85 backdrop-blur-xl shadow-sm p-6 sm:p-8 rounded-xl transition-all duration-500 hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column: Score & Title */}
                  <div className="flex-shrink-0 flex flex-col gap-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10302A]/5 flex items-center justify-center text-[#9C5B42] border border-[#10302A]/10">
                        <span className="material-symbols-outlined text-xl">
                          {trait.icon || 'circle'}
                        </span>
                      </div>
                      <h2
                        className="font-serif text-2xl text-[#10302A]"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {trait.name}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono uppercase text-[#10302A]/50">
                        <span>Score</span>
                        <span>{trait.score}%</span>
                      </div>
                      <div className="h-1 bg-[#10302A]/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${trait.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4, ease: 'circOut' }}
                          className="h-full bg-[#9C5B42]"
                        ></motion.div>
                      </div>
                      <p className="text-xs font-mono text-[#10302A]/60 pt-1">{trait.level}</p>
                    </div>
                  </div>

                  {/* Right Column: Description */}
                  <div className="flex-1 flex flex-col gap-6">
                    <p className="text-sm sm:text-base text-[#10302A]/80 leading-relaxed font-sans">
                      {trait.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-white/40 p-5 rounded border border-[#10302A]/10">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#10302A]/40 mb-3 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#10302A]/40"></span> Implications
                        </h4>
                        <ul className="space-y-2.5">
                          {trait.meanings.map((m, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-[#10302A]/70"
                            >
                              <span className="mt-1.5 w-1 h-1 bg-[#9C5B42] rounded-full shrink-0 opacity-60"></span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/40 p-5 rounded border border-[#10302A]/10">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#10302A]/40 mb-3 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#10302A]/40"></span> Advice
                        </h4>
                        <ul className="space-y-2.5">
                          {trait.actionableAdvice.map((a, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-[#10302A]/70"
                            >
                              <span className="material-symbols-outlined text-sm text-[#9C5B42] shrink-0 opacity-80">
                                check_circle
                              </span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="mt-8 p-8 sm:p-10 rounded-xl bg-[#10302A] text-[#F1ECE2] flex flex-col items-center text-center gap-6 relative overflow-hidden"
        >
          {/* Decorative background for share card */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(#F1ECE2 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>
          </div>

          <h2
            className="font-serif text-2xl sm:text-3xl relative z-10"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Share your profile
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
            <button
              onClick={handleCopyLink}
              className="h-12 px-8 border border-[#F1ECE2]/20 hover:bg-[#F1ECE2] hover:text-[#10302A] transition-all rounded font-mono text-xs uppercase tracking-widest min-w-[160px] flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined text-sm">link</span>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleEmailShare}
              className="h-12 px-8 bg-[#9C5B42] text-[#F1ECE2] hover:bg-[#b05d45] transition-all rounded font-mono text-xs uppercase tracking-widest border border-transparent min-w-[160px] flex items-center justify-center gap-2 shadow-lg shadow-black/20"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Email Me
            </button>
          </div>
        </motion.div>
      </motion.div>
    </BrandLayout>
  );
};

export default DetailsScreen;
