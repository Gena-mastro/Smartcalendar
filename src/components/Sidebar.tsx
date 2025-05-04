import React, { useState } from 'react';
import { Plus, ChevronDown, Clock, Settings, Users, Tag, ChevronUp, BarChart2 } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import EventForm from './EventForm';
import RecommendationsList from './RecommendationsList';

const Sidebar: React.FC = () => {
  const { recommendations } = useCalendar();
  const [showEventForm, setShowEventForm] = useState(false);
  const [activeSections, setActiveSections] = useState({
    recommendations: true,
    smartAnalytics: false,
    settings: false
  });

  const toggleSection = (section: keyof typeof activeSections) => {
    setActiveSections({
      ...activeSections,
      [section]: !activeSections[section]
    });
  };

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hidden md:block overflow-y-auto">
      <div className="p-4">
        <button
          onClick={() => setShowEventForm(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 flex items-center justify-center transition-colors"
        >
          <Plus size={16} className="mr-2" />
          <span>Create Event</span>
        </button>

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <EventForm onClose={() => setShowEventForm(false)} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <button
            onClick={() => toggleSection('recommendations')}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Smart Recommendations</span>
            </div>
            {activeSections.recommendations ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          
          {activeSections.recommendations && (
            <div className="pl-6 mb-4 text-sm">
              <RecommendationsList recommendations={recommendations} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <button
            onClick={() => toggleSection('smartAnalytics')}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <div className="flex items-center">
              <BarChart2 size={16} className="mr-2 text-green-500 dark:text-green-400" />
              <span className="font-medium">Smart Analytics</span>
            </div>
            {activeSections.smartAnalytics ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          
          {activeSections.smartAnalytics && (
            <div className="pl-6 mb-4 text-sm">
              <div className="mb-2 text-gray-600 dark:text-gray-400">
                <p>Most productive day: <span className="font-medium text-gray-900 dark:text-gray-100">Tuesday</span></p>
                <p>Best focus time: <span className="font-medium text-gray-900 dark:text-gray-100">9:00 - 11:00 AM</span></p>
              </div>
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                View detailed analytics
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center">
              <Settings size={16} className="mr-2 text-gray-500" />
              <span className="font-medium">Settings</span>
            </div>
            {activeSections.settings ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          
          {activeSections.settings && (
            <div className="pl-6 mt-2 text-sm">
              <button className="flex items-center py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                <Users size={14} className="mr-2" />
                Manage Participants
              </button>
              <button className="flex items-center py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                <Tag size={14} className="mr-2" />
                Manage Categories
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;