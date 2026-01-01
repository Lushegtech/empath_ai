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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

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

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: selectedOption,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      }, 200); // Slight delay for visual feedback
    } else {
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevAnswer = answers[prevIndex];
      setSelectedOption(prevAnswer ? prevAnswer.value : null);
      setAnswers(answers.slice(0, prevIndex));
    }
  };

  return (
    <BrandLayout currentTime={currentTime}>
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full mb-8 sm:mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#E05D44]">
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
              className="absolute top-0 left-0 h-full bg-[#E05D44]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center p-6 mb-8">
                <h2
                  className="text-3xl sm:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {currentQuestion.text}
                </h2>
                <p className="font-mono text-xs text-black/50 uppercase tracking-widest max-w-md">
                  Select the option that best describes you
                </p>
              </div>

              {/* Likert Scale */}
              <div className="w-full max-w-lg mx-auto mb-12">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-black/40 mb-4 px-2">
                  <span>Disagree</span>
                  <span>Agree</span>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(val)}
                      className={`relative group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border transition-all duration-300 ${
                        selectedOption === val
                          ? 'border-[#E05D44] bg-[#E05D44] text-white scale-110 shadow-lg shadow-[#E05D44]/30'
                          : 'border-black/10 bg-white/40 hover:border-black/30 hover:bg-white/80'
                      }`}
                    >
                      <span
                        className={`font-mono text-lg sm:text-xl font-bold transition-colors ${selectedOption === val ? 'text-white' : 'text-black/60'}`}
                      >
                        {val}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 w-full justify-center items-center mt-4">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-3 font-mono text-xs uppercase tracking-widest text-black/40 hover:text-black transition-colors ${currentQuestionIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`relative overflow-hidden h-12 min-w-[140px] bg-[#1A1A1A] text-[#F2F0EB] transition-all duration-300 group flex items-center justify-center rounded ${
                selectedOption === null
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100 hover:shadow-lg'
              }`}
            >
              <span className="relative z-10 font-mono text-xs font-bold uppercase tracking-widest">
                {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next'}
              </span>
              <div className="absolute inset-0 bg-[#E05D44] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ease-out" />
            </button>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default QuestionnaireScreen;
