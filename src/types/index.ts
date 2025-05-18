export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  confidenceLevel?: number; // 1-5 rating
  nextReviewDate?: Date; // For spaced repetition
  reviewCount?: number; // Number of times reviewed
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
  dailyStudyGoal?: number; // Target cards per day
  totalStudyTime?: number; // Total time spent studying in minutes
  longestStreak?: number; // Longest study streak
  masteryLevels?: {[category: string]: number}; // Mastery percentage by category
}

export interface LearningInsight {
  date: Date;
  cardsReviewed: number;
  accuracy: number; // Percentage of correct answers
  averageConfidence: number; // Average confidence level
  timeSpent?: number; // Minutes spent studying
}

export interface StudySession {
  id: number;
  date: Date;
  duration: number; // Minutes
  cardsReviewed: number;
  correctAnswers: number;
} 