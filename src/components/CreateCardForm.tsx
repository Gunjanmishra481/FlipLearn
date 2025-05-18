import React, { useState } from 'react';
import { Category } from '../types';
import '../styles/CreateCardForm.css';

interface CreateCardFormProps {
  categories: Category[];
  onSubmit: (card: {
    question: string;
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => void;
  onAddCategory: (category: { name: string; color: string }) => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ 
  categories, 
  onSubmit,
  onAddCategory
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4a90e2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim() && category) {
      onSubmit({
        question,
        answer,
        category,
        difficulty
      });
      // Reset form
      setQuestion('');
      setAnswer('');
      setDifficulty('medium');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName,
        color: newCategoryColor
      });
      setCategory(newCategoryName);
      setNewCategoryName('');
      setShowCategoryForm(false);
    }
  };

  return (
    <div className="create-card-form">
      <h2>Create New Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Enter your question..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Enter the answer..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <div className="category-select-container">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                className="add-category-btn"
                onClick={() => setShowCategoryForm(!showCategoryForm)}
              >
                {showCategoryForm ? 'Cancel' : '+ Add Category'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {showCategoryForm && (
          <div className="new-category-form">
            <h3>Add New Category</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newCategoryName">Name:</label>
                <input
                  type="text"
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  placeholder="Category name..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="newCategoryColor">Color:</label>
                <input
                  type="color"
                  id="newCategoryColor"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="button"
              className="add-category-submit"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>
        )}

        <button type="submit" className="create-card-btn">Create Flashcard</button>
      </form>
    </div>
  );
};

export default CreateCardForm; 