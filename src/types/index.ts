export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  confidenceLevel?: number; // 1-5 rating
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export type ThemeMode = 'light' | 'dark';

export interface UserProgress {
  cardsReviewed: number;
  correctAnswers: number;
  streak: number;
  lastStudySession?: Date;
} 