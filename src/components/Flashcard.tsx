import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard as FlashcardType } from '../types';
import '../styles/Flashcard.css';

interface FlashcardProps {
  card: FlashcardType;
  showAnswer: boolean;
  onFlip: () => void;
  onConfidenceRating?: (level: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  showAnswer, 
  onFlip,
  onConfidenceRating 
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleFlip = () => {
    if (!isRotating) {
      setIsRotating(true);
      setTimeout(() => {
        onFlip();
        setIsRotating(false);
      }, 300);
    }
  };

  const difficultyColor = {
    easy: '#4caf50',
    medium: '#ff9800',
    hard: '#f44336'
  };

  return (
    <div className="flashcard-container">
      <motion.div 
        className={`flashcard ${showAnswer ? 'flipped' : ''}`}
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        style={{ 
          transformStyle: 'preserve-3d',
          borderTop: `4px solid ${difficultyColor[card.difficulty]}`
        }}
      >
        <div className="flashcard-front">
          <div className="category-tag" style={{ backgroundColor: getCategoryColor(card.category) }}>
            {card.category}
          </div>
          <h2>Question:</h2>
          <p>{card.question}</p>
          <div className="card-hint">(Click to flip)</div>
        </div>
        <div className="flashcard-back">
          <div className="category-tag" style={{ backgroundColor: getCategoryColor(card.category) }}>
            {card.category}
          </div>
          <h2>Answer:</h2>
          <p>{card.answer}</p>
          {onConfidenceRating && (
            <div className="confidence-rating">
              <p>How well did you know this?</p>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(level => (
                  <button 
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfidenceRating(level);
                    }}
                    className={`rating-btn rating-${level}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to get category color
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    'React': '#61dafb',
    'TypeScript': '#3178c6',
    'JavaScript': '#f7df1e',
    'CSS': '#264de4',
    'HTML': '#e34c26'
  };

  return categoryColors[category] || '#888888';
}

export default Flashcard; 