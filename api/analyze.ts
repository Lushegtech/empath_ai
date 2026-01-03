import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, Schema } from '@google/genai';

interface Answer {
  questionId: number;
  value: number;
}

interface Question {
  id: number;
  text: string;
}

// Questions copied from constants.ts for server-side use
const QUESTIONS: Question[] = [
  { id: 1, text: 'I prefer to spend my free time with others rather than alone.' },
  { id: 2, text: 'I trust my gut feelings when making decisions.' },
  { id: 3, text: 'I like to have a detailed plan before starting a project.' },
  { id: 4, text: 'I find it easy to empathize with people who have different viewpoints.' },
  { id: 5, text: 'I enjoy exploring new and unconventional ideas.' },
  { id: 6, text: 'I prefer sticking to tried-and-true methods.' },
  { id: 7, text: 'I often think about the long-term consequences of my actions.' },
  { id: 8, text: 'I am comfortable with ambiguity and uncertainty.' },
  { id: 9, text: 'I find it energizing to be the center of attention.' },
  { id: 10, text: 'I prefer to analyze all the facts before making a decision.' },
  { id: 11, text: 'I am good at mediating conflicts between people.' },
  { id: 12, text: 'I enjoy spontaneous activities and surprises.' },
];

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personalityType: {
      type: Type.STRING,
      description:
        "A creative and catchy name for the user's personality type (e.g., 'Reflective Connector', 'Strategic Visionary').",
    },
    shortDescription: {
      type: Type.STRING,
      description: 'A one-sentence summary of the personality type.',
    },
    keyTraits: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 key adjectives describing the user.',
    },
    dimensions: {
      type: Type.ARRAY,
      description:
        'Scores for 5 interaction style dimensions: Energy Direction (introvert to extrovert), Information Processing (practical to imaginative), Decision Making (analytical to empathetic), Lifestyle Orientation (structured to spontaneous), Conflict Style (assertive to accommodating).',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER, description: 'Score from 0 to 100' },
        },
        required: ['name', 'score'],
      },
    },
    detailedBreakdown: {
      type: Type.ARRAY,
      description: 'Detailed breakdown of 3-4 specific standout traits.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Trait name (e.g. Introversion, Sensing)' },
          score: { type: Type.INTEGER, description: 'Score 0-100' },
          level: { type: Type.STRING, description: 'e.g. High, Moderate, Low' },
          description: {
            type: Type.STRING,
            description: 'Explanation of what this trait measures.',
          },
          meanings: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 bullet points explaining 'This often means:'",
          },
          actionableAdvice: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of 2 specific actionable advice strings.',
          },
          icon: {
            type: Type.STRING,
            description:
              "Material Symbol icon name relevant to the trait (e.g., 'psychology', 'group', 'lightbulb').",
          },
        },
        required: ['name', 'score', 'level', 'description', 'meanings', 'actionableAdvice', 'icon'],
      },
    },
  },
  required: ['personalityType', 'shortDescription', 'keyTraits', 'dimensions', 'detailedBreakdown'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request body
  const { answers } = req.body as { answers: Answer[] };
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Invalid request: answers array required' });
  }

  // Get API key from environment (server-side only!)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format the input for the model
    const formattedInput = answers
      .map((ans) => {
        const question = QUESTIONS.find((q) => q.id === ans.questionId);
        return `Question: "${question?.text}" - Answer: ${ans.value}/5 (1=Disagree, 5=Agree)`;
      })
      .join('\n');

    const prompt = `
You are an expert behavioral psychologist specializing in interpersonal communication styles. You are analyzing responses from "Interaction Style" - a modern personality assessment tool.

## Your Task
Analyze the survey responses below to determine the user's unique **Interaction Style** - how they naturally engage with ideas, people, and decisions.

## Analysis Framework
Consider these key dimensions when analyzing:
- **Energy Direction**: Do they draw energy from external interaction or internal reflection?
- **Information Processing**: Do they prefer concrete facts or abstract possibilities?
- **Decision Making**: Are they guided by logic and principles or values and harmony?
- **Lifestyle Orientation**: Do they prefer structure and closure or flexibility and openness?
- **Conflict Style**: How do they navigate disagreements and tension?

## Response Guidelines
1. **Personality Type**: Create a memorable 2-3 word name that captures their essence (e.g., "The Thoughtful Catalyst", "The Grounded Innovator", "The Adaptive Strategist")
2. **Key Traits**: Choose 5 specific, descriptive adjectives (avoid generic terms like "nice" or "good")
3. **Dimensions**: Score each dimension 0-100 based on clear patterns in responses
4. **Detailed Breakdown**: Focus on 3-4 traits that are most distinctive for this person
5. **Actionable Advice**: Provide specific, practical tips they can use in daily interactions

## Tone
Be warm, insightful, and empowering. Help them see their style as a strength, while offering genuine growth opportunities.

## Survey Responses
${formattedInput}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return res.status(200).json(result);
    } else {
      throw new Error('No response text generated');
    }
  } catch (error) {
    console.error('Error analyzing personality:', error);
    return res.status(500).json({ error: 'Failed to analyze personality' });
  }
}
