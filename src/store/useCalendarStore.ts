
import { create } from 'zustand';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'meeting' | 'call' | 'task' | 'reminder';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  attendees: string[];
  location?: string;
  isRecurring: boolean;
  recurringRule?: string;
  contactId?: string;
  createdBy: string;
  color: string;
  reminders: number[]; // minutes before event
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
    days: number[];
  };
  bufferTime: number;
  maxBookingsPerDay: number;
}

interface CalendarStore {
  events: CalendarEvent[];
  calendars: Calendar[];
  selectedCalendar: string;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addCalendar: (calendar: Omit<Calendar, 'id'>) => void;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  deleteCalendar: (id: string) => void;
  setSelectedCalendar: (id: string) => void;
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForDateRange: (start: Date, end: Date) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [
    {
      id: '1',
      title: 'Sales Call with John Smith',
      description: 'Discuss premium package requirements',
      start: new Date(2024, 11, 20, 14, 0),
      end: new Date(2024, 11, 20, 15, 0),
      type: 'call',
      status: 'confirmed',
      attendees: ['john@example.com'],
      contactId: '1',
      isRecurring: false,
      createdBy: 'current-user',
      color: '#3b82f6',
      reminders: [15, 60]
    },
    {
      id: '2',
      title: 'Product Demo',
      description: 'Demo for XYZ Inc team',
      start: new Date(2024, 11, 21, 10, 0),
      end: new Date(2024, 11, 21, 11, 30),
      type: 'meeting',
      status: 'scheduled',
      attendees: ['jane@company.com', 'team@company.com'],
      location: 'Zoom Meeting',
      isRecurring: false,
      createdBy: 'current-user',
      color: '#10b981',
      reminders: [30]
    }
  ],
  calendars: [
    {
      id: 'main',
      name: 'Main Calendar',
      description: 'Primary business calendar',
      color: '#3b82f6',
      isActive: true,
      isDefault: true,
      timezone: 'America/New_York',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: [1, 2, 3, 4, 5]
      },
      bufferTime: 15,
      maxBookingsPerDay: 8
    }
  ],
  selectedCalendar: 'main',
  viewMode: 'month',
  selectedDate: new Date(),
  selectedEvent: null,
  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: Date.now().toString() }]
  })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),
  addCalendar: (calendar) => set((state) => ({
    calendars: [...state.calendars, { ...calendar, id: Date.now().toString() }]
  })),
  updateCalendar: (id, updates) => set((state) => ({
    calendars: state.calendars.map(calendar =>
      calendar.id === id ? { ...calendar, ...updates } : calendar
    )
  })),
  deleteCalendar: (id) => set((state) => ({
    calendars: state.calendars.filter(calendar => calendar.id !== id)
  })),
  setSelectedCalendar: (id) => set({ selectedCalendar: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  getEventsForDate: (date) => {
    const { events } = get();
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  },
  getEventsForDateRange: (start, end) => {
    const { events } = get();
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= start && eventStart <= end;
    });
  }
}));
