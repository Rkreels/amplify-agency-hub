
import { create } from 'zustand';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'appointment' | 'task' | 'meeting' | 'call';
  contactId?: string;
  contactName?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  location?: string;
  notes?: string;
  reminders?: number[];
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  isRecurring?: boolean;
  recurringRule?: string;
  createdBy?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description?: string;
  color: string;
  isActive: boolean;
  bufferTime?: number;
  location?: string;
  price?: number;
  createdAt: Date;
}

export interface CalendarType {
  id: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  color?: string;
  appointmentCount?: number;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface CalendarStore {
  events: CalendarEvent[];
  appointmentTypes: AppointmentType[];
  calendarTypes: CalendarType[];
  availability: AvailabilitySlot[];
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  selectedTab: string;
  selectedCalendarView: string;
  viewMode: 'month' | 'week' | 'day';
  
  // Actions
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setSelectedTab: (tab: string) => void;
  setSelectedCalendarView: (view: string) => void;
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  addAppointmentType: (type: Omit<AppointmentType, 'id' | 'createdAt'>) => void;
  updateAppointmentType: (id: string, updates: Partial<AppointmentType>) => void;
  deleteAppointmentType: (id: string) => void;
  addCalendarType: (type: Omit<CalendarType, 'id'>) => void;
  updateCalendarType: (id: string, updates: Partial<CalendarType>) => void;
  deleteCalendarType: (id: string) => void;
  updateAvailability: (slots: AvailabilitySlot[]) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForWeek: (startDate: Date) => CalendarEvent[];
  getEventsForMonth: (year: number, month: number) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [
    {
      id: '1',
      title: 'Sales Call with John Doe',
      description: 'Initial consultation call',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      type: 'call',
      contactId: '1',
      contactName: 'John Doe',
      status: 'scheduled',
      location: 'Phone',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  appointmentTypes: [
    {
      id: '1',
      name: 'Consultation Call',
      duration: 30,
      description: 'Initial consultation with potential clients',
      color: '#3B82F6',
      isActive: true,
      bufferTime: 15,
      location: 'Phone/Video',
      price: 0,
      createdAt: new Date()
    }
  ],
  calendarTypes: [
    {
      id: '1',
      name: 'Sales Calendar',
      description: 'Calendar for sales appointments',
      type: 'sales',
      isActive: true,
      color: '#3B82F6',
      appointmentCount: 5
    }
  ],
  availability: [
    {
      id: '1',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isActive: true
    },
    {
      id: '2',
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '17:00',
      isActive: true
    }
  ],
  selectedDate: new Date(),
  selectedEvent: null,
  selectedTab: 'appointments',
  selectedCalendarView: 'month',
  viewMode: 'month',

  addEvent: (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      events: [...state.events, newEvent]
    }));
  },

  updateEvent: (id, updates) => {
    set(state => ({
      events: state.events.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    }));
  },

  deleteEvent: (id) => {
    set(state => ({
      events: state.events.filter(event => event.id !== id)
    }));
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  setSelectedEvent: (event) => {
    set({ selectedEvent: event });
  },

  setSelectedTab: (tab) => {
    set({ selectedTab: tab });
  },

  setSelectedCalendarView: (view) => {
    set({ selectedCalendarView: view });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  addAppointmentType: (type) => {
    const newType: AppointmentType = {
      ...type,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    set(state => ({
      appointmentTypes: [...state.appointmentTypes, newType]
    }));
  },

  updateAppointmentType: (id, updates) => {
    set(state => ({
      appointmentTypes: state.appointmentTypes.map(type =>
        type.id === id ? { ...type, ...updates } : type
      )
    }));
  },

  deleteAppointmentType: (id) => {
    set(state => ({
      appointmentTypes: state.appointmentTypes.filter(type => type.id !== id)
    }));
  },

  addCalendarType: (type) => {
    const newType: CalendarType = {
      ...type,
      id: Date.now().toString()
    };

    set(state => ({
      calendarTypes: [...state.calendarTypes, newType]
    }));
  },

  updateCalendarType: (id, updates) => {
    set(state => ({
      calendarTypes: state.calendarTypes.map(type =>
        type.id === id ? { ...type, ...updates } : type
      )
    }));
  },

  deleteCalendarType: (id) => {
    set(state => ({
      calendarTypes: state.calendarTypes.filter(type => type.id !== id)
    }));
  },

  updateAvailability: (slots) => {
    set({ availability: slots });
  },

  getEventsForDate: (date) => {
    const { events } = get();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= targetDate && eventStart < nextDate;
    });
  },

  getEventsForWeek: (startDate) => {
    const { events } = get();
    const weekStart = new Date(startDate);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= weekStart && eventStart < weekEnd;
    });
  },

  getEventsForMonth: (year, month) => {
    const { events } = get();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= monthStart && eventStart <= monthEnd;
    });
  }
}));
