'use client';

import React, { useEffect, useState } from 'react';
import BrandLayout from './BrandLayout';
import { motion } from 'framer-motion';

const AnalyzingScreen: React.FC = () => {
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
    <BrandLayout currentTime={currentTime} showFooter={false}>
      <div className="flex flex-col items-center justify-center w-full max-w-lg p-8">
        {/* Visualizer Block */}
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          {/* Rings */}
          <motion.div
            className="absolute inset-0 border border-[#E05D44]/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-4 border border-[#E05D44]/40 rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Inner Scanning Core */}
          <div className="relative w-32 h-32 bg-[#1A1A1A] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <motion.div
              className="w-full h-1 bg-[#E05D44] shadow-[0_0_15px_rgba(224,93,68,0.8)]"
              animate={{ y: [-60, 60, -60] }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
            />
          </div>
        </div>

        {/* Text Status */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl sm:text-3xl font-serif text-[#1A1A1A]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Analysing Patterns...
          </motion.h2>

          <div className="flex flex-col gap-1 items-center">
            <div className="flex gap-1 h-1 w-24">
              <motion.div
                className="h-full bg-[#E05D44] w-1/3"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="h-full bg-[#E05D44] w-1/3"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
              />
              <motion.div
                className="h-full bg-[#E05D44] w-1/3"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/50 mt-2">
              Generating personality profile
            </p>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default AnalyzingScreen;
