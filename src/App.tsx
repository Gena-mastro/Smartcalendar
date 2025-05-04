import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import { CalendarViewType, EventType } from './types';
import { CalendarProvider } from './context/CalendarContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarViewType>('month');
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <CalendarProvider>
          <div className="flex flex-col h-screen">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center px-4 py-3">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SmartCalendar</h1>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              </div>
              <CalendarHeader 
                currentView={currentView} 
                onViewChange={setCurrentView} 
              />
            </header>
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <CalendarView view={currentView} />
              </main>
            </div>
          </div>
        </CalendarProvider>
      </div>
    </div>
  );
}

export default App;