
export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  color: string;
  description?: string;
  isDefault?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  contact: {
    name: string;
    email?: string;
    avatar: string;
    initials: string;
  };
  type: string;
  appointmentTypeId?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'rescheduled';
  notes?: string;
  location?: string;
}

export interface CalendarType {
  id: string;
  name: string;
  description: string;
  activeBookings: number;
  conversionRate: number;
  icon: string;
  isConnected?: boolean;
  source?: 'google' | 'outlook' | 'apple' | 'custom';
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const defaultAppointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Discovery Call', duration: 30, color: 'bg-blue-500', description: 'Initial consultation to understand client needs', isDefault: true },
  { id: '2', name: 'Strategy Session', duration: 60, color: 'bg-green-500', description: 'Detailed planning session for new projects' },
  { id: '3', name: 'Website Review', duration: 45, color: 'bg-purple-500', description: 'Technical and design review of existing website' },
  { id: '4', name: 'Quick Check-in', duration: 15, color: 'bg-amber-500', description: 'Brief follow-up on project status' },
];

export const defaultCalendarTypes: CalendarType[] = [
  {
    id: '1',
    name: 'One-on-One',
    description: 'Individual meetings with clients or prospects',
    activeBookings: 3,
    conversionRate: 25,
    icon: 'User',
    isConnected: true,
  },
  {
    id: '2',
    name: 'Round Robin',
    description: 'Distribute meetings among team members',
    activeBookings: 6,
    conversionRate: 30,
    icon: 'Users',
  },
  {
    id: '3',
    name: 'Group',
    description: 'Schedule group sessions or webinars',
    activeBookings: 9,
    conversionRate: 35,
    icon: 'Users',
  },
  {
    id: '4',
    name: 'Google Calendar',
    description: 'Connected external calendar',
    activeBookings: 12,
    conversionRate: 40,
    icon: 'Calendar',
    isConnected: true,
    source: 'google',
  },
];

export const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Discovery Call with Michael Brown',
    date: today,
    time: '9:00 AM - 9:30 AM',
    contact: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: '',
      initials: 'MB',
    },
    type: 'Video Call',
    appointmentTypeId: '1',
    status: 'confirmed',
    location: 'Zoom',
  },
  {
    id: '2',
    title: 'Strategy Session with Emma Davis',
    date: today,
    time: '11:00 AM - 12:00 PM',
    contact: {
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: '',
      initials: 'ED',
    },
    type: 'In Person',
    appointmentTypeId: '2',
    status: 'confirmed',
    location: 'Office - Room 302',
  },
  {
    id: '3',
    title: 'Website Review with James Wilson',
    date: tomorrow,
    time: '2:30 PM - 3:15 PM',
    contact: {
      name: 'James Wilson',
      email: 'james@example.com',
      avatar: '',
      initials: 'JW',
    },
    type: 'Video Call',
    appointmentTypeId: '3',
    status: 'pending',
    location: 'Google Meet',
  },
  {
    id: '4',
    title: 'Follow-up Call with Sarah Parker',
    date: dayAfter,
    time: '10:00 AM - 10:30 AM',
    contact: {
      name: 'Sarah Parker',
      email: 'sarah@example.com',
      avatar: '',
      initials: 'SP',
    },
    type: 'Video Call',
    appointmentTypeId: '1',
    status: 'confirmed',
    location: 'Zoom',
  },
  {
    id: '5',
    title: 'Project Kickoff with Alex Wong',
    date: nextWeek,
    time: '1:00 PM - 2:00 PM',
    contact: {
      name: 'Alex Wong',
      email: 'alex@example.com',
      avatar: '',
      initials: 'AW',
    },
    type: 'In Person',
    appointmentTypeId: '2',
    status: 'confirmed',
    location: 'Conference Room A',
  },
  {
    id: '6',
    title: 'Quick Check-in with David Miller',
    date: nextWeek,
    time: '3:30 PM - 3:45 PM',
    contact: {
      name: 'David Miller',
      email: 'david@example.com',
      avatar: '',
      initials: 'DM',
    },
    type: 'Phone Call',
    appointmentTypeId: '4',
    status: 'rescheduled',
    notes: 'Originally scheduled for yesterday',
  }
];

export const defaultAvailability: AvailabilitySlot[] = [
  { day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { day: 'Tuesday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { day: 'Wednesday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { day: 'Thursday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { day: 'Friday', startTime: '09:00 AM', endTime: '03:00 PM', isAvailable: true },
  { day: 'Saturday', startTime: '10:00 AM', endTime: '02:00 PM', isAvailable: false },
  { day: 'Sunday', startTime: '', endTime: '', isAvailable: false },
];
