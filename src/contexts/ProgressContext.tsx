import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  incrementReviewed: () => void;
  incrementCorrect: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  cardsReviewed: 0,
  correctAnswers: 0,
  streak: 0,
  lastStudySession: undefined
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const savedProgress = localStorage.getItem('userProgress');
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  // Check if a new day has started and reset streak if needed
  useEffect(() => {
    const checkDailyStreak = () => {
      if (progress.lastStudySession) {
        const lastDate = new Date(progress.lastStudySession);
        const currentDate = new Date();
        
        // If more than 48 hours have passed, reset streak
        if ((currentDate.getTime() - lastDate.getTime()) > 48 * 60 * 60 * 1000) {
          resetStreak();
        }
      }
    };
    
    checkDailyStreak();
  }, []);

  const incrementReviewed = () => {
    setProgress(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      lastStudySession: new Date()
    }));
  };

  const incrementCorrect = () => {
    setProgress(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1
    }));
  };

  const incrementStreak = () => {
    setProgress(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  const resetStreak = () => {
    setProgress(prev => ({
      ...prev,
      streak: 0
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      incrementReviewed, 
      incrementCorrect, 
      incrementStreak,
      resetStreak,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 