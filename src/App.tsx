import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FlashcardProvider, useFlashcards } from './contexts/FlashcardContext';
import { ProgressProvider, useProgress } from './contexts/ProgressContext';
import Header from './components/Header';
import Flashcard from './components/Flashcard';
import CategoryFilter from './components/CategoryFilter';
import CreateCardForm from './components/CreateCardForm';
import StatsDisplay from './components/StatsDisplay';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import './styles/global.css';
import './App.css';

const Study: React.FC = () => {
  const { cards, categories, filterByCategory, updateCardConfidence } = useFlashcards();
  const { incrementReviewed, incrementCorrect } = useProgress();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredCards = filterByCategory(selectedCategory);
  
  // Reset current card index when filters change
  useEffect(() => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [selectedCategory]);
  
  // Handle empty state
  if (filteredCards.length === 0) {
    return (
      <div className="study-container">
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="empty-state">
          <h2>No flashcards found</h2>
          <p>
            {selectedCategory 
              ? `There are no cards in the "${selectedCategory}" category.` 
              : "You haven't created any flashcards yet."}
          </p>
          <p>Go to the Create tab to add some flashcards!</p>
        </div>
      </div>
    );
  }
  
  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
    setShowAnswer(false);
  };
  
  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + filteredCards.length) % filteredCards.length);
    setShowAnswer(false);
  };
  
  const toggleAnswer = () => {
    if (!showAnswer) {
      incrementReviewed();
    }
    setShowAnswer(!showAnswer);
  };
  
  const handleConfidenceRating = (level: number) => {
    const cardId = filteredCards[currentCardIndex].id;
    updateCardConfidence(cardId, level);
    
    // Consider rating of 4-5 as "correct"
    if (level >= 4) {
      incrementCorrect();
    }
    
    // Move to next card
    setTimeout(handleNextCard, 300);
  };
  
  return (
    <div className="study-container">
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <Flashcard 
        card={filteredCards[currentCardIndex]}
        showAnswer={showAnswer}
        onFlip={toggleAnswer}
        onConfidenceRating={showAnswer ? handleConfidenceRating : undefined}
      />
      
      <div className="controls">
        <button 
          className="control-btn prev-btn" 
          onClick={handlePrevCard}
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
      
      <p className="card-counter">
        Card {currentCardIndex + 1} of {filteredCards.length}
      </p>
    </div>
  );
};

const Create: React.FC = () => {
  const { addCard, categories, addCategory } = useFlashcards();
  
  return (
    <div className="create-container">
      <CreateCardForm 
        categories={categories}
        onSubmit={addCard}
        onAddCategory={addCategory}
      />
    </div>
  );
};

const Stats: React.FC = () => {
  const { progress } = useProgress();
  const { cards, categories } = useFlashcards();
  
  // Calculate category statistics
  const categoryStats = categories.map(category => {
    const categoryCards = cards.filter(card => card.category === category.name);
    const avgConfidence = categoryCards.length > 0 
      ? categoryCards.reduce((sum, card) => sum + (card.confidenceLevel || 0), 0) / categoryCards.length
      : 0;
      
    return {
      name: category.name,
      count: categoryCards.length,
      color: category.color,
      avgConfidence: avgConfidence
    };
  });
  
  return (
    <div className="stats-container">
      <StatsDisplay progress={progress} />
      
      <div className="category-stats">
        <h3>Category Breakdown</h3>
        <div className="category-stats-grid">
          {categoryStats.map(stat => (
            <div 
              key={stat.name} 
              className="category-stat-card"
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <h4>{stat.name}</h4>
              <p><strong>{stat.count}</strong> cards</p>
              <p>
                <strong>Avg. confidence:</strong> {stat.avgConfidence.toFixed(1)}/5
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('study');
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    's': () => setActiveTab('study'),
    'c': () => setActiveTab('create'),
    't': () => setActiveTab('stats'),
    'arrowright': () => {
      if (activeTab === 'study') {
        const nextButton = document.querySelector('.next-btn') as HTMLButtonElement;
        nextButton?.click();
      }
    },
    'arrowleft': () => {
      if (activeTab === 'study') {
        const prevButton = document.querySelector('.prev-btn') as HTMLButtonElement;
        prevButton?.click();
      }
    },
    ' ': () => {
      if (activeTab === 'study') {
        const flipButton = document.querySelector('.flip-btn') as HTMLButtonElement;
        flipButton?.click();
      }
    }
  });
  
  return (
    <ThemeProvider>
      <FlashcardProvider>
        <ProgressProvider>
          <div className="app-container">
            <Header activeTab={activeTab} onChangeTab={setActiveTab} />
            
            <main className="main-content">
              <div className="tab-content">
                {activeTab === 'study' && <Study />}
                {activeTab === 'create' && <Create />}
                {activeTab === 'stats' && <Stats />}
              </div>
            </main>
            
            <div className="keyboard-shortcuts">
              <p>Keyboard shortcuts:</p>
              <p><kbd>S</kbd> Study mode | <kbd>C</kbd> Create | <kbd>T</kbd> Stats</p>
              <p><kbd>Space</kbd> Flip | <kbd>←</kbd> Prev | <kbd>→</kbd> Next</p>
            </div>
          </div>
        </ProgressProvider>
      </FlashcardProvider>
    </ThemeProvider>
  );
};

export default App;
