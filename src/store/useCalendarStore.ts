
import { create } from 'zustand';
import { defaultAppointmentTypes, defaultCalendarTypes, defaultEvents, type AppointmentType, type CalendarType, type CalendarEvent } from '@/lib/calendar-data';
import { persist } from 'zustand/middleware';

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
  updateAppointmentType: (id: string, updates: Partial<AppointmentType>) => void;
  updateCalendarType: (id: string, updates: Partial<CalendarType>) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedCalendarView: string; 
  setSelectedCalendarView: (view: string) => void;
  bufferBefore: string;
  bufferAfter: string;
  setBufferBefore: (time: string) => void;
  setBufferAfter: (time: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  editAppointmentType: (type: AppointmentType) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      appointmentTypes: defaultAppointmentTypes,
      calendarTypes: defaultCalendarTypes,
      events: defaultEvents,
      selectedDate: new Date(),
      selectedTab: "appointments",
      selectedCalendarView: "month",
      bufferBefore: "15",
      bufferAfter: "10",
      addAppointmentType: (type) =>
        set((state) => ({
          appointmentTypes: [...state.appointmentTypes, type],
        })),
      deleteAppointmentType: (id) =>
        set((state) => ({
          appointmentTypes: state.appointmentTypes.filter((type) => type.id !== id),
        })),
      updateAppointmentType: (id, updates) =>
        set((state) => ({
          appointmentTypes: state.appointmentTypes.map((type) => 
            type.id === id ? { ...type, ...updates } : type
          ),
        })),
      editAppointmentType: (type) =>
        set((state) => ({
          appointmentTypes: state.appointmentTypes.map((item) => 
            item.id === type.id ? type : item
          ),
        })),
      addCalendarType: (type) =>
        set((state) => ({
          calendarTypes: [...state.calendarTypes, type],
        })),
      deleteCalendarType: (id) =>
        set((state) => ({
          calendarTypes: state.calendarTypes.filter((type) => type.id !== id),
        })),
      updateCalendarType: (id, updates) =>
        set((state) => ({
          calendarTypes: state.calendarTypes.map((type) => 
            type.id === id ? { ...type, ...updates } : type
          ),
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
      setSelectedTab: (tab) =>
        set(() => ({
          selectedTab: tab,
        })),
      setSelectedCalendarView: (view) =>
        set(() => ({
          selectedCalendarView: view,
        })),
      setBufferBefore: (time) =>
        set(() => ({
          bufferBefore: time,
        })),
      setBufferAfter: (time) =>
        set(() => ({
          bufferAfter: time,
        })),
      getEventsForDate: (date) => {
        const events = get().events;
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          );
        });
      }
    }),
    {
      name: 'calendar-store',
      partialize: (state) => ({
        appointmentTypes: state.appointmentTypes,
        calendarTypes: state.calendarTypes,
        events: state.events,
        bufferBefore: state.bufferBefore,
        bufferAfter: state.bufferAfter,
      }),
    }
  )
);
