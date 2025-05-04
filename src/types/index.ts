// Calendar view types
export type CalendarViewType = 'month' | 'week' | 'day' | 'agenda';

// Event types
export interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
  location?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  participants?: Participant[];
  reminders?: Reminder[];
  isCompleted?: boolean;
  // Nuevos campos para cursos
  isCourse?: boolean;
  totalHours?: number;
  recommendedWeeklyHours?: number;
  progress?: number;
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
}

export interface RecurrencePattern {
  frequency: 'diario' | 'semanal' | 'mensual' | 'anual';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
  occurrences?: number;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'pendiente' | 'aceptado' | 'rechazado' | 'tentativo';
}

export interface Reminder {
  id: string;
  time: number;
  type: 'push' | 'email';
}

export interface TimeBlock {
  id: string;
  date: Date;
  startHour: number;
  endHour: number;
  productivity: number;
  focus: number;
  energy: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  startOfWeek: number;
  defaultView: CalendarViewType;
  workingHours: {
    start: number;
    end: number;
    daysOfWeek: number[];
  };
  notifications: {
    enabled: boolean;
    reminderDefaults: number[];
    email: boolean;
    push: boolean;
  };
  studyPreferences?: {
    preferredStudyDays: number[];
    maxDailyStudyHours: number;
    preferredStudyTimes: ('mañana' | 'tarde' | 'noche')[];
  };
}

export interface TimeRecommendation {
  date: Date;
  startHour: number;
  endHour: number;
  confidence: number;
  reason: string;
  isCourseRecommendation?: boolean;
  courseId?: string;
}

export interface CourseRecommendation {
  weeklyHours: number;
  recommendedDays: string[];
  recommendedTimes: string[];
  estimatedCompletionDate: Date;
  reason: string;
}