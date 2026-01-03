'use client';

import React, { useState, useEffect } from 'react';
import { QUESTIONS, TOTAL_QUESTIONS } from '../constants';
import { Answer } from '../types';
import BrandLayout from './BrandLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionnaireScreenProps {
  onComplete: (answers: Answer[]) => void;
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(3); // Default middle (Neutral)
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const currentQuestion = QUESTIONS[currentQuestionIndex];

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  const handleNext = () => {
    setIsAccelerating(true); // Trigger speed up

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: sliderValue,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSliderValue(3); // Reset to neutral
        setIsAccelerating(false); // Slow down after transition
      }, 500); // Wait for speed up effect
    } else {
      setTimeout(() => onComplete(newAnswers), 500);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevAnswer = answers[prevIndex];
      setSliderValue(prevAnswer ? prevAnswer.value : 3);
      setAnswers(answers.slice(0, prevIndex));
    }
  };

  return (
    <BrandLayout
      currentTime={currentTime}
      speedMultiplier={isAccelerating ? 3 : 1}
      showGyroscope={true}
      showTopoLines={false}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full mb-8 sm:mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9C5B42]">
              Question{' '}
              {currentQuestionIndex + 1 < 10
                ? `0${currentQuestionIndex + 1}`
                : currentQuestionIndex + 1}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">
              /{TOTAL_QUESTIONS}
            </span>
          </div>
          <div className="w-full h-px bg-black/10 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#9C5B42]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center p-6 mb-8">
                <h2
                  className="text-3xl sm:text-5xl font-serif text-[#10302A] leading-tight mb-4"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Calibration Slider */}
              <div className="w-full max-w-xl mx-auto mb-16 px-4">
                {/* Labels */}
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#10302A]/40 mb-3 px-1">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>

                {/* Slider Component - The Tactile Track */}
                <div className="relative h-14 bg-[#10302A]/5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  {/* Ticks/Segments Grid */}
                  <div className="absolute inset-0 flex justify-between items-center px-[26px] pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#10302A]/20" />
                    ))}
                  </div>

                  {/* Visual Puck/Thumb */}
                  <div className="absolute inset-0 px-[4px] pointer-events-none">
                    <div className="relative w-full h-full">
                      <motion.div
                        className="absolute top-1/2 h-[calc(100%-12px)] aspect-square rounded-full shadow-md flex items-center justify-center z-10 bg-[#9C5B42]"
                        style={{
                          x: '-50%',
                          y: '-50%',
                        }}
                        animate={{
                          left: `calc(26px + (100% - 52px) * ${(sliderValue - 1) / 4})`,
                          scale: isDragging ? 0.9 : 1,
                          rotate: sliderValue === 1 ? -10 : sliderValue === 5 ? 10 : 0, // "Lean" into the wall
                        }}
                        transition={{
                          left: { type: 'spring', stiffness: 400, damping: 40 }, // Critical damping (no overshoot)
                          rotate: { type: 'spring', stiffness: 400, damping: 15 }, // Bouncy rotation
                          scale: { type: 'spring', stiffness: 400, damping: 15 }, // Bouncy squish
                        }}
                      >
                        {/* Value Display */}
                        <motion.span
                          className="font-mono text-xs font-bold text-[#F1ECE2]"
                          animate={{
                            rotate: sliderValue === 1 ? 10 : sliderValue === 5 ? -10 : 0, // Counter-rotate to keep text upright
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 15,
                          }}
                        >
                          {sliderValue}
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Invisible Input - The Interaction Layer */}
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onPointerDown={() => setIsDragging(true)}
                    onPointerUp={() => setIsDragging(false)}
                    onBlur={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                </div>

                <p className="text-center mt-4 font-mono text-xs text-black/50 uppercase tracking-widest">
                  &lt; DRAG TO ADJUST &gt;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 w-full justify-center items-center mt-4">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`h-14 px-8 font-mono text-xs uppercase tracking-widest text-[#10302A]/40 hover:text-[#10302A] transition-colors ${currentQuestionIndex === 0 ? 'hidden' : 'opacity-100'}`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="group relative overflow-hidden h-14 min-w-[140px] bg-[#10302A] text-[#F1ECE2] transition-all duration-300 flex items-center justify-center rounded shadow-lg shadow-[#10302A]/10 active:scale-[0.99]"
            >
              <span className="relative z-10 font-mono text-xs font-bold uppercase tracking-widest">
                {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next'}
              </span>
              <div className="absolute inset-0 bg-[#9C5B42] transform translate-y-full transition-transform duration-500 group-hover:translate-y-0 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default QuestionnaireScreen;
