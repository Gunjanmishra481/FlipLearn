import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Flashcard, Category } from '../types';

interface FlashcardContextType {
  cards: Flashcard[];
  categories: Category[];
  addCard: (card: Omit<Flashcard, 'id'>) => void;
  editCard: (id: number, updatedCard: Partial<Flashcard>) => void;
  deleteCard: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  filterByCategory: (category: string | null) => Flashcard[];
  updateCardConfidence: (id: number, level: number) => void;
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
      confidenceLevel: 0
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
      prev.map(card => card.id === id 
        ? { ...card, confidenceLevel: level, lastReviewed: new Date() } 
        : card
      )
    );
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
      updateCardConfidence
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