/**
 * Spaced repetition algorithm utility functions
 * Based on a simplified version of the SuperMemo-2 algorithm
 */

/**
 * Calculate the next review date based on confidence level and review count
 * @param confidenceLevel - User confidence level (1-5)
 * @param reviewCount - Number of times the card has been reviewed
 * @returns Date - When to next review this card
 */
export const calculateNextReviewDate = (confidenceLevel: number, reviewCount: number = 0): Date => {
  // Base interval in days based on confidence level
  let interval: number;
  
  // Determine base interval
  if (confidenceLevel <= 2) {
    // If user has low confidence, review again soon (same day)
    interval = 0.25; // 6 hours
  } else if (confidenceLevel === 3) {
    // Medium confidence
    interval = 1; // 1 day
  } else if (confidenceLevel === 4) {
    // Good confidence
    interval = 3; // 3 days
  } else {
    // Excellent confidence
    interval = 7; // 1 week
  }
  
  // Adjust interval based on review count (more reviews = longer intervals)
  const reviewMultiplier = Math.min(1 + (reviewCount * 0.5), 5);
  interval = interval * reviewMultiplier;
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + Math.round(interval));
  
  return nextReviewDate;
};

/**
 * Determines if a card is due for review
 * @param nextReviewDate - The scheduled review date
 * @returns boolean - Whether the card should be reviewed now
 */
export const isDueForReview = (nextReviewDate?: Date): boolean => {
  if (!nextReviewDate) return true; // If no date set, it's due for review
  
  const now = new Date();
  return now >= nextReviewDate;
};

/**
 * Calculates card priority for review
 * Higher priority = should be reviewed sooner
 * @param card - The flashcard to evaluate
 * @returns number - Priority score (higher = more urgent)
 */
export const calculateReviewPriority = (
  confidenceLevel: number = 0, 
  lastReviewed?: Date, 
  nextReviewDate?: Date
): number => {
  // Start with base priority based on confidence (lower confidence = higher priority)
  let priority = 5 - (confidenceLevel || 0);
  
  // If it's past the next review date, increase priority
  if (nextReviewDate && new Date() > nextReviewDate) {
    const daysOverdue = (new Date().getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24);
    priority += Math.min(daysOverdue * 2, 10); // Cap at +10 priority
  }
  
  // If never reviewed, give high priority
  if (!lastReviewed) {
    priority += 3;
  }
  
  return priority;
};

/**
 * Calculate mastery level for a category based on card confidence levels
 * @param cards - Array of flashcards in the category
 * @returns number - Mastery percentage (0-100)
 */
export const calculateCategoryMastery = (
  cards: { confidenceLevel?: number }[]
): number => {
  if (cards.length === 0) return 0;
  
  const totalPossiblePoints = cards.length * 5; // Maximum points if all cards are at confidence level 5
  const totalPoints = cards.reduce((sum, card) => sum + (card.confidenceLevel || 0), 0);
  
  return Math.round((totalPoints / totalPossiblePoints) * 100);
};

/**
 * Get a personalized message based on learning progress
 * @param masteryPercentage - Current mastery percentage
 * @param streak - Current study streak
 * @returns string - Motivational message
 */
export const getLearningInsightMessage = (
  masteryPercentage: number,
  streak: number
): string => {
  if (masteryPercentage >= 90) {
    return "Exceptional mastery! You're an expert at this material.";
  } else if (masteryPercentage >= 70) {
    return "Great progress! You're well on your way to mastering this topic.";
  } else if (masteryPercentage >= 50) {
    return "Solid understanding. Keep practicing to reinforce your knowledge.";
  } else if (masteryPercentage >= 30) {
    return "You're making progress! Regular review will help strengthen these concepts.";
  } else {
    return "Keep going! Every study session builds your knowledge foundation.";
  }
}; 