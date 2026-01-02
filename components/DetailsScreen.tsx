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
      <div className="w-full max-w-4xl flex flex-col gap-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
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
          <div className="px-4 py-2 bg-[#10302A] text-[#F1ECE2] text-xs font-mono uppercase tracking-widest rounded-sm">
            Type: {result.personalityType}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {result.detailedBreakdown.map((trait, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-colors p-6 sm:p-8"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Score & Title */}
                <div className="flex-shrink-0 flex flex-col gap-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#9C5B42] text-2xl">
                      {trait.icon || 'circle'}
                    </span>
                    <h2
                      className="font-serif text-2xl text-[#10302A]"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {trait.name}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase text-black/40">
                      <span>Score</span>
                      <span>{trait.score}%</span>
                    </div>
                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9C5B42]"
                        style={{ width: `${trait.score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-mono text-black/50 pt-1">{trait.level}</p>
                  </div>
                </div>

                {/* Right Column: Description */}
                <div className="flex-1 flex flex-col gap-6">
                  <p className="text-sm sm:text-base text-black/80 leading-relaxed font-sans">
                    {trait.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white/30 p-4 rounded border border-white/50">
                      <h4 className="font-mono text-[10px] uppercase tracking-widest text-black/50 mb-3">
                        Implications
                      </h4>
                      <ul className="space-y-2">
                        {trait.meanings.map((m, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm text-black/70"
                          >
                            <span className="mt-1.5 w-1 h-1 bg-[#9C5B42] rounded-full shrink-0"></span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/30 p-4 rounded border border-white/50">
                      <h4 className="font-mono text-[10px] uppercase tracking-widest text-black/50 mb-3">
                        Advice
                      </h4>
                      <ul className="space-y-2">
                        {trait.actionableAdvice.map((a, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm text-black/70"
                          >
                            <span className="material-symbols-outlined text-sm text-[#9C5B42] shrink-0">
                              check
                            </span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-8 rounded-xl bg-[#10302A] text-[#F1ECE2] flex flex-col items-center text-center gap-6">
          <h2
            className="font-serif text-2xl sm:text-3xl"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Share your profile
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="h-10 px-6 border border-[#F1ECE2]/30 hover:bg-[#F1ECE2] hover:text-[#10302A] transition-colors rounded-full font-mono text-xs uppercase tracking-widest min-w-[140px]"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleEmailShare}
              className="h-10 px-6 bg-[#9C5B42] text-white hover:bg-[#c04d3b] transition-colors rounded-full font-mono text-xs uppercase tracking-widest border border-transparent min-w-[140px]"
            >
              Email Me
            </button>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default DetailsScreen;
