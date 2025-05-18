import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Flashcard, Category } from '../types';
import { calculateNextReviewDate, calculateReviewPriority, calculateCategoryMastery } from '../utils/spacedRepetition';
import { fetchFlashcards } from '../utils/api';

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
  loadMoreCards: (category: string) => Promise<void>;
  isLoading: boolean;
}

const initialCategories: Category[] = [
  { id: 1, name: 'React', color: '#61dafb' },
  { id: 2, name: 'TypeScript', color: '#3178c6' },
  { id: 3, name: 'JavaScript', color: '#f7df1e' },
  { id: 4, name: 'CSS', color: '#264de4' },
  { id: 5, name: 'HTML', color: '#e34c26' },
];

const initialCards: Flashcard[] = [
  // React Cards
  { 
    id: 1, 
    question: "What is React?", 
    answer: "A JavaScript library for building user interfaces",
    category: "React",
    difficulty: "easy",
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
    id: 6,
    question: "What is the virtual DOM in React?",
    answer: "A lightweight copy of the actual DOM that React uses to optimize rendering performance by minimizing direct DOM manipulations",
    category: "React",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 7,
    question: "What is the purpose of the useEffect hook?",
    answer: "To perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM",
    category: "React",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 8,
    question: "What are React components?",
    answer: "Independent, reusable pieces of code that return React elements describing how a section of the UI should appear",
    category: "React",
    difficulty: "easy",
    confidenceLevel: 0
  },
  {
    id: 9,
    question: "What is the difference between props and state in React?",
    answer: "Props are passed from parent to child and are read-only. State is managed within a component and can be changed by the component itself",
    category: "React",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 10,
    question: "What is React Context API used for?",
    answer: "For sharing data that can be considered global for a tree of React components, avoiding 'prop drilling'",
    category: "React",
    difficulty: "hard",
    confidenceLevel: 0
  },
  
  // TypeScript Cards
  { 
    id: 2, 
    question: "What is TypeScript?", 
    answer: "A strongly typed programming language that builds on JavaScript",
    category: "TypeScript",
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
  },
  {
    id: 11,
    question: "What is the difference between 'interface' and 'type' in TypeScript?",
    answer: "Interfaces are extendable and can be implemented by classes. Types can create union and intersection types, but cannot be extended after creation",
    category: "TypeScript",
    difficulty: "hard",
    confidenceLevel: 0
  },
  {
    id: 12,
    question: "What are generics in TypeScript?",
    answer: "A way to create reusable components that can work with a variety of types rather than a single one",
    category: "TypeScript",
    difficulty: "hard",
    confidenceLevel: 0
  },
  {
    id: 13,
    question: "What is the 'any' type in TypeScript?",
    answer: "A type that allows a variable to hold values of any type and bypasses type checking",
    category: "TypeScript",
    difficulty: "easy",
    confidenceLevel: 0
  },
  {
    id: 14,
    question: "What is the '?' operator in TypeScript?",
    answer: "The optional property operator that makes a property or parameter optional",
    category: "TypeScript",
    difficulty: "medium",
    confidenceLevel: 0
  },
  
  // JavaScript Cards
  {
    id: 15,
    question: "What is a closure in JavaScript?",
    answer: "A function that has access to its own scope, the outer function's variables, and global variables even after the outer function has finished executing",
    category: "JavaScript",
    difficulty: "hard",
    confidenceLevel: 0
  },
  {
    id: 16,
    question: "What is the difference between '==' and '===' in JavaScript?",
    answer: "'==' compares values with type coercion, while '===' compares both values and types without coercion",
    category: "JavaScript",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 17,
    question: "What is hoisting in JavaScript?",
    answer: "JavaScript's default behavior of moving declarations to the top of the current scope",
    category: "JavaScript",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 18,
    question: "What is a Promise in JavaScript?",
    answer: "An object representing the eventual completion or failure of an asynchronous operation and its resulting value",
    category: "JavaScript",
    difficulty: "hard",
    confidenceLevel: 0
  },
  {
    id: 19,
    question: "What are arrow functions in JavaScript?",
    answer: "A concise syntax for writing function expressions with a lexical 'this' binding",
    category: "JavaScript",
    difficulty: "medium",
    confidenceLevel: 0
  },
  
  // CSS Cards
  {
    id: 20,
    question: "What is the box model in CSS?",
    answer: "A layout concept that describes how elements are structured with content, padding, border, and margin",
    category: "CSS",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 21,
    question: "What is the difference between 'display: none' and 'visibility: hidden'?",
    answer: "'display: none' removes the element from the document flow, while 'visibility: hidden' hides it but keeps its space",
    category: "CSS",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 22,
    question: "What are CSS Flexbox and Grid?",
    answer: "Layout models that provide efficient ways to arrange, align, and distribute space among items in a container",
    category: "CSS",
    difficulty: "hard",
    confidenceLevel: 0
  },
  {
    id: 23,
    question: "What is a CSS preprocessor?",
    answer: "A program that extends CSS with variables, nesting, mixins, and other features that get compiled into standard CSS",
    category: "CSS",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 24,
    question: "What is the difference between 'em' and 'rem' units?",
    answer: "'em' is relative to the font size of its parent element, while 'rem' is relative to the root element's font size",
    category: "CSS",
    difficulty: "medium",
    confidenceLevel: 0
  },
  
  // HTML Cards
  {
    id: 25,
    question: "What is the purpose of the HTML doctype declaration?",
    answer: "To tell the browser which version of HTML is being used so it knows how to render the page correctly",
    category: "HTML",
    difficulty: "easy",
    confidenceLevel: 0
  },
  {
    id: 26,
    question: "What is the difference between 'localStorage' and 'sessionStorage'?",
    answer: "'localStorage' persists until explicitly deleted, while 'sessionStorage' is cleared when the page session ends",
    category: "HTML",
    difficulty: "medium",
    confidenceLevel: 0
  },
  {
    id: 27,
    question: "What are HTML semantic elements?",
    answer: "Elements that clearly describe their meaning to both browser and developer, like <header>, <footer>, <article>",
    category: "HTML",
    difficulty: "easy",
    confidenceLevel: 0
  },
  {
    id: 28,
    question: "What is the purpose of the 'alt' attribute in <img> tags?",
    answer: "To provide alternative text for users who cannot view images and for accessibility",
    category: "HTML",
    difficulty: "easy",
    confidenceLevel: 0
  },
  {
    id: 29,
    question: "What is HTML Canvas?",
    answer: "An HTML element used to draw graphics via JavaScript, allowing for creating animations, graphs, and interactive visuals",
    category: "HTML",
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Function to load more cards from the API
  const loadMoreCards = async (category: string): Promise<void> => {
    setIsLoading(true);
    try {
      const newCards = await fetchFlashcards(category);
      
      // Check for duplicates to avoid ID conflicts
      const existingIds = new Set(cards.map(card => card.id));
      const uniqueNewCards = newCards.filter(card => !existingIds.has(card.id));
      
      if (uniqueNewCards.length > 0) {
        setCards(prevCards => [...prevCards, ...uniqueNewCards]);
      }
    } catch (error) {
      console.error("Error loading more cards:", error);
    } finally {
      setIsLoading(false);
    }
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
      getSmartStudySet,
      loadMoreCards,
      isLoading
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