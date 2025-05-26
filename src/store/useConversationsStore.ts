
import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  type: 'text' | 'image' | 'file' | 'audio';
  read: boolean;
  metadata?: Record<string, any>;
}

export type ConversationStatus = 'active' | 'inactive' | 'archived';
export type ConversationChannel = 'SMS' | 'Email' | 'WhatsApp' | 'Facebook' | 'Instagram';

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  tags: string[];
  messages: Message[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationsStore {
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
  addConversation: (conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! I have a question about your pricing.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sender: 'contact',
    type: 'text',
    read: true
  },
  {
    id: '2',
    content: 'Hello! I\'d be happy to help you with pricing questions. What specific information are you looking for?',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    sender: 'user',
    type: 'text',
    read: true
  },
  {
    id: '3',
    content: 'I\'m interested in the enterprise plan. Can you tell me more about the features?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    sender: 'contact',
    type: 'text',
    read: false
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'Sarah Johnson',
    contactAvatar: '/placeholder.svg',
    channel: 'SMS',
    status: 'active',
    lastMessage: 'I\'m interested in the enterprise plan. Can you tell me more about the features?',
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 1,
    tags: ['prospect', 'enterprise'],
    messages: mockMessages,
    assignedTo: 'John Doe',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: '2',
    contactId: '2',
    contactName: 'Michael Brown',
    contactAvatar: '/placeholder.svg',
    channel: 'Email',
    status: 'active',
    lastMessage: 'Thanks for the quick response!',
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 0,
    tags: ['customer'],
    messages: [],
    assignedTo: 'Jane Smith',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
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
            updatedAt: new Date()
          }
        : conv
    ),
    selectedConversation: state.selectedConversation?.id === conversationId
      ? {
          ...state.selectedConversation,
          messages: [...state.selectedConversation.messages, { ...message, id: Date.now().toString() }],
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          updatedAt: new Date()
        }
      : state.selectedConversation
  })),

  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ),
    selectedConversation: state.selectedConversation?.id === conversationId
      ? { ...state.selectedConversation, unreadCount: 0 }
      : state.selectedConversation
  })),

  archiveConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, status: 'archived' as ConversationStatus } : conv
    ),
    selectedConversation: state.selectedConversation?.id === conversationId
      ? { ...state.selectedConversation, status: 'archived' as ConversationStatus }
      : state.selectedConversation
  })),

  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, {
      ...conversation,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv
    )
  })),

  deleteConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(conv => conv.id !== id)
  }))
}));
