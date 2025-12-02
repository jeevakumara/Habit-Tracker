import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTrackerStore } from './store/useTrackerStore';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Toast from './components/Toast';
import './index.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTrackerStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-gradient">
              90-Day Tracker
            </Link>
            <div className="flex gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-premium font-medium transition-all ${isActive('/')
                    ? 'bg-primary-500 text-white shadow-premium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className={`px-4 py-2 rounded-premium font-medium transition-all ${isActive('/analytics')
                    ? 'bg-primary-500 text-white shadow-premium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
              >
                Analytics
              </Link>
              <Link
                to="/settings"
                className={`px-4 py-2 rounded-premium font-medium transition-all ${isActive('/settings')
                    ? 'bg-primary-500 text-white shadow-premium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
              >
                Settings
              </Link>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-premium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const { isDarkMode } = useTrackerStore();

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Toast />
        </div>
      </div>
    </Router>
  );
};

export default App;
