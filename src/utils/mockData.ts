import { EventType, TimeRecommendation } from '../types';
import { addDays, addHours, subDays, startOfDay } from 'date-fns';

// Array of event titles for mock data
const eventTitles = [
  'Team Meeting',
  'Project Review',
  'Client Call',
  'Lunch Break',
  'Doctor Appointment',
  'Gym Session',
  'Coffee with Alex',
  'Presentation Prep',
  'Weekly Standup',
  'Dentist Appointment',
  'Budget Planning',
  'Code Review',
  'UI Design Workshop',
  'Marketing Strategy',
  'Team Building',
];

// Array of event locations for mock data
const eventLocations = [
  'Meeting Room A',
  'Office',
  'Zoom Call',
  'Downtown Cafe',
  'Medical Center',
  'Home Office',
  'Conference Room',
  'Google Meet',
  null,
];

// Array of event colors for mock data
const eventColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#F59E0B', // Amber
];

/**
 * Generate a random time between 8am and 6pm
 */
const getRandomHour = (minHour = 8, maxHour = 18) => {
  return Math.floor(Math.random() * (maxHour - minHour)) + minHour;
};

/**
 * Generate a random date within ±15 days from today
 */
const getRandomDate = () => {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) - 15;
  return addDays(today, daysToAdd);
};

/**
 * Generate a random event
 */
const generateRandomEvent = (index: number): EventType => {
  const startDate = getRandomDate();
  const startHour = getRandomHour();
  
  // Set start time
  startDate.setHours(startHour, 0, 0, 0);
  
  // Calculate end time (1-2 hours after start)
  const duration = Math.random() > 0.7 ? 2 : 1;
  const endDate = addHours(startDate, duration);
  
  // Generate a random event
  return {
    id: `event-${index}`,
    title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
    start: startDate,
    end: endDate,
    location: Math.random() > 0.3 ? eventLocations[Math.floor(Math.random() * eventLocations.length)] : undefined,
    color: eventColors[Math.floor(Math.random() * eventColors.length)],
    isRecurring: Math.random() > 0.8,
    description: Math.random() > 0.7 ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam.' : undefined,
  };
};

/**
 * Generate a list of mock events
 */
export const generateMockEvents = (count: number): EventType[] => {
  return Array.from({ length: count }, (_, i) => generateRandomEvent(i));
};

/**
 * Generate mock recommendations
 */
export const generateMockRecommendations = (): TimeRecommendation[] => {
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);
  const nextWeek = addDays(new Date(), 7);
  
  return [
    {
      date: tomorrow,
      startHour: 10,
      endHour: 12,
      confidence: 0.87,
      reason: 'You tend to be most productive during mornings on weekdays',
    },
    {
      date: dayAfterTomorrow,
      startHour: 14,
      endHour: 16,
      confidence: 0.75,
      reason: 'This time slot has been your most focused period on Thursdays',
    },
    {
      date: nextWeek,
      startHour: 9,
      endHour: 11,
      confidence: 0.92,
      reason: 'Best slot for deep work based on your productivity patterns',
    },
  ];
};