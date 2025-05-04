import React from 'react';
import { CalendarViewType } from '../types';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import AgendaView from './views/AgendaView';

interface CalendarViewProps {
  view: CalendarViewType;
}

const CalendarView: React.FC<CalendarViewProps> = ({ view }) => {
  switch (view) {
    case 'month':
      return <MonthView />;
    case 'week':
      return <WeekView />;
    case 'day':
      return <DayView />;
    case 'agenda':
      return <AgendaView />;
    default:
      return <MonthView />;
  }
};

export default CalendarView;