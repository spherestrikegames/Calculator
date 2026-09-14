export type AngleMode = 'DEG' | 'RAD';

export type GlassTheme = 'nebula' | 'bubblegum' | 'tropical' | 'aurora' | 'cyber';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  note?: string;
}

export interface KidConcept {
  id: string;
  symbol: string;
  title: string;
  category: 'Trigonometry' | 'Powers & Roots' | 'Constants' | 'Functions' | 'Basics';
  simpleExplanation: string;
  realWorldExample: string;
  funFact: string;
  sampleExpression: string;
  sampleAnswer: string;
  badgeColor: string;
}

export interface MathChallenge {
  id: string;
  level: 'Explorer (Easy)' | 'Scientist (Medium)' | 'Cosmic Genius (Hard)';
  question: string;
  hint: string;
  targetAnswer: number;
  tolerance?: number;
  explanation: string;
  suggestedKeys: string[];
}
