
export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  contact: {
    name: string;
    avatar: string;
    initials: string;
  };
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface CalendarType {
  id: string;
  name: string;
  description: string;
  activeBookings: number;
  conversionRate: number;
  icon: string;
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

export const defaultAppointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Discovery Call', duration: 30, color: 'bg-blue-500' },
  { id: '2', name: 'Strategy Session', duration: 60, color: 'bg-green-500' },
  { id: '3', name: 'Website Review', duration: 45, color: 'bg-purple-500' },
];

export const defaultCalendarTypes: CalendarType[] = [
  {
    id: '1',
    name: 'One-on-One',
    description: 'Individual meetings with clients or prospects',
    activeBookings: 3,
    conversionRate: 25,
    icon: 'User',
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
];

export const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Discovery Call with Michael Brown',
    date: today,
    time: '9:00 AM - 9:30 AM',
    contact: {
      name: 'Michael Brown',
      avatar: '',
      initials: 'MB',
    },
    type: 'Video Call',
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Strategy Session with Emma Davis',
    date: today,
    time: '11:00 AM - 12:00 PM',
    contact: {
      name: 'Emma Davis',
      avatar: '',
      initials: 'ED',
    },
    type: 'In Person',
    status: 'confirmed',
  },
  {
    id: '3',
    title: 'Website Review with James Wilson',
    date: tomorrow,
    time: '2:30 PM - 3:30 PM',
    contact: {
      name: 'James Wilson',
      avatar: '',
      initials: 'JW',
    },
    type: 'Video Call',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Follow-up Call with Sarah Parker',
    date: dayAfter,
    time: '10:00 AM - 10:30 AM',
    contact: {
      name: 'Sarah Parker',
      avatar: '',
      initials: 'SP',
    },
    type: 'Video Call',
    status: 'confirmed',
  }
];
