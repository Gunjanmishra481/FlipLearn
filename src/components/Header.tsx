import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Header.css';

interface HeaderProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onChangeTab }) => {
  const { mode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="logo">
        <h1>FlipLearn</h1>
      </div>
      
      <nav className="nav">
        <ul>
          <li>
            <button 
              className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
              onClick={() => onChangeTab('study')}
            >
              Study
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => onChangeTab('create')}
            >
              Create
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => onChangeTab('stats')}
            >
              Stats
            </button>
          </li>
        </ul>
      </nav>
      
      <button 
        className="theme-toggle" 
        onClick={toggleTheme} 
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
};

export default Header; 