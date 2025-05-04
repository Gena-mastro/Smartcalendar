import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  LayoutList, 
  Menu
} from 'lucide-react';
import { CalendarViewType } from '../types';
import { useCalendar } from '../context/CalendarContext';
import { format, addMonths, addWeeks, addDays, startOfMonth, startOfWeek, startOfDay } from 'date-fns';

interface CalendarHeaderProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentView, onViewChange }) => {
  const { selectedDate, setSelectedDate } = useCalendar();

  const handlePrevious = () => {
    switch (currentView) {
      case 'month':
        setSelectedDate(addMonths(selectedDate, -1));
        break;
      case 'week':
        setSelectedDate(addWeeks(selectedDate, -1));
        break;
      case 'day':
        setSelectedDate(addDays(selectedDate, -1));
        break;
      case 'agenda':
        // Navigate to previous week in agenda view
        setSelectedDate(addWeeks(selectedDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case 'month':
        setSelectedDate(addMonths(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case 'day':
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case 'agenda':
        // Navigate to next week in agenda view
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'agenda':
        return 'Agenda';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2 sm:mb-0">
        <button 
          onClick={handleToday}
          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md mr-3 transition-colors"
        >
          Today
        </button>
        <button 
          onClick={handlePrevious}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-1 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-3 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
        <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
      </div>
      
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
        <button 
          onClick={() => onViewChange('month')}
          className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
            currentView === 'month' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Month view"
        >
          <CalendarIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">Month</span>
        </button>
        <button 
          onClick={() => onViewChange('week')}
          className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
            currentView === 'week' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Week view"
        >
          <LayoutGrid size={16} className="mr-1" />
          <span className="hidden sm:inline">Week</span>
        </button>
        <button 
          onClick={() => onViewChange('day')}
          className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
            currentView === 'day' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Day view"
        >
          <Menu size={16} className="mr-1" />
          <span className="hidden sm:inline">Day</span>
        </button>
        <button 
          onClick={() => onViewChange('agenda')}
          className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
            currentView === 'agenda' 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Agenda view"
        >
          <LayoutList size={16} className="mr-1" />
          <span className="hidden sm:inline">Agenda</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;