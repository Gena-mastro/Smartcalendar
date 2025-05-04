import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventType, TimeRecommendation, UserPreferences } from '../types';
import { generateMockEvents } from '../utils/mockData';
import { analyzeTimePatterns } from '../utils/analytics';

interface CalendarContextType {
  events: EventType[];
  addEvent: (event: EventType) => void;
  updateEvent: (event: EventType) => void;
  deleteEvent: (id: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  recommendations: TimeRecommendation[];
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  startOfWeek: 1, // Monday
  defaultView: 'month',
  workingHours: {
    start: 9,
    end: 17,
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  },
  notifications: {
    enabled: true,
    reminderDefaults: [15, 30, 60, 1440], // 15min, 30min, 1hr, 1day
    email: true,
    push: true,
  },
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [recommendations, setRecommendations] = useState<TimeRecommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load mock data on initial render
  useEffect(() => {
    const mockEvents = generateMockEvents(20);
    setEvents(mockEvents);
  }, []);

  // Generate recommendations based on events
  useEffect(() => {
    if (events.length > 0) {
      const newRecommendations = analyzeTimePatterns(events);
      setRecommendations(newRecommendations);
    }
  }, [events]);

  const addEvent = (event: EventType) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: EventType) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences({
      ...userPreferences,
      ...preferences
    });
  };

  return (
    <CalendarContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      selectedDate,
      setSelectedDate,
      recommendations,
      userPreferences,
      updateUserPreferences
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};