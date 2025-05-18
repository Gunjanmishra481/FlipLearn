import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useProgress } from '../contexts/ProgressContext';
import Flashcard from './Flashcard';
import LearningInsights from './LearningInsights';
import '../styles/SmartStudyMode.css';

const SmartStudyMode: React.FC = () => {
  const { getSmartStudySet, cards } = useFlashcards();
  const { incrementReviewed, incrementCorrect, incrementStreak } = useProgress();
  const [smartCards, setSmartCards] = useState(getSmartStudySet(5));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [studyTime, setStudyTime] = useState(0);

  // Start study session timer
  useEffect(() => {
    setStudyStartTime(new Date());
    incrementStreak(); // Increment streak when starting a study session
    
    return () => {
      if (studyStartTime) {
        const endTime = new Date();
        const minutes = Math.round(
          (endTime.getTime() - studyStartTime.getTime()) / (1000 * 60)
        );
        setStudyTime(minutes);
      }
    };
  }, []);
  
  const handleNextCard = () => {
    if (currentCardIndex < smartCards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setShowAnswer(false);
    } else {
      setStudyCompleted(true);
    }
  };
  
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prevIndex) => prevIndex - 1);
      setShowAnswer(false);
    }
  };
  
  const toggleAnswer = () => {
    if (!isRotating) {
      setIsRotating(true);
      
      setTimeout(() => {
        if (!showAnswer) {
          incrementReviewed();
        }
        setShowAnswer(!showAnswer);
        setIsRotating(false);
      }, 300);
    }
  };
  
  const handleConfidenceRating = (level: number) => {
    // Consider rating of 4-5 as "correct"
    if (level >= 4) {
      incrementCorrect();
    }
    
    // Move to next card
    setTimeout(handleNextCard, 300);
  };
  
  const resetStudySession = () => {
    setSmartCards(getSmartStudySet(5));
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyCompleted(false);
    setStudyStartTime(new Date());
  };
  
  if (cards.length === 0) {
    return (
      <div className="smart-study-container">
        <div className="empty-state">
          <h2>No flashcards found</h2>
          <p>You haven't created any flashcards yet.</p>
          <p>Go to the Create tab to add some flashcards!</p>
        </div>
      </div>
    );
  }
  
  if (studyCompleted) {
    return (
      <div className="smart-study-container">
        <motion.div 
          className="study-completed glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Study Session Completed!</h2>
          <p>You've completed your smart study session.</p>
          
          <div className="completion-stats">
            <div className="completion-stat">
              <span className="stat-label">Cards Reviewed</span>
              <span className="stat-value">{smartCards.length}</span>
            </div>
            <div className="completion-stat">
              <span className="stat-label">Study Time</span>
              <span className="stat-value">{studyTime} min</span>
            </div>
          </div>
          
          <button 
            className="btn continue-btn" 
            onClick={resetStudySession}
          >
            Study Again
          </button>
        </motion.div>
        
        <LearningInsights />
      </div>
    );
  }
  
  const currentCard = smartCards[currentCardIndex];
  
  return (
    <div className="smart-study-container">
      <div className="smart-study-header">
        <h2>Smart Study Mode</h2>
        <p className="smart-explainer">Cards are intelligently ordered based on your learning patterns</p>
      </div>
      
      <Flashcard 
        card={currentCard}
        showAnswer={showAnswer}
        onFlip={toggleAnswer}
        onConfidenceRating={showAnswer ? handleConfidenceRating : undefined}
      />
      
      <div className="smart-study-controls">
        <button 
          className="control-btn prev-btn" 
          onClick={handlePrevCard}
          disabled={currentCardIndex === 0}
          aria-label="Previous card"
        >
          ← Previous
        </button>
        <button 
          className="control-btn flip-btn" 
          onClick={toggleAnswer}
          aria-label="Flip card"
        >
          Flip
        </button>
        <button 
          className="control-btn next-btn" 
          onClick={handleNextCard}
          aria-label="Next card"
        >
          Next →
        </button>
      </div>
      
      <div className="smart-study-progress">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentCardIndex + 1) / smartCards.length) * 100}%` }}
          ></div>
        </div>
        <p className="card-counter">
          Card {currentCardIndex + 1} of {smartCards.length}
        </p>
      </div>
    </div>
  );
};

export default SmartStudyMode; 