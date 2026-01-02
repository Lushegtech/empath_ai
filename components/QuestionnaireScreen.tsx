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
                <p className="font-mono text-xs text-black/50 uppercase tracking-widest max-w-md">
                  Calibrate your response
                </p>
              </div>

              {/* Calibration Slider */}
              {/* Calibration Slider */}
              <div className="w-full max-w-xl mx-auto mb-16 px-4">
                {/* Labels */}
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#10302A]/40 mb-6 px-1">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>

                {/* Slider Component */}
                <div className="relative h-12 flex items-center">
                  {/* Track Line */}
                  <div className="absolute left-0 right-0 h-px bg-[#10302A]/20" />

                  {/* Ticks */}
                  <div className="absolute w-full flex justify-between px-[10px] pointer-events-none">
                    {/* px-[10px] aligns ticks with the 20px thumb center (10px padding) approx? 
                         Actually, standard range inputs have thumb inset. 
                         Let's use percent based positioning for ticks to match values 1-5 exactly. 
                     */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute h-3 w-px bg-[#10302A]/20 -translate-y-1/2 top-1/2"
                        style={{ left: `${i * 25}%` }}
                      />
                    ))}
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {/* Visual Thumb - The Feedback Layer */}
                  <div className="absolute inset-0 pointer-events-none px-[10px]">
                    {' '}
                    {/* Padding to match native slider thumb inset offset approx */}
                    <div className="relative w-full h-full">
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -ml-2"
                        animate={{ left: `${((sliderValue - 1) / 4) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          {/* The Diamond */}
                          {/* The Diamond */}
                          <motion.div
                            className="w-4 h-4 bg-[#9C5B42] border-2 border-[#F1ECE2]"
                            animate={{
                              rotate: 45,
                              scale: isDragging ? 1.5 : 1,
                              boxShadow: isDragging
                                ? '0 0 20px rgba(156, 91, 66, 0.4)'
                                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          {/* The Value Label */}
                          <span className="absolute top-8 font-mono text-xs font-bold text-[#9C5B42]">
                            {sliderValue}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 w-full justify-center items-center mt-4">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-3 font-mono text-xs uppercase tracking-widest text-black/40 hover:text-black transition-colors ${currentQuestionIndex === 0 ? 'hidden' : 'opacity-100'}`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="relative overflow-hidden h-12 min-w-[140px] bg-[#10302A] text-[#F1ECE2] transition-all duration-300 group flex items-center justify-center rounded hover:shadow-lg"
            >
              <span className="relative z-10 font-mono text-xs font-bold uppercase tracking-widest">
                {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next'}
              </span>
              <div className="absolute inset-0 bg-[#9C5B42] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ease-out" />
            </button>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default QuestionnaireScreen;
