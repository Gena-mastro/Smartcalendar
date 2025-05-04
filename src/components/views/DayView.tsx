import React from 'react';
import {
  format,
  startOfDay,
  addHours,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { useCalendar } from '../../context/CalendarContext';
import EventItem from '../EventItem';

const DayView: React.FC = () => {
  const { events, selectedDate, userPreferences } = useCalendar();
  
  // Get working hours based on user preferences
  const { start: workingHoursStart, end: workingHoursEnd } = userPreferences.workingHours;
  
  // Generate time slots for the day
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  // Find events for a specific hour
  const getEventsForHour = (hour: number) => {
    const slotStart = addHours(startOfDay(selectedDate), hour);
    const slotEnd = addHours(startOfDay(selectedDate), hour + 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return isWithinInterval(slotStart, { start: eventStart, end: eventEnd }) ||
             isWithinInterval(slotEnd, { start: eventStart, end: eventEnd }) ||
             (eventStart >= slotStart && eventEnd <= slotEnd);
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="text-center py-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">{format(selectedDate, 'EEEE')}</div>
        <div className="text-sm font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</div>
      </div>
      
      <div className="flex flex-col">
        {timeSlots.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const isWorkingHour = hour >= workingHoursStart && hour < workingHoursEnd;
          
          return (
            <div 
              key={hour} 
              className={`
                flex border-b border-gray-200 dark:border-gray-700 min-h-[80px]
                ${isWorkingHour ? 'bg-gray-50 dark:bg-gray-800' : ''}
              `}
            >
              <div className="w-20 px-2 py-2 text-right text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                {format(addHours(startOfDay(new Date()), hour), 'h:mm a')}
              </div>
              
              <div className="flex-1 p-1 relative">
                {hourEvents.length > 0 ? (
                  <div className="space-y-1">
                    {hourEvents.map(event => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;