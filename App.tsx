'use client';

import React, { useState, useCallback } from 'react';
import { AppScreen, Answer, AnalysisResult } from './types';
import LandingScreen from './components/LandingScreen';
import ConsentScreen from './components/ConsentScreen';
import QuestionnaireScreen from './components/QuestionnaireScreen';
import AnalyzingScreen from './components/AnalyzingScreen';
import SummaryScreen from './components/SummaryScreen';
import DetailsScreen from './components/DetailsScreen';
import { analyzePersonality } from './services/geminiService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [_answers, setAnswers] = useState<Answer[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleStartTest = () => {
    setCurrentScreen(AppScreen.CONSENT);
  };

  const handleConsentGiven = () => {
    setCurrentScreen(AppScreen.QUESTIONNAIRE);
  };

  const handleQuestionnaireComplete = useCallback(async (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    setCurrentScreen(AppScreen.ANALYZING);

    try {
      const result = await analyzePersonality(finalAnswers);
      setAnalysisResult(result);
      setCurrentScreen(AppScreen.SUMMARY);
    } catch (error) {
      console.error('Analysis failed', error);
      // In a real app, handle error state better (e.g. show toast or error screen)
      alert('Something went wrong analyzing your results. Please try again.');
      setCurrentScreen(AppScreen.LANDING);
    }
  }, []);

  const handleViewDetails = () => {
    setCurrentScreen(AppScreen.DETAILS);
  };

  const handleRetakeTest = () => {
    setAnswers([]);
    setAnalysisResult(null);
    setCurrentScreen(AppScreen.LANDING);
  };

  const handleBackToSummary = () => {
    setCurrentScreen(AppScreen.SUMMARY);
  };

  return (
    <div className="min-h-screen w-full bg-background-light dark:bg-background-dark transition-colors duration-300">
      {currentScreen === AppScreen.LANDING && <LandingScreen onStart={handleStartTest} />}
      {currentScreen === AppScreen.CONSENT && <ConsentScreen onConsent={handleConsentGiven} />}
      {currentScreen === AppScreen.QUESTIONNAIRE && (
        <QuestionnaireScreen onComplete={handleQuestionnaireComplete} />
      )}
      {currentScreen === AppScreen.ANALYZING && <AnalyzingScreen />}
      {currentScreen === AppScreen.SUMMARY && analysisResult && (
        <SummaryScreen
          result={analysisResult}
          onViewDetails={handleViewDetails}
          onRetake={handleRetakeTest}
        />
      )}
      {currentScreen === AppScreen.DETAILS && analysisResult && (
        <DetailsScreen result={analysisResult} onBack={handleBackToSummary} />
      )}
    </div>
  );
};

export default App;
