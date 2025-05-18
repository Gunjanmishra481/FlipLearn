import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Flashcard, Category } from '../types';
import { calculateNextReviewDate, calculateReviewPriority, calculateCategoryMastery } from '../utils/spacedRepetition';

interface FlashcardContextType {
  cards: Flashcard[];
  categories: Category[];
  addCard: (card: Omit<Flashcard, 'id'>) => void;
  editCard: (id: number, updatedCard: Partial<Flashcard>) => void;
  deleteCard: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  filterByCategory: (category: string | null) => Flashcard[];
  updateCardConfidence: (id: number, level: number) => void;
  getDueCards: (count?: number) => Flashcard[];
  getCategoryMastery: (categoryName: string) => number;
  getOverallMastery: () => number;
  getSmartStudySet: (count: number) => Flashcard[];
}

const initialCategories: Category[] = [
  { id: 1, name: 'React', color: '#61dafb' },
  { id: 2, name: 'TypeScript', color: '#3178c6' },
  { id: 3, name: 'JavaScript', color: '#f7df1e' },
  { id: 4, name: 'CSS', color: '#264de4' },
  { id: 5, name: 'HTML', color: '#e34c26' },
];

const initialCards: Flashcard[] = [
  { 
    id: 1, 
    question: "What is React?", 
    answer: "A JavaScript library for building user interfaces",
    category: "React",
    difficulty: "easy",
    confidenceLevel: 0
  },
  { 
    id: 2, 
    question: "What is TypeScript?", 
    answer: "A strongly typed programming language that builds on JavaScript",
    category: "TypeScript",
    difficulty: "medium",
    confidenceLevel: 0
  },
  { 
    id: 3, 
    question: "What is JSX?", 
    answer: "A syntax extension for JavaScript that looks similar to HTML",
    category: "React",
    difficulty: "easy",
    confidenceLevel: 0
  },
  { 
    id: 4, 
    question: "What is a useState hook?", 
    answer: "A React Hook that lets you add state to functional components",
    category: "React",
    difficulty: "medium",
    confidenceLevel: 0
  },
  { 
    id: 5, 
    question: "What are TypeScript interfaces?", 
    answer: "A way to define the shape of an object, providing better documentation and error checking",
    category: "TypeScript",
    difficulty: "hard",
    confidenceLevel: 0
  }
];

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const savedCards = localStorage.getItem('flashcards');
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCard = (card: Omit<Flashcard, 'id'>) => {
    const newCard = {
      ...card,
      id: Date.now(),
      lastReviewed: new Date(),
      confidenceLevel: 0,
      reviewCount: 0
    };
    setCards(prev => [...prev, newCard]);
  };

  const editCard = (id: number, updatedCard: Partial<Flashcard>) => {
    setCards(prev => 
      prev.map(card => card.id === id ? { ...card, ...updatedCard } : card)
    );
  };

  const deleteCard = (id: number) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const filterByCategory = (category: string | null): Flashcard[] => {
    if (!category) return cards;
    return cards.filter(card => card.category === category);
  };

  const updateCardConfidence = (id: number, level: number) => {
    setCards(prev => 
      prev.map(card => {
        if (card.id === id) {
          const reviewCount = (card.reviewCount || 0) + 1;
          const nextReviewDate = calculateNextReviewDate(level, reviewCount);
          
          return { 
            ...card, 
            confidenceLevel: level, 
            lastReviewed: new Date(),
            nextReviewDate,
            reviewCount
          };
        }
        return card;
      })
    );
  };

  // Get cards that are due for review based on spaced repetition algorithm
  const getDueCards = (count?: number): Flashcard[] => {
    // Sort cards by priority (overdue cards and low confidence first)
    const sortedCards = [...cards].sort((a, b) => {
      const priorityA = calculateReviewPriority(
        a.confidenceLevel, 
        a.lastReviewed && new Date(a.lastReviewed), 
        a.nextReviewDate && new Date(a.nextReviewDate)
      );
      const priorityB = calculateReviewPriority(
        b.confidenceLevel, 
        b.lastReviewed && new Date(b.lastReviewed), 
        b.nextReviewDate && new Date(b.nextReviewDate)
      );
      return priorityB - priorityA;
    });

    // Return all cards or a subset if count provided
    return count ? sortedCards.slice(0, count) : sortedCards;
  };

  // Calculate mastery level for a specific category
  const getCategoryMastery = (categoryName: string): number => {
    const categoryCards = cards.filter(card => card.category === categoryName);
    return calculateCategoryMastery(categoryCards);
  };

  // Calculate overall mastery level
  const getOverallMastery = (): number => {
    return calculateCategoryMastery(cards);
  };

  // Get a smart study set that prioritizes due cards but includes
  // a mix of mastered and new content for optimal learning
  const getSmartStudySet = (count: number): Flashcard[] => {
    const dueCards = getDueCards();
    
    // If we have enough due cards, just return those
    if (dueCards.length >= count) return dueCards.slice(0, count);
    
    // Otherwise, add some random cards from the rest of the deck
    // to complete the study set
    const remainingCount = count - dueCards.length;
    const reviewedCardIds = new Set(dueCards.map(card => card.id));
    
    const otherCards = cards
      .filter(card => !reviewedCardIds.has(card.id))
      .sort(() => Math.random() - 0.5) // Shuffle remaining cards
      .slice(0, remainingCount);
    
    return [...dueCards, ...otherCards];
  };

  return (
    <FlashcardContext.Provider value={{ 
      cards, 
      categories, 
      addCard, 
      editCard, 
      deleteCard, 
      addCategory,
      filterByCategory,
      updateCardConfidence,
      getDueCards,
      getCategoryMastery,
      getOverallMastery,
      getSmartStudySet
    }}>
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}; 