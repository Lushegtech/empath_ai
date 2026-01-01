import { Answer, AnalysisResult } from '../types';

/**
 * Analyze personality by calling our secure serverless API.
 * The API key is stored server-side, never exposed to the client.
 */
export const analyzePersonality = async (answers: Answer[]): Promise<AnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to analyze personality');
  }

  return response.json();
};
