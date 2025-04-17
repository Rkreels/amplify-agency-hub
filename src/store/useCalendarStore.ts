
import { create } from 'zustand';
import { defaultAppointmentTypes, defaultCalendarTypes, type AppointmentType, type CalendarType, type CalendarEvent } from '@/lib/calendar-data';

interface CalendarStore {
  appointmentTypes: AppointmentType[];
  calendarTypes: CalendarType[];
  events: CalendarEvent[];
  selectedDate: Date;
  addAppointmentType: (type: AppointmentType) => void;
  deleteAppointmentType: (id: string) => void;
  addCalendarType: (type: CalendarType) => void;
  deleteCalendarType: (id: string) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  appointmentTypes: defaultAppointmentTypes,
  calendarTypes: defaultCalendarTypes,
  events: [],
  selectedDate: new Date(),
  addAppointmentType: (type) =>
    set((state) => ({
      appointmentTypes: [...state.appointmentTypes, type],
    })),
  deleteAppointmentType: (id) =>
    set((state) => ({
      appointmentTypes: state.appointmentTypes.filter((type) => type.id !== id),
    })),
  addCalendarType: (type) =>
    set((state) => ({
      calendarTypes: [...state.calendarTypes, type],
    })),
  deleteCalendarType: (id) =>
    set((state) => ({
      calendarTypes: state.calendarTypes.filter((type) => type.id !== id),
    })),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  setSelectedDate: (date) =>
    set(() => ({
      selectedDate: date,
    })),
}));
