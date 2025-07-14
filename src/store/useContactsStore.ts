
import { create } from 'zustand';
import { toast } from 'sonner';

export type ContactSource = 'website' | 'referral' | 'social-media' | 'advertisement' | 'event' | 'cold-outreach' | 'other';
export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'customer' | 'inactive';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  socialMedia?: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  notes?: string;
  source?: ContactSource;
  status: ContactStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  avatar?: string;
}

interface ContactsStore {
  contacts: Contact[];
  selectedContact: Contact | null;
  searchQuery: string;
  statusFilter: string;
  sourceFilter: string;
  isLoading: boolean;

  // CRUD Operations
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Filters and Search
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSourceFilter: (source: string) => void;
  getFilteredContacts: () => Contact[];
  
  // Selection
  setSelectedContact: (contact: Contact | null) => void;
  
  // Bulk Operations
  bulkUpdateStatus: (ids: string[], status: ContactStatus) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [],
  selectedContact: null,
  searchQuery: '',
  statusFilter: 'all',
  sourceFilter: 'all',
  isLoading: false,

  addContact: async (contactData) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      contacts: [newContact, ...state.contacts]
    }));
    
    toast.success('Contact added successfully');
  },

  updateContact: async (id, updates) => {
    set(state => ({
      contacts: state.contacts.map(contact =>
        contact.id === id 
          ? { ...contact, ...updates, updatedAt: new Date() }
          : contact
      ),
      selectedContact: state.selectedContact?.id === id
        ? { ...state.selectedContact, ...updates, updatedAt: new Date() }
        : state.selectedContact
    }));
    
    toast.success('Contact updated');
  },

  deleteContact: async (id) => {
    set(state => ({
      contacts: state.contacts.filter(contact => contact.id !== id),
      selectedContact: state.selectedContact?.id === id 
        ? null 
        : state.selectedContact
    }));
    
    toast.success('Contact deleted');
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSourceFilter: (source) => set({ sourceFilter: source }),

  getFilteredContacts: () => {
    const { contacts, searchQuery, statusFilter, sourceFilter } = get();
    
    return contacts.filter(contact => {
      if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !contact.email.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter && statusFilter !== 'all' && contact.status !== statusFilter) {
        return false;
      }
      if (sourceFilter && sourceFilter !== 'all' && contact.source !== sourceFilter) {
        return false;
      }
      return true;
    });
  },

  setSelectedContact: (contact) => set({ selectedContact: contact }),

  bulkUpdateStatus: async (ids, status) => {
    set(state => ({
      contacts: state.contacts.map(contact =>
        ids.includes(contact.id)
          ? { ...contact, status, updatedAt: new Date() }
          : contact
      )
    }));
    
    toast.success(`${ids.length} contacts updated`);
  },

  bulkDelete: async (ids) => {
    set(state => ({
      contacts: state.contacts.filter(contact => !ids.includes(contact.id))
    }));
    
    toast.success(`${ids.length} contacts deleted`);
  }
}));
