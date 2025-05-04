import React from 'react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { useCalendar } from '../../context/CalendarContext';
import EventItem from '../EventItem';

const AgendaView: React.FC = () => {
  const { events, selectedDate } = useCalendar();
  
  // Get events for the next 14 days starting from selected date
  const getEventsInDateRange = () => {
    const endDate = addDays(selectedDate, 14);
    
    // Filter events that fall within the date range
    const eventsInRange = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= selectedDate && eventDate <= endDate;
    });
    
    // Group events by day
    const groupedEvents: Record<string, typeof events> = {};
    
    eventsInRange.forEach(event => {
      const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
      
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }
      
      groupedEvents[dateKey].push(event);
    });
    
    return groupedEvents;
  };
  
  const groupedEvents = getEventsInDateRange();
  const dateKeys = Object.keys(groupedEvents).sort();

  return (
    <div className="h-full overflow-y-auto">
      <div className="text-center py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
        <div className="text-sm font-semibold">
          Agenda: {format(selectedDate, 'MMM d')} - {format(addDays(selectedDate, 14), 'MMM d, yyyy')}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {dateKeys.length > 0 ? (
          dateKeys.map(dateKey => {
            const date = new Date(dateKey);
            const eventsForDay = groupedEvents[dateKey];
            
            return (
              <div key={dateKey} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div 
                  className={`
                    px-4 py-2 font-medium flex justify-between items-center
                    ${isSameDay(date, new Date()) 
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-50 dark:bg-gray-800'}
                  `}
                >
                  <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
                  <span className="text-sm">
                    {eventsForDay.length} event{eventsForDay.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {eventsForDay.map(event => (
                    <div key={event.id} className="p-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                      </div>
                      <EventItem event={event} agendaStyle />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No events scheduled in this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaView;