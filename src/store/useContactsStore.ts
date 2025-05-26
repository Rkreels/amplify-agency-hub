
import { create } from 'zustand';

export interface ContactCustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'dropdown' | 'checkbox';
  value: any;
  options?: string[]; // For dropdown fields
}

export interface ContactTag {
  id: string;
  name: string;
  color: string;
}

export interface ContactScore {
  total: number;
  website_activity: number;
  email_engagement: number;
  social_engagement: number;
  form_submissions: number;
}

export interface ContactActivity {
  id: string;
  type: 'email_opened' | 'email_clicked' | 'website_visit' | 'form_submit' | 'call' | 'sms' | 'meeting';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'inactive';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  source: string;
  status: ContactStatus;
  lifecycle_stage: 'subscriber' | 'lead' | 'marketing_qualified' | 'sales_qualified' | 'opportunity' | 'customer' | 'evangelist';
  tags: ContactTag[];
  customFields: ContactCustomField[];
  score: ContactScore;
  activities: ContactActivity[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
  avatar?: string;
  notes?: string;
  dateAdded?: Date;
  lastContacted?: Date;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface ContactsStore {
  contacts: Contact[];
  availableTags: ContactTag[];
  customFieldTemplates: Omit<ContactCustomField, 'id' | 'value'>[];
  selectedContact: Contact | null;
  searchQuery: string;
  statusFilter: string;
  tagFilter: string[];
  lifecycleFilter: string;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTagFilter: (tags: string[]) => void;
  setLifecycleFilter: (stage: string) => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addTag: (tag: Omit<ContactTag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<ContactTag>) => void;
  deleteTag: (id: string) => void;
  addCustomFieldTemplate: (field: Omit<ContactCustomField, 'id' | 'value'>) => void;
  addActivityToContact: (contactId: string, activity: Omit<ContactActivity, 'id'>) => void;
  calculateContactScore: (contactId: string) => void;
  bulkUpdateContacts: (contactIds: string[], updates: Partial<Contact>) => void;
  exportContacts: (format: 'csv' | 'excel') => void;
  importContacts: (contacts: Partial<Contact>[]) => void;
}

const mockTags: ContactTag[] = [
  { id: '1', name: 'Hot Lead', color: '#ef4444' },
  { id: '2', name: 'Cold Lead', color: '#3b82f6' },
  { id: '3', name: 'VIP', color: '#f59e0b' },
  { id: '4', name: 'Newsletter', color: '#10b981' },
  { id: '5', name: 'Webinar Attendee', color: '#8b5cf6' },
  { id: '6', name: 'Trial User', color: '#06b6d4' },
];

const mockCustomFields: Omit<ContactCustomField, 'id' | 'value'>[] = [
  { name: 'Industry', type: 'dropdown', options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'] },
  { name: 'Annual Revenue', type: 'number' },
  { name: 'Last Purchase Date', type: 'date' },
  { name: 'Preferred Communication', type: 'dropdown', options: ['Email', 'Phone', 'SMS', 'WhatsApp'] },
  { name: 'Newsletter Subscriber', type: 'checkbox' },
];

const generateMockActivities = (): ContactActivity[] => [
  {
    id: '1',
    type: 'email_opened',
    title: 'Opened Welcome Email',
    description: 'Opened the welcome email campaign',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'website_visit',
    title: 'Visited Pricing Page',
    description: 'Spent 3 minutes on pricing page',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    metadata: { duration: 180, page: '/pricing' }
  },
  {
    id: '3',
    type: 'form_submit',
    title: 'Submitted Contact Form',
    description: 'Filled out the contact us form',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0123',
    company: 'Tech Solutions Inc',
    position: 'Marketing Director',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    source: 'Website',
    status: 'lead',
    lifecycle_stage: 'marketing_qualified',
    tags: [mockTags[0], mockTags[3]],
    customFields: [
      { id: '1', name: 'Industry', type: 'dropdown', value: 'Technology', options: ['Technology', 'Healthcare'] },
      { id: '2', name: 'Annual Revenue', type: 'number', value: 2500000 }
    ],
    score: {
      total: 85,
      website_activity: 30,
      email_engagement: 25,
      social_engagement: 10,
      form_submissions: 20
    },
    activities: generateMockActivities(),
    assignedTo: 'John Doe',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    notes: 'Interested in enterprise package',
    social: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: '@sarahjohnson'
    }
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1-555-0124',
    company: 'Global Innovations LLC',
    position: 'CEO',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    source: 'Referral',
    status: 'prospect',
    lifecycle_stage: 'lead',
    tags: [mockTags[1], mockTags[4]],
    customFields: [
      { id: '3', name: 'Industry', type: 'dropdown', value: 'Finance', options: ['Technology', 'Healthcare'] },
      { id: '4', name: 'Annual Revenue', type: 'number', value: 5000000 }
    ],
    score: {
      total: 60,
      website_activity: 15,
      email_engagement: 15,
      social_engagement: 5,
      form_submissions: 25
    },
    activities: generateMockActivities(),
    assignedTo: 'Jane Smith',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    notes: 'Potential for large deal',
    social: {
      linkedin: 'https://linkedin.com/in/michaelbrown',
      twitter: '@michaelbrown'
    }
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1-555-0125',
    company: 'Sunrise Marketing',
    position: 'Marketing Manager',
    address: '789 Pine Ln',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    source: 'LinkedIn',
    status: 'customer',
    lifecycle_stage: 'customer',
    tags: [mockTags[2], mockTags[5]],
    customFields: [
      { id: '5', name: 'Industry', type: 'dropdown', value: 'Marketing', options: ['Technology', 'Healthcare'] },
      { id: '6', name: 'Annual Revenue', type: 'number', value: 1000000 }
    ],
    score: {
      total: 95,
      website_activity: 35,
      email_engagement: 30,
      social_engagement: 15,
      form_submissions: 15
    },
    activities: generateMockActivities(),
    assignedTo: 'John Doe',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    notes: 'Long-term customer',
    social: {
      linkedin: 'https://linkedin.com/in/emilydavis',
      twitter: '@emilydavis'
    }
  }
];

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: mockContacts,
  availableTags: mockTags,
  customFieldTemplates: mockCustomFields,
  selectedContact: null,
  searchQuery: '',
  statusFilter: 'all',
  tagFilter: [],
  lifecycleFilter: 'all',

  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTagFilter: (tags) => set({ tagFilter: tags }),
  setLifecycleFilter: (stage) => set({ lifecycleFilter: stage }),

  addContact: (contact) => set((state) => ({
    contacts: [...state.contacts, {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      dateAdded: new Date(),
      lifecycle_stage: contact.lifecycle_stage || 'subscriber',
      customFields: contact.customFields || [],
      score: contact.score || { total: 0, website_activity: 0, email_engagement: 0, social_engagement: 0, form_submissions: 0 },
      activities: contact.activities || []
    }]
  })),

  updateContact: (id, updates) => set((state) => ({
    contacts: state.contacts.map(contact =>
      contact.id === id ? { ...contact, ...updates, updatedAt: new Date() } : contact
    )
  })),

  deleteContact: (id) => set((state) => ({
    contacts: state.contacts.filter(contact => contact.id !== id)
  })),

  addTag: (tag) => set((state) => ({
    availableTags: [...state.availableTags, { ...tag, id: Date.now().toString() }]
  })),

  updateTag: (id, updates) => set((state) => ({
    availableTags: state.availableTags.map(tag =>
      tag.id === id ? { ...tag, ...updates } : tag
    )
  })),

  deleteTag: (id) => set((state) => ({
    availableTags: state.availableTags.filter(tag => tag.id !== id)
  })),

  addCustomFieldTemplate: (field) => set((state) => ({
    customFieldTemplates: [...state.customFieldTemplates, field]
  })),

  addActivityToContact: (contactId, activity) => set((state) => ({
    contacts: state.contacts.map(contact =>
      contact.id === contactId
        ? {
            ...contact,
            activities: [...contact.activities, { ...activity, id: Date.now().toString() }],
            lastActivityAt: new Date(),
            updatedAt: new Date()
          }
        : contact
    )
  })),

  calculateContactScore: (contactId) => set((state) => ({
    contacts: state.contacts.map(contact => {
      if (contact.id !== contactId) return contact;
      
      const activities = contact.activities;
      const websiteActivity = activities.filter(a => a.type === 'website_visit').length * 5;
      const emailEngagement = activities.filter(a => a.type.includes('email')).length * 8;
      const socialEngagement = activities.filter(a => a.type.includes('social')).length * 3;
      const formSubmissions = activities.filter(a => a.type === 'form_submit').length * 15;
      
      const total = websiteActivity + emailEngagement + socialEngagement + formSubmissions;
      
      return {
        ...contact,
        score: {
          total,
          website_activity: websiteActivity,
          email_engagement: emailEngagement,
          social_engagement: socialEngagement,
          form_submissions: formSubmissions
        }
      };
    })
  })),

  bulkUpdateContacts: (contactIds, updates) => set((state) => ({
    contacts: state.contacts.map(contact =>
      contactIds.includes(contact.id) 
        ? { ...contact, ...updates, updatedAt: new Date() }
        : contact
    )
  })),

  exportContacts: (format) => {
    console.log(`Exporting contacts in ${format} format`);
  },

  importContacts: (contacts) => set((state) => ({
    contacts: [
      ...state.contacts,
      ...contacts.map((contact, index) => ({
        id: (Date.now() + index).toString(),
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company,
        position: contact.position,
        source: contact.source || 'Import',
        status: contact.status || 'lead',
        lifecycle_stage: contact.lifecycle_stage || 'subscriber',
        tags: contact.tags || [],
        customFields: contact.customFields || [],
        score: contact.score || { total: 0, website_activity: 0, email_engagement: 0, social_engagement: 0, form_submissions: 0 },
        activities: contact.activities || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        dateAdded: new Date(),
        ...contact
      }))
    ]
  }))
}));
