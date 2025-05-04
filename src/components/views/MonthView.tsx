import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  parseISO
} from 'date-fns';
import { useCalendar } from '../../context/CalendarContext';
import { EventType } from '../../types';
import EventItem from '../EventItem';
import EventForm from '../EventForm';

const MonthView: React.FC = () => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    // Get days for the current month view (including days from prev/next month to fill the grid)
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // End on Sunday
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setDaysInMonth(days);
  }, [selectedDate]);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.start.toString()), day));
  };

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleDragStart = (event: React.DragEvent, eventId: string) => {
    event.dataTransfer.setData('eventId', eventId);
  };

  const handleDrop = (event: React.DragEvent, date: Date) => {
    const eventId = event.dataTransfer.getData('eventId');
    // In a real app, update the event's date/time
    console.log(`Moving event ${eventId} to ${format(date, 'yyyy-MM-dd')}`);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 text-sm border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {weekdays.map(day => (
          <div 
            key={day} 
            className="py-2 text-center font-semibold text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-6 h-full">
        {daysInMonth.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelectedDay = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={i}
              onClick={() => handleDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
              className={`
                border border-gray-200 dark:border-gray-700 min-h-[100px] 
                ${isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} 
                ${isSelectedDay ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900' : ''}
                overflow-y-auto p-1
              `}
            >
              <div 
                className={`text-right p-1 ${
                  isToday(day) 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-7 h-7 ml-auto flex items-center justify-center' 
                    : ''
                } ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}`}
              >
                {format(day, 'd')}
              </div>
              
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <EventItem event={event} compact />
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {showEventForm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <EventForm 
              event={selectedEvent} 
              onClose={() => setShowEventForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthView;