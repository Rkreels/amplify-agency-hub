
import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact' | 'system';
  type: 'text' | 'image' | 'file' | 'voice';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  channel: 'sms' | 'email' | 'facebook' | 'instagram' | 'whatsapp' | 'webchat';
  messages: Message[];
  unreadCount: number;
  lastMessageAt: Date;
  status: 'active' | 'closed' | 'pending';
  assignedTo?: string;
  tags: string[];
  notes: string;
}

interface ConversationStore {
  conversations: Conversation[];
  selectedConversationId: string | null;
  searchQuery: string;
  channelFilter: string;
  statusFilter: string;
  isTyping: boolean;
  addConversation: (conversation: Omit<Conversation, 'id'>) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  markAsRead: (conversationId: string) => void;
  setSelectedConversation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setChannelFilter: (channel: string) => void;
  setStatusFilter: (status: string) => void;
  setTyping: (typing: boolean) => void;
  getFilteredConversations: () => Conversation[];
  getSelectedConversation: () => Conversation | null;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [
    {
      id: '1',
      contactId: '1',
      contactName: 'John Smith',
      contactAvatar: '',
      channel: 'sms',
      messages: [
        {
          id: '1',
          content: 'Hi, I\'m interested in your services',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          sender: 'contact',
          type: 'text',
          status: 'read'
        },
        {
          id: '2',
          content: 'Hello John! Thanks for reaching out. How can I help you today?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          sender: 'user',
          type: 'text',
          status: 'delivered'
        }
      ],
      unreadCount: 0,
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active',
      assignedTo: 'Sarah Johnson',
      tags: ['prospect', 'hot-lead'],
      notes: 'Interested in web design services'
    },
    {
      id: '2',
      contactId: '2',
      contactName: 'Jane Doe',
      contactAvatar: '',
      channel: 'email',
      messages: [
        {
          id: '3',
          content: 'Can you send me a quote for SEO services?',
          timestamp: new Date(Date.now() - 120 * 60 * 1000),
          sender: 'contact',
          type: 'text',
          status: 'read'
        }
      ],
      unreadCount: 1,
      lastMessageAt: new Date(Date.now() - 120 * 60 * 1000),
      status: 'pending',
      tags: ['quote-request'],
      notes: ''
    }
  ],
  selectedConversationId: null,
  searchQuery: '',
  channelFilter: '',
  statusFilter: '',
  isTyping: false,
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, { ...conversation, id: Date.now().toString() }]
  })),
  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === id ? { ...conv, ...updates } : conv
    )
  })),
  deleteConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(conv => conv.id !== id)
  })),
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === conversationId ? {
        ...conv,
        messages: [...conv.messages, { ...message, id: Date.now().toString() }],
        lastMessageAt: new Date(),
        unreadCount: message.sender === 'contact' ? conv.unreadCount + 1 : conv.unreadCount
      } : conv
    )
  })),
  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    )
  })),
  setSelectedConversation: (id) => set({ selectedConversationId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setChannelFilter: (channel) => set({ channelFilter: channel }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTyping: (typing) => set({ isTyping: typing }),
  getFilteredConversations: () => {
    const { conversations, searchQuery, channelFilter, statusFilter } = get();
    return conversations.filter(conv => {
      if (searchQuery && !conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (channelFilter && channelFilter !== 'all' && conv.channel !== channelFilter) return false;
      if (statusFilter && statusFilter !== 'all' && conv.status !== statusFilter) return false;
      return true;
    });
  },
  getSelectedConversation: () => {
    const { conversations, selectedConversationId } = get();
    return conversations.find(conv => conv.id === selectedConversationId) || null;
  }
}));
