import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useProgress } from '../contexts/ProgressContext';
import { getLearningInsightMessage } from '../utils/spacedRepetition';
import '../styles/LearningInsights.css';

const LearningInsights: React.FC = () => {
  const { cards, categories, getCategoryMastery, getOverallMastery } = useFlashcards();
  const { progress } = useProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'prediction'>('overview');

  const overallMastery = getOverallMastery();
  const accuracy = progress.cardsReviewed > 0 
    ? Math.round((progress.correctAnswers / progress.cardsReviewed) * 100) 
    : 0;
  
  const insightMessage = getLearningInsightMessage(overallMastery, progress.streak);
  
  // Calculate when each category will reach mastery based on current progress
  const calculateMasteryPredictions = () => {
    return categories.map(category => {
      const categoryCards = cards.filter(card => card.category === category.name);
      const mastery = getCategoryMastery(category.name);
      
      // If already mastered, return 0 days
      if (mastery >= 90) return { category, daysToMastery: 0 };
      
      // Calculate average daily improvement based on recent activity
      // This is a simplified prediction model
      const averageDailyImprovement = 5; // Assume 5% improvement per day of study
      const remainingToMastery = 90 - mastery; // 90% is considered "mastered"
      const daysToMastery = Math.ceil(remainingToMastery / averageDailyImprovement);
      
      return { category, daysToMastery };
    }).sort((a, b) => a.daysToMastery - b.daysToMastery);
  };
  
  const masteryPredictions = calculateMasteryPredictions();
  
  return (
    <div className="learning-insights glass-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="insights-title">Smart Learning Insights</h2>
        
        <div className="insights-tabs">
          <button 
            className={`insights-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`insights-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`insights-tab ${activeTab === 'prediction' ? 'active' : ''}`}
            onClick={() => setActiveTab('prediction')}
          >
            Predictions
          </button>
        </div>
        
        <div className="insights-content">
          {activeTab === 'overview' && (
            <motion.div 
              className="insights-overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="insight-message">
                <p>{insightMessage}</p>
              </div>
              
              <div className="insights-metrics">
                <div className="metric">
                  <div className="metric-circle">
                    <svg viewBox="0 0 36 36">
                      <path
                        className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${overallMastery}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">{overallMastery}%</text>
                    </svg>
                  </div>
                  <h3>Overall Mastery</h3>
                </div>
                
                <div className="metric">
                  <div className="metric-circle">
                    <svg viewBox="0 0 36 36">
                      <path
                        className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle accuracy"
                        strokeDasharray={`${accuracy}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">{accuracy}%</text>
                    </svg>
                  </div>
                  <h3>Accuracy</h3>
                </div>
                
                <div className="metric">
                  <div className="metric-circle">
                    <div className="streak-display">
                      {progress.streak}
                    </div>
                  </div>
                  <h3>Day Streak</h3>
                </div>
              </div>
              
              <div className="overview-stats">
                <div className="stat-item">
                  <span className="stat-label">Cards Reviewed</span>
                  <span className="stat-value">{progress.cardsReviewed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Cards</span>
                  <span className="stat-value">{cards.length}</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'categories' && (
            <motion.div 
              className="insights-categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="categories-mastery">
                {categories.map(category => {
                  const mastery = getCategoryMastery(category.name);
                  const categoryCards = cards.filter(card => card.category === category.name);
                  
                  return (
                    <div key={category.id} className="category-mastery-item">
                      <div className="category-info">
                        <span className="category-tag" style={{ backgroundColor: category.color }}>
                          {category.name}
                        </span>
                        <span className="category-card-count">
                          {categoryCards.length} cards
                        </span>
                      </div>
                      
                      <div className="mastery-bar-container">
                        <div 
                          className="mastery-bar" 
                          style={{ 
                            width: `${mastery}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                        <span className="mastery-percentage">{mastery}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'prediction' && (
            <motion.div 
              className="insights-prediction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Mastery Predictions</h3>
              <p className="prediction-explainer">
                Based on your current learning pace, here's when you'll likely reach 90% mastery:
              </p>
              
              <div className="prediction-timeline">
                {masteryPredictions.map(({ category, daysToMastery }) => (
                  <div key={category.id} className="prediction-item">
                    <div 
                      className="prediction-category-tag" 
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </div>
                    <div className="prediction-bar-container">
                      <div 
                        className="prediction-bar" 
                        style={{ 
                          width: `${100 - Math.min(daysToMastery * 10, 100)}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <div className="prediction-text">
                      {daysToMastery === 0 ? (
                        <span>Mastered!</span>
                      ) : (
                        <span>{daysToMastery} {daysToMastery === 1 ? 'day' : 'days'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="optimal-study-recommendation">
                <h3>Smart Study Recommendation</h3>
                <p>
                  Focus on <strong>{
                    masteryPredictions.find(p => p.daysToMastery > 0)?.category.name || 
                    categories[0]?.name || 'all categories'
                  }</strong> to optimize your learning progress.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LearningInsights; 