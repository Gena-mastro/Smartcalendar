import { EventType, TimeRecommendation, TimeBlock } from '../types';
import { addDays, getDay, getHours, isSameDay, startOfDay, format } from 'date-fns';

/**
 * Analyze time patterns to generate productivity recommendations
 * This is a simplified version of what would be a more complex ML algorithm
 */
export const analyzeTimePatterns = (events: EventType[]): TimeRecommendation[] => {
  // In a real app, this would use actual user data + ML models
  // For demo purposes, we'll use some basic heuristics
  
  // Mock historical data about when the user is most productive
  const productiveTimeBlocks: TimeBlock[] = [
    { id: '1', date: new Date(), startHour: 9, endHour: 11, productivity: 9, focus: 8, energy: 9 },
    { id: '2', date: new Date(), startHour: 15, endHour: 17, productivity: 7, focus: 8, energy: 6 },
    { id: '3', date: addDays(new Date(), -1), startHour: 10, endHour: 12, productivity: 8, focus: 9, energy: 8 },
  ];
  
  // Find pattern of most productive days
  const dayOfWeekCounts = Array(7).fill(0);
  const hourProductivity = Array(24).fill(0);
  const hourCounts = Array(24).fill(0);
  
  // Count occurrences of events on each day and hour
  // In a real app, this would analyze completion status, focus levels, etc.
  events.forEach(event => {
    const eventDate = new Date(event.start);
    const day = getDay(eventDate);
    const hour = getHours(eventDate);
    
    dayOfWeekCounts[day]++;
    hourProductivity[hour] += productiveTimeBlocks.some(block => 
      hour >= block.startHour && hour < block.endHour && 
      block.productivity > 7
    ) ? 1 : 0;
    hourCounts[hour]++;
  });
  
  // Find the most productive day of the week
  const mostProductiveDay = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
  
  // Find the most productive hours
  let mostProductiveHourStart = 9; // Default to 9am if no data
  let mostProductiveHourEnd = 11; // Default to 11am if no data
  
  for (let i = 0; i < 24; i++) {
    if (hourCounts[i] > 0 && hourProductivity[i] / hourCounts[i] > 0.7) {
      mostProductiveHourStart = i;
      mostProductiveHourEnd = Math.min(i + 2, 23);
      break;
    }
  }
  
  // Generate recommendations based on patterns
  const recommendations: TimeRecommendation[] = [];
  
  // Find the next occurrence of the most productive day
  let nextProductiveDay = new Date();
  while (getDay(nextProductiveDay) !== mostProductiveDay) {
    nextProductiveDay = addDays(nextProductiveDay, 1);
  }
  
  // Check for existing events at the recommended time
  const hasConflict = events.some(event => 
    isSameDay(new Date(event.start), nextProductiveDay) && 
    getHours(new Date(event.start)) >= mostProductiveHourStart &&
    getHours(new Date(event.start)) < mostProductiveHourEnd
  );
  
  // Only add recommendation if there's no conflict
  if (!hasConflict) {
    recommendations.push({
      date: nextProductiveDay,
      startHour: mostProductiveHourStart,
      endHour: mostProductiveHourEnd,
      confidence: 0.85,
      reason: `You're most productive on ${format(nextProductiveDay, 'EEEE')}s between ${mostProductiveHourStart}:00 and ${mostProductiveHourEnd}:00`,
    });
  }
  
  // Add a second recommendation for a different day
  const alternativeDay = (mostProductiveDay + 2) % 7;
  let nextAlternativeDay = new Date();
  while (getDay(nextAlternativeDay) !== alternativeDay) {
    nextAlternativeDay = addDays(nextAlternativeDay, 1);
  }
  
  recommendations.push({
    date: nextAlternativeDay,
    startHour: 14,
    endHour: 16,
    confidence: 0.7,
    reason: 'Based on your focus patterns, this time slot may be good for deep work',
  });
  
  return recommendations;
};

/**
 * Detect conflicting events and suggest alternative times
 */
export const detectConflicts = (events: EventType[], newEvent: EventType): Date[] => {
  // Find all events that overlap with the new event
  const conflicts = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const newEventStart = new Date(newEvent.start);
    const newEventEnd = new Date(newEvent.end);
    
    return (
      (newEventStart >= eventStart && newEventStart < eventEnd) ||
      (newEventEnd > eventStart && newEventEnd <= eventEnd) ||
      (newEventStart <= eventStart && newEventEnd >= eventEnd)
    );
  });
  
  // If no conflicts, return empty array
  if (conflicts.length === 0) {
    return [];
  }
  
  // Otherwise, suggest alternative times
  const suggestions: Date[] = [];
  const eventDuration = new Date(newEvent.end).getTime() - new Date(newEvent.start).getTime();
  
  // Try the same day, different hours
  const baseDate = startOfDay(new Date(newEvent.start));
  
  // Check morning slot (9-11 am)
  const morningStart = new Date(baseDate);
  morningStart.setHours(9, 0, 0, 0);
  const morningEnd = new Date(morningStart.getTime() + eventDuration);
  
  if (!hasConflict(events, morningStart, morningEnd)) {
    suggestions.push(morningStart);
  }
  
  // Check afternoon slot (2-4 pm)
  const afternoonStart = new Date(baseDate);
  afternoonStart.setHours(14, 0, 0, 0);
  const afternoonEnd = new Date(afternoonStart.getTime() + eventDuration);
  
  if (!hasConflict(events, afternoonStart, afternoonEnd)) {
    suggestions.push(afternoonStart);
  }
  
  // Check next day, same time
  const nextDayStart = addDays(new Date(newEvent.start), 1);
  const nextDayEnd = new Date(nextDayStart.getTime() + eventDuration);
  
  if (!hasConflict(events, nextDayStart, nextDayEnd)) {
    suggestions.push(nextDayStart);
  }
  
  return suggestions;
};

/**
 * Check if a proposed time slot conflicts with existing events
 */
const hasConflict = (events: EventType[], start: Date, end: Date): boolean => {
  return events.some(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    return (
      (start >= eventStart && start < eventEnd) ||
      (end > eventStart && end <= eventEnd) ||
      (start <= eventStart && end >= eventEnd)
    );
  });
};