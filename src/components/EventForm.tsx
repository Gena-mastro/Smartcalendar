import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Users, Calendar, RotateCcw, Bell, BookOpen, Timer } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { EventType, RecurrencePattern, CourseRecommendation } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { analyzeCourseSchedule } from '../utils/courseAnalytics';

interface EventFormProps {
  event?: EventType;
  onClose: () => void;
}

const EVENT_COLORS = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F97316', // Naranja
  '#8B5CF6', // Morado
  '#EF4444', // Rojo
  '#F59E0B', // Ámbar
];

const DEFAULT_EVENT: EventType = {
  id: '',
  title: '',
  start: new Date(),
  end: new Date(new Date().setHours(new Date().getHours() + 1)),
  description: '',
  color: '#3B82F6',
  isRecurring: false,
  isCourse: false,
};

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const { addEvent, updateEvent, deleteEvent, selectedDate, userPreferences, events } = useCalendar();
  const [formData, setFormData] = useState<EventType>(DEFAULT_EVENT);
  const [currentStep, setCurrentStep] = useState(1);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    frequency: 'semanal',
    interval: 1,
  });
  const [courseRecommendation, setCourseRecommendation] = useState<CourseRecommendation | null>(null);

  useEffect(() => {
    if (event) {
      setFormData(event);
      if (event.recurrencePattern) {
        setRecurrencePattern(event.recurrencePattern);
      }
    } else {
      const startTime = new Date(selectedDate);
      startTime.setHours(new Date().getHours());
      startTime.setMinutes(0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      setFormData({
        ...DEFAULT_EVENT,
        id: crypto.randomUUID(),
        start: startTime,
        end: endTime,
      });
    }
  }, [event, selectedDate]);

  useEffect(() => {
    if (formData.isCourse && formData.totalHours) {
      const recommendation = analyzeCourseSchedule(
        formData.totalHours,
        formData.start,
        formData.end,
        userPreferences,
        events
      );
      setCourseRecommendation(recommendation);
    }
  }, [formData.isCourse, formData.totalHours, formData.start, formData.end]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value, 10) });
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: new Date(value),
    });
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventToSave = {
      ...formData,
      recurrencePattern: formData.isRecurring ? recurrencePattern : undefined,
    };
    
    if (event) {
      updateEvent(eventToSave);
    } else {
      addEvent(eventToSave);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (event && event.id) {
      deleteEvent(event.id);
      onClose();
    }
  };

  const formatDateTimeForInput = (date: Date): string => {
    return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {event ? 'Editar Evento' : 'Crear Evento'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Añadir título"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCourse"
              name="isCourse"
              checked={formData.isCourse}
              onChange={(e) => setFormData({ ...formData, isCourse: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCourse" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              <BookOpen size={14} className="inline mr-1" /> Es un curso
            </label>
          </div>

          {formData.isCourse && (
            <>
              <div>
                <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Timer size={14} className="inline mr-1" /> Duración total (horas)
                </label>
                <input
                  type="number"
                  id="totalHours"
                  name="totalHours"
                  value={formData.totalHours || ''}
                  onChange={handleNumberChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nivel de dificultad
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty || 'intermedio'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                >
                  <option value="básico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              {courseRecommendation && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Recomendaciones para el curso</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{courseRecommendation.reason}</p>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Clock size={14} className="inline mr-1" /> Inicio
              </label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={formatDateTimeForInput(formData.start)}
                onChange={handleDateTimeChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Clock size={14} className="inline mr-1" /> Fin
              </label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={formatDateTimeForInput(formData.end)}
                onChange={handleDateTimeChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin size={14} className="inline mr-1" /> Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Añadir ubicación"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Añadir descripción"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {EVENT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-6 h-6 rounded-full ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Seleccionar color ${color}`}
                ></button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Eliminar
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;