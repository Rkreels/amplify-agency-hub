
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
  icon: 'user' | 'users';
}

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
    icon: 'user',
  },
  {
    id: '2',
    name: 'Round Robin',
    description: 'Distribute meetings among team members',
    activeBookings: 6,
    conversionRate: 30,
    icon: 'users',
  },
  {
    id: '3',
    name: 'Group',
    description: 'Schedule group sessions or webinars',
    activeBookings: 9,
    conversionRate: 35,
    icon: 'users',
  },
];
