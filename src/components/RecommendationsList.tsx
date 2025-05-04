import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, LightbulbIcon } from 'lucide-react';
import { TimeRecommendation } from '../types';

interface RecommendationsListProps {
  recommendations: TimeRecommendation[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
        <div className="flex items-center justify-center py-4">
          <LightbulbIcon size={18} className="mr-2 text-yellow-500" />
          <span>Recommendations will appear as you use the calendar</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <div 
          key={index}
          className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md"
        >
          <div className="flex items-start">
            <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-md mr-2">
              <LightbulbIcon size={14} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-xs flex items-center mb-1">
                <Calendar size={12} className="mr-1 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {format(new Date(rec.date), 'E, MMM d')}
                </span>
                <span className="mx-1">•</span>
                <Clock size={12} className="mr-1 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {format(new Date().setHours(rec.startHour, 0), 'h a')} - {format(new Date().setHours(rec.endHour, 0), 'h a')}
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-200">{rec.reason}</p>
            </div>
          </div>
          <div className="mt-2 text-right">
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Create event
            </button>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center">
          <span>View all recommendations</span>
        </button>
      </div>
    </div>
  );
};

export default RecommendationsList;