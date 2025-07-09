
import { create } from 'zustand';

export type ContactStatus = 'lead' | 'customer' | 'prospect' | 'inactive';
export type ContactSource = 'website' | 'referral' | 'social' | 'ads' | 'phone' | 'email';

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'multiselect';
  options?: string[];
  required: boolean;
  order: number;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: ContactStatus;
  source: ContactSource;
  tags: string[];
  notes: string;
  avatar?: string;
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
  assignedTo?: string;
  leadScore: number;
  lifecycle: string;
}

interface ContactsStore {
  contacts: Contact[];
  customFields: CustomField[];
  selectedContact: Contact | null;
  searchQuery: string;
  statusFilter: ContactStatus | '';
  sourceFilter: ContactSource | '';
  tagFilter: string;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ContactStatus | '') => void;
  setSourceFilter: (source: ContactSource | '') => void;
  setTagFilter: (tag: string) => void;
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  updateCustomField: (id: string, updates: Partial<CustomField>) => void;
  deleteCustomField: (id: string) => void;
  getFilteredContacts: () => Contact[];
}

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'ABC Corp',
      position: 'CEO',
      status: 'lead',
      source: 'website',
      tags: ['hot-lead', 'enterprise'],
      notes: 'Interested in premium package',
      customFields: {},
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      leadScore: 85,
      lifecycle: 'Marketing Qualified Lead'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@company.com',
      phone: '+1-555-0124',
      company: 'XYZ Inc',
      status: 'customer',
      source: 'referral',
      tags: ['vip'],
      notes: 'Existing customer, renewal due next month',
      customFields: {},
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
      leadScore: 95,
      lifecycle: 'Customer'
    }
  ],
  customFields: [
    {
      id: '1',
      name: 'Industry',
      type: 'select',
      options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Other'],
      required: false,
      order: 1
    },
    {
      id: '2',
      name: 'Annual Revenue',
      type: 'select',
      options: ['<$1M', '$1M-$10M', '$10M-$100M', '>$100M'],
      required: false,
      order: 2
    }
  ],
  selectedContact: null,
  searchQuery: '',
  statusFilter: '',
  sourceFilter: '',
  tagFilter: '',
  addContact: (contact) => set((state) => ({
    contacts: [...state.contacts, {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
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
  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  setTagFilter: (tag) => set({ tagFilter: tag }),
  addCustomField: (field) => set((state) => ({
    customFields: [...state.customFields, { ...field, id: Date.now().toString() }]
  })),
  updateCustomField: (id, updates) => set((state) => ({
    customFields: state.customFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    )
  })),
  deleteCustomField: (id) => set((state) => ({
    customFields: state.customFields.filter(field => field.id !== id)
  })),
  getFilteredContacts: () => {
    const { contacts, searchQuery, statusFilter, sourceFilter, tagFilter } = get();
    return contacts.filter(contact => {
      if (searchQuery && !(
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )) return false;
      
      if (statusFilter && contact.status !== statusFilter) return false;
      if (sourceFilter && contact.source !== sourceFilter) return false;
      if (tagFilter && !contact.tags.includes(tagFilter)) return false;
      
      return true;
    });
  }
}));
