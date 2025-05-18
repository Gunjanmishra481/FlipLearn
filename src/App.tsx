import React, { useState } from 'react';
import './App.css';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

function App() {
  const [cards] = useState<Flashcard[]>([
    { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces" },
    { id: 2, question: "What is TypeScript?", answer: "A strongly typed programming language that builds on JavaScript" },
    { id: 3, question: "What is JSX?", answer: "A syntax extension for JavaScript that looks similar to HTML" }
  ]);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setShowAnswer(false);
  };
  
  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setShowAnswer(false);
  };
  
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Flashcard Engine</h1>
        <div className="flashcard" onClick={toggleAnswer}>
          <h2>{showAnswer ? 'Answer:' : 'Question:'}</h2>
          <p>{showAnswer ? cards[currentCardIndex].answer : cards[currentCardIndex].question}</p>
          <p className="hint">(Click card to flip)</p>
        </div>
        <div className="controls">
          <button onClick={handlePrevCard}>Previous</button>
          <button onClick={toggleAnswer}>Flip</button>
          <button onClick={handleNextCard}>Next</button>
        </div>
        <p className="card-counter">
          Card {currentCardIndex + 1} of {cards.length}
        </p>
      </header>
    </div>
  );
}

export default App;
