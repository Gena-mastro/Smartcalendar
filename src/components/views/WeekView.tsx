import React from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addHours,
  isWithinInterval,
  isSameDay,
  parseISO
} from 'date-fns';
import { useCalendar } from '../../context/CalendarContext';
import EventItem from '../EventItem';
import { EventType } from '../../types';

const WeekView: React.FC = () => {
  const { events, selectedDate, userPreferences } = useCalendar();
  
  // Get days of the current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: userPreferences.startOfWeek });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: userPreferences.startOfWeek });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get working hours based on user preferences
  const { start: workingHoursStart, end: workingHoursEnd } = userPreferences.workingHours;
  
  // Generate time slots for the day
  const workingHours = Array.from({ length: 24 }, (_, i) => i);
  
  // Find events for a specific day and hour
  const getEventsForSlot = (day: Date, hour: number) => {
    const slotStart = addHours(startOfDay(day), hour);
    const slotEnd = addHours(startOfDay(day), hour + 1);
    
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
      <div className="sticky top-0 z-10 grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-r border-gray-200 dark:border-gray-700 px-2 py-3"></div>
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className="text-center py-3 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'EEE')}</div>
            <div className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-8">
        {workingHours.map(hour => (
          <React.Fragment key={hour}>
            <div 
              className={`
                border-r border-b border-gray-200 dark:border-gray-700 px-2 py-3 text-right text-xs text-gray-500 dark:text-gray-400
                ${hour >= workingHoursStart && hour < workingHoursEnd ? 'bg-gray-50 dark:bg-gray-800' : ''}
              `}
            >
              {format(addHours(startOfDay(new Date()), hour), 'h a')}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const slotEvents = getEventsForSlot(day, hour);
              
              return (
                <div 
                  key={dayIndex}
                  className={`
                    relative border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[60px]
                    ${hour >= workingHoursStart && hour < workingHoursEnd ? 'bg-gray-50 dark:bg-gray-800' : ''}
                  `}
                >
                  {slotEvents.map(event => (
                    <div key={event.id} className="absolute inset-x-0 m-1 z-10">
                      <EventItem event={event} compact />
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeekView;