
import { v4 as uuidv4 } from 'uuid';

export interface CalendarType {
  id: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  color?: string;
  appointmentCount?: number;
}

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price?: number;
  color?: string;
  isActive: boolean;
  calendarId?: string;
  locations?: string[];
  bufferTimeBefore?: number;
  bufferTimeAfter?: number;
  availableDays?: string[];
  isDefault?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  appointmentTypeId?: string;
  calendarId?: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  location?: string;
  color?: string;
  // Add missing properties used in AppointmentItem.tsx
  time?: string;
  type?: string;
  contact?: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    initials: string;
  };
}

export interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const defaultAvailability: AvailabilitySlot[] = [
  { id: 'slot-1', day: 'monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'slot-2', day: 'tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'slot-3', day: 'wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'slot-4', day: 'thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'slot-5', day: 'friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'slot-6', day: 'saturday', startTime: '00:00', endTime: '00:00', isAvailable: false },
  { id: 'slot-7', day: 'sunday', startTime: '00:00', endTime: '00:00', isAvailable: false },
];

export const defaultCalendarTypes: CalendarType[] = [
  {
    id: 'cal-1',
    name: 'Personal Calendar',
    description: 'My personal appointment calendar',
    type: 'personal',
    isActive: true,
    color: '#6E59A5',
    appointmentCount: 8,
  },
  {
    id: 'cal-2',
    name: 'Team Calendar',
    description: 'Calendar for team availability and scheduling',
    type: 'team',
    isActive: true,
    color: '#0EA5E9',
    appointmentCount: 15,
  },
  {
    id: 'cal-3',
    name: 'Service Calendar',
    description: 'Calendar for service-based appointments',
    type: 'service',
    isActive: false,
    color: '#F97316',
    appointmentCount: 0,
  },
];

export const defaultAppointmentTypes: AppointmentType[] = [
  {
    id: 'apt-1',
    name: 'Initial Consultation',
    description: 'First meeting with a new client',
    duration: 30,
    price: 50,
    color: '#6E59A5',
    isActive: true,
    calendarId: 'cal-1',
    locations: ['In-person', 'Video call'],
    bufferTimeBefore: 10,
    bufferTimeAfter: 5,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    isDefault: false,
  },
  {
    id: 'apt-2',
    name: 'Follow-up Meeting',
    description: 'Follow-up session with existing client',
    duration: 45,
    price: 75,
    color: '#0EA5E9',
    isActive: true,
    calendarId: 'cal-1',
    locations: ['In-person', 'Phone call', 'Video call'],
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    availableDays: ['monday', 'wednesday', 'friday'],
    isDefault: true,
  },
  {
    id: 'apt-3',
    name: 'Strategy Session',
    description: 'Deep dive into business strategy',
    duration: 60,
    price: 100,
    color: '#F97316',
    isActive: true,
    calendarId: 'cal-2',
    locations: ['In-person', 'Video call'],
    bufferTimeBefore: 15,
    bufferTimeAfter: 10,
    availableDays: ['tuesday', 'thursday'],
    isDefault: false,
  },
  {
    id: 'apt-4',
    name: 'Quick Check-in',
    description: 'Brief status update meeting',
    duration: 15,
    price: 0,
    color: '#8B5CF6',
    isActive: true,
    calendarId: 'cal-2',
    locations: ['Phone call', 'Video call'],
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    isDefault: false,
  },
];

export const createDefaultEvent = (partial: Partial<CalendarEvent> = {}): CalendarEvent => {
  return {
    id: uuidv4(),
    title: 'New Event',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    status: 'confirmed',
    ...partial,
  };
};

export const defaultEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Initial Consultation with Sarah',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '09:00',
    endTime: '09:30',
    appointmentTypeId: 'apt-1',
    calendarId: 'cal-1',
    contactId: 'contact-1',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@example.com',
    contactPhone: '(555) 123-4567',
    status: 'confirmed',
    location: 'Video call',
    color: '#6E59A5',
    time: '09:00 - 09:30',
    type: 'Video call',
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      initials: 'SJ'
    }
  },
  {
    id: 'evt-2',
    title: 'Follow-up with Michael',
    date: new Date(),
    startTime: '11:00',
    endTime: '11:45',
    appointmentTypeId: 'apt-2',
    calendarId: 'cal-1',
    contactId: 'contact-2',
    contactName: 'Michael Brown',
    contactEmail: 'michael@example.com',
    contactPhone: '(555) 987-6543',
    status: 'confirmed',
    location: 'In-person',
    color: '#0EA5E9',
    time: '11:00 - 11:45',
    type: 'In-person',
    contact: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '(555) 987-6543',
      initials: 'MB'
    }
  },
  {
    id: 'evt-3',
    title: 'Strategy Session with Emma',
    date: new Date(),
    startTime: '14:00',
    endTime: '15:00',
    appointmentTypeId: 'apt-3',
    calendarId: 'cal-2',
    contactId: 'contact-3',
    contactName: 'Emma Davis',
    contactEmail: 'emma@example.com',
    contactPhone: '(555) 345-6789',
    status: 'pending',
    location: 'Video call',
    notes: 'Prepare quarterly strategy documents',
    color: '#F97316',
    time: '14:00 - 15:00',
    type: 'Video call',
    contact: {
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '(555) 345-6789',
      initials: 'ED'
    }
  },
  {
    id: 'evt-4',
    title: 'Quick Check-in with James',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    startTime: '16:00',
    endTime: '16:15',
    appointmentTypeId: 'apt-4',
    calendarId: 'cal-2',
    contactId: 'contact-4',
    contactName: 'James Wilson',
    contactEmail: 'james@example.com',
    status: 'completed',
    location: 'Phone call',
    color: '#8B5CF6',
    time: '16:00 - 16:15',
    type: 'Phone call',
    contact: {
      name: 'James Wilson',
      email: 'james@example.com',
      initials: 'JW'
    }
  },
  {
    id: 'evt-5',
    title: 'Initial Consultation with Olivia',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '10:00',
    endTime: '10:30',
    appointmentTypeId: 'apt-1',
    calendarId: 'cal-1',
    contactId: 'contact-5',
    contactName: 'Olivia Smith',
    contactEmail: 'olivia@example.com',
    status: 'confirmed',
    location: 'In-person',
    color: '#6E59A5',
    time: '10:00 - 10:30',
    type: 'In-person',
    contact: {
      name: 'Olivia Smith',
      email: 'olivia@example.com',
      initials: 'OS'
    }
  },
  {
    id: 'evt-6',
    title: 'Follow-up with William',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '13:00',
    endTime: '13:45',
    appointmentTypeId: 'apt-2',
    calendarId: 'cal-1',
    contactId: 'contact-6',
    contactName: 'William Taylor',
    contactEmail: 'william@example.com',
    status: 'cancelled',
    location: 'Video call',
    notes: 'Client requested cancellation',
    color: '#0EA5E9',
    time: '13:00 - 13:45',
    type: 'Video call',
    contact: {
      name: 'William Taylor',
      email: 'william@example.com',
      initials: 'WT'
    }
  },
];
