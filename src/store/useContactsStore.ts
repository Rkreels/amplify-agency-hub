
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ContactStatus = 'lead' | 'customer' | 'prospect' | 'inactive';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ContactStatus;
  company?: string;
  tags: string[];
  notes: string;
  dateAdded: Date;
  lastContacted?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  source?: string;
  avatarUrl?: string;
}

interface ContactsStore {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD Actions
  addContact: (contact: Omit<Contact, 'id' | 'dateAdded'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => Contact | undefined;
  
  // Selection & Filtering
  setSelectedContact: (contact: Contact | null) => void;
  searchContacts: (query: string) => Contact[];
  filterContactsByStatus: (status: ContactStatus) => Contact[];
  filterContactsByTags: (tags: string[]) => Contact[];
  
  // Batch Operations
  deleteMultipleContacts: (ids: string[]) => void;
  addTagToContacts: (ids: string[], tag: string) => void;
  removeTagFromContacts: (ids: string[], tag: string) => void;
  updateStatusForContacts: (ids: string[], status: ContactStatus) => void;
}

// Sample data
const sampleContacts: Contact[] = [
  {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    status: 'customer',
    company: 'Acme Inc',
    tags: ['vip', 'recurring'],
    notes: 'Long-term customer with multiple purchases',
    dateAdded: new Date('2023-01-15'),
    lastContacted: new Date('2023-05-20'),
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'USA'
    },
    source: 'Website',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
  },
  {
    id: uuidv4(),
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    status: 'lead',
    company: 'XYZ Corp',
    tags: ['new', 'high-value'],
    notes: 'Interested in premium package',
    dateAdded: new Date('2023-04-10'),
    lastContacted: new Date('2023-04-12'),
    source: 'Referral',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=4CAF50&color=fff'
  },
  {
    id: uuidv4(),
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@example.com',
    phone: '(555) 456-7890',
    status: 'prospect',
    company: 'Johnson LLC',
    tags: ['follow-up'],
    notes: 'Scheduled demo for next week',
    dateAdded: new Date('2023-03-22'),
    lastContacted: new Date('2023-05-01'),
    source: 'LinkedIn',
    avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=FF9800&color=fff'
  },
  {
    id: uuidv4(),
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@example.com',
    phone: '(555) 234-5678',
    status: 'inactive',
    tags: ['past-customer'],
    notes: 'Former client, subscription expired',
    dateAdded: new Date('2022-11-05'),
    lastContacted: new Date('2023-02-15'),
    source: 'Previous customer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=9C27B0&color=fff'
  },
];

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      contacts: sampleContacts,
      selectedContact: null,
      isLoading: false,
      error: null,
      
      // CRUD Actions
      addContact: (contactData) => {
        const newContact: Contact = {
          ...contactData,
          id: uuidv4(),
          dateAdded: new Date(),
        };
        
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
      },
      
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => 
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        }));
      },
      
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
          selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
        }));
      },
      
      getContactById: (id) => {
        return get().contacts.find((contact) => contact.id === id);
      },
      
      // Selection & Filtering
      setSelectedContact: (contact) => {
        set({ selectedContact: contact });
      },
      
      searchContacts: (query) => {
        const searchLower = query.toLowerCase();
        return get().contacts.filter((contact) => 
          contact.firstName.toLowerCase().includes(searchLower) ||
          contact.lastName.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower) ||
          contact.phone.includes(searchLower) ||
          contact.company?.toLowerCase().includes(searchLower) ||
          contact.notes.toLowerCase().includes(searchLower)
        );
      },
      
      filterContactsByStatus: (status) => {
        return get().contacts.filter((contact) => contact.status === status);
      },
      
      filterContactsByTags: (tags) => {
        return get().contacts.filter((contact) => 
          tags.some((tag) => contact.tags.includes(tag))
        );
      },
      
      // Batch Operations
      deleteMultipleContacts: (ids) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => !ids.includes(contact.id)),
          selectedContact: state.selectedContact && ids.includes(state.selectedContact.id)
            ? null
            : state.selectedContact,
        }));
      },
      
      addTagToContacts: (ids, tag) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => {
            if (ids.includes(contact.id) && !contact.tags.includes(tag)) {
              return { ...contact, tags: [...contact.tags, tag] };
            }
            return contact;
          }),
        }));
      },
      
      removeTagFromContacts: (ids, tag) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => {
            if (ids.includes(contact.id)) {
              return {
                ...contact,
                tags: contact.tags.filter((t) => t !== tag),
              };
            }
            return contact;
          }),
        }));
      },
      
      updateStatusForContacts: (ids, status) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => {
            if (ids.includes(contact.id)) {
              return { ...contact, status };
            }
            return contact;
          }),
        }));
      },
    }),
    {
      name: 'contacts-store',
      partialize: (state) => ({
        contacts: state.contacts,
      }),
    }
  )
);
