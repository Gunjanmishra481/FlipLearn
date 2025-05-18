import React from 'react';
import { UserProgress } from '../types';
import '../styles/StatsDisplay.css';

interface StatsDisplayProps {
  progress: UserProgress;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ progress }) => {
  const calculateAccuracy = (): number => {
    if (progress.cardsReviewed === 0) return 0;
    return Math.round((progress.correctAnswers / progress.cardsReviewed) * 100);
  };

  return (
    <div className="stats-display">
      <h3>Your Progress</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{progress.cardsReviewed}</div>
          <div className="stat-label">Cards Reviewed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{calculateAccuracy()}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>
      
      {progress.lastStudySession && (
        <div className="last-session">
          Last session: {new Date(progress.lastStudySession).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default StatsDisplay; 