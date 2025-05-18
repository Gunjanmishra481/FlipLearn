import React from 'react';
import { Category } from '../types';
import { useFlashcards } from '../contexts/FlashcardContext';
import '../styles/CategoryFilter.css';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { loadMoreCards, isLoading } = useFlashcards();

  const handleLoadMore = async () => {
    if (selectedCategory) {
      await loadMoreCards(selectedCategory);
    }
  };

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="category-buttons">
        <button 
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        
        {categories.map(category => (
          <button 
            key={category.id}
            className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
            style={{ 
              backgroundColor: selectedCategory === category.name ? category.color : 'transparent',
              borderColor: category.color,
              color: selectedCategory === category.name ? 'white' : category.color
            }}
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="load-more-container">
          <button 
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Cards'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 