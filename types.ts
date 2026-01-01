export interface Question {
  id: number;
  text: string;
}

export interface Answer {
  questionId: number;
  value: number; // 1 to 5
}

export interface DimensionScore {
  name: string;
  score: number; // 0 to 100
}

export interface DetailedTrait {
  name: string;
  score: number; // 0 to 100
  level: string; // e.g., "High", "Moderate", "Low"
  description: string;
  meanings: string[];
  actionableAdvice: string[];
  icon: string; // Material symbol name
}

export interface AnalysisResult {
  personalityType: string;
  shortDescription: string;
  keyTraits: string[];
  dimensions: DimensionScore[];
  detailedBreakdown: DetailedTrait[];
}

export enum AppScreen {
  LANDING = 'LANDING',
  CONSENT = 'CONSENT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  ANALYZING = 'ANALYZING',
  SUMMARY = 'SUMMARY',
  DETAILS = 'DETAILS',
}
