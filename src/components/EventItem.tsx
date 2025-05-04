import React from 'react';
import { format } from 'date-fns';
import { Clock, MapPin, Users } from 'lucide-react';
import { EventType } from '../types';

interface EventItemProps {
  event: EventType;
  compact?: boolean;
  agendaStyle?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ event, compact = false, agendaStyle = false }) => {
  const { title, start, end, location, participants, color = '#3B82F6' } = event;
  
  if (compact) {
    return (
      <div 
        className="px-2 py-1 rounded text-xs truncate text-white"
        style={{ backgroundColor: color }}
      >
        {format(new Date(start), 'h:mm')} {title}
      </div>
    );
  }
  
  if (agendaStyle) {
    return (
      <div className="flex">
        <div 
          className="w-3 self-stretch rounded-l mr-3"
          style={{ backgroundColor: color }}
        ></div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          
          {location && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
              <MapPin size={12} className="mr-1" />
              {location}
            </div>
          )}
          
          {participants && participants.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
              <Users size={12} className="mr-1" />
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="p-2 rounded shadow-sm border-l-4"
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      <h4 className="font-medium text-sm">{title}</h4>
      
      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
        <Clock size={12} className="mr-1" />
        {format(new Date(start), 'h:mm a')} - {format(new Date(end), 'h:mm a')}
      </div>
      
      {location && (
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
          <MapPin size={12} className="mr-1" />
          {location}
        </div>
      )}
    </div>
  );
};

export default EventItem;