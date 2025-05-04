import { addWeeks, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CourseRecommendation, UserPreferences, EventType } from '../types';

export const analyzeCourseSchedule = (
  totalHours: number,
  startDate: Date,
  endDate: Date,
  userPreferences: UserPreferences,
  existingEvents: EventType[]
): CourseRecommendation => {
  const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const recommendedWeeklyHours = Math.ceil(totalHours / totalWeeks);
  
  // Analizar días preferidos del usuario
  const preferredDays = userPreferences.studyPreferences?.preferredStudyDays || [1, 2, 3, 4, 5];
  const maxDailyHours = userPreferences.studyPreferences?.maxDailyStudyHours || 2;
  
  // Calcular días recomendados basados en la carga existente
  const daysLoad = new Array(7).fill(0);
  existingEvents.forEach(event => {
    const day = event.start.getDay();
    const hours = (event.end.getTime() - event.start.getTime()) / (60 * 60 * 1000);
    daysLoad[day] += hours;
  });
  
  // Encontrar los mejores días basados en la carga actual
  const recommendedDays = preferredDays
    .sort((a, b) => daysLoad[a] - daysLoad[b])
    .slice(0, Math.ceil(recommendedWeeklyHours / maxDailyHours));
  
  // Convertir números de días a nombres en español
  const dayNames = recommendedDays.map(day => 
    format(addDays(new Date(), day), 'EEEE', { locale: es })
  );
  
  // Determinar horarios recomendados
  const recommendedTimes = userPreferences.studyPreferences?.preferredStudyTimes || ['mañana'];
  
  // Calcular fecha estimada de finalización
  const estimatedWeeks = Math.ceil(totalHours / recommendedWeeklyHours);
  const estimatedCompletionDate = addWeeks(startDate, estimatedWeeks);
  
  return {
    weeklyHours: recommendedWeeklyHours,
    recommendedDays: dayNames,
    recommendedTimes: recommendedTimes,
    estimatedCompletionDate,
    reason: `Para completar el curso de ${totalHours} horas en ${totalWeeks} semanas, ` +
           `te recomendamos dedicar ${recommendedWeeklyHours} horas por semana. ` +
           `Los mejores días para estudiar son ${dayNames.join(', ')} ` +
           `durante la ${recommendedTimes.join(' o ')}. ` +
           `Con este ritmo, terminarías el curso el ${format(estimatedCompletionDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}.`
  };
};

export const generateStudyMilestones = (
  startDate: Date,
  totalHours: number,
  weeklyHours: number
): EventType[] => {
  const milestones: EventType[] = [];
  const totalWeeks = Math.ceil(totalHours / weeklyHours);
  
  for (let week = 1; week <= totalWeeks; week++) {
    const milestone: EventType = {
      id: `milestone-${week}`,
      title: `Milestone Semana ${week}`,
      start: addWeeks(startDate, week - 1),
      end: addWeeks(startDate, week),
      description: `Objetivo: Completar ${weeklyHours} horas de estudio`,
      color: '#10B981',
      isRecurring: false,
      progress: 0
    };
    milestones.push(milestone);
  }
  
  return milestones;
};