
import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  type: 'text' | 'image' | 'file';
  read: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  channel: 'SMS' | 'Email' | 'WhatsApp' | 'Facebook' | 'Instagram';
  status: 'active' | 'archived' | 'closed';
  messages: Message[];
  tags: string[];
}

interface ConversationsStore {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  activeFilter: string;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  markAsRead: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  addConversation: (conversation: Omit<Conversation, 'id'>) => void;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: 'contact-1',
    contactName: 'Sarah Johnson',
    contactAvatar: undefined,
    lastMessage: 'Thanks for the update on the project timeline.',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 2,
    channel: 'SMS',
    status: 'active',
    tags: ['VIP', 'Project'],
    messages: [
      {
        id: 'msg-1',
        content: 'Hi Sarah, here\'s the updated timeline for your project.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        sender: 'user',
        type: 'text',
        read: true
      },
      {
        id: 'msg-2',
        content: 'Thanks for the update on the project timeline.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'contact',
        type: 'text',
        read: false
      }
    ]
  },
  {
    id: '2',
    contactId: 'contact-2',
    contactName: 'Michael Brown',
    contactAvatar: undefined,
    lastMessage: 'Can we schedule a call for tomorrow?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 0,
    channel: 'Email',
    status: 'active',
    tags: ['Lead'],
    messages: [
      {
        id: 'msg-3',
        content: 'Can we schedule a call for tomorrow?',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        sender: 'contact',
        type: 'text',
        read: true
      }
    ]
  },
  {
    id: '3',
    contactId: 'contact-3',
    contactName: 'Emma Davis',
    contactAvatar: undefined,
    lastMessage: 'I\'m interested in your marketing services. Could you send me more details?',
    lastMessageTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    unreadCount: 1,
    channel: 'WhatsApp',
    status: 'active',
    tags: ['Hot Lead', 'Marketing'],
    messages: [
      {
        id: 'msg-4',
        content: 'I\'m interested in your marketing services. Could you send me more details?',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        sender: 'contact',
        type: 'text',
        read: false
      }
    ]
  },
  {
    id: '4',
    contactId: 'contact-4',
    contactName: 'James Wilson',
    contactAvatar: undefined,
    lastMessage: 'The proposal looks great! When can we start?',
    lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
    unreadCount: 0,
    channel: 'Facebook',
    status: 'active',
    tags: ['Closing', 'Proposal'],
    messages: [
      {
        id: 'msg-5',
        content: 'Here\'s the detailed proposal for your review.',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
        sender: 'user',
        type: 'text',
        read: true
      },
      {
        id: 'msg-6',
        content: 'The proposal looks great! When can we start?',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        sender: 'contact',
        type: 'text',
        read: true
      }
    ]
  },
  {
    id: '5',
    contactId: 'contact-5',
    contactName: 'Lisa Anderson',
    contactAvatar: undefined,
    lastMessage: 'Payment processed successfully. Thank you!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    channel: 'Instagram',
    status: 'active',
    tags: ['Customer', 'Paid'],
    messages: [
      {
        id: 'msg-7',
        content: 'Your invoice is ready for payment.',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        sender: 'user',
        type: 'text',
        read: true
      },
      {
        id: 'msg-8',
        content: 'Payment processed successfully. Thank you!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        sender: 'contact',
        type: 'text',
        read: true
      }
    ]
  }
];

export const useConversationsStore = create<ConversationsStore>((set, get) => ({
  conversations: mockConversations,
  selectedConversation: null,
  searchQuery: '',
  activeFilter: 'all',
  
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === conversationId 
        ? {
            ...conv,
            messages: [...conv.messages, { ...message, id: Date.now().toString() }],
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: message.sender === 'contact' ? conv.unreadCount + 1 : conv.unreadCount
          }
        : conv
    )
  })),
  
  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    )
  })),
  
  archiveConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, status: 'archived' } : conv
    )
  })),
  
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, { ...conversation, id: Date.now().toString() }]
  }))
}));
