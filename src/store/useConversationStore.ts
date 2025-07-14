
import { create } from 'zustand';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'agent' | 'system';
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: any[];
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'facebook' | 'instagram' | 'webchat' | 'phone';
  messages: Message[];
  unreadCount: number;
  lastMessageAt: Date;
  status: 'active' | 'snoozed' | 'closed' | 'spam';
  assignedTo?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationStore {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterChannel: string;
  sortBy: 'recent' | 'oldest' | 'priority' | 'unread';
  
  // CRUD Operations
  loadConversations: () => Promise<void>;
  createConversation: (data: Partial<Conversation>) => Promise<void>;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  
  // Message Operations
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  
  // Filters and Search
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterChannel: (channel: string) => void;
  setSortBy: (sort: 'recent' | 'oldest' | 'priority' | 'unread') => void;
  getFilteredConversations: () => Conversation[];
  
  // Selection
  setSelectedConversation: (conversation: Conversation | null) => void;
  
  // Bulk Operations
  bulkUpdateStatus: (ids: string[], status: Conversation['status']) => Promise<void>;
  bulkAssign: (ids: string[], agentId: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  
  // Real-time features
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  updatePresence: (conversationId: string, isOnline: boolean) => void;
}

// Mock data
const generateMockConversations = (): Conversation[] => [
  {
    id: '1',
    contactId: 'contact-1',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@example.com',
    contactPhone: '+1234567890',
    channel: 'email',
    messages: [
      {
        id: 'msg-1',
        content: 'Hi, I\'m interested in your services. Can you provide more information?',
        timestamp: new Date(Date.now() - 3600000),
        sender: 'user',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg-2',
        content: 'Hello Sarah! I\'d be happy to help you with information about our services. What specific area are you interested in?',
        timestamp: new Date(Date.now() - 3000000),
        sender: 'agent',
        type: 'text',
        status: 'read'
      }
    ],
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 3000000),
    status: 'active',
    assignedTo: 'agent-1',
    tags: ['lead', 'interested'],
    priority: 'high',
    source: 'website',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3000000)
  },
  {
    id: '2',
    contactId: 'contact-2',
    contactName: 'Mike Chen',
    contactEmail: 'mike@example.com',
    channel: 'webchat',
    messages: [
      {
        id: 'msg-3',
        content: 'Can you help me with my account?',
        timestamp: new Date(Date.now() - 1800000),
        sender: 'user',
        type: 'text',
        status: 'delivered'
      }
    ],
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 1800000),
    status: 'active',
    tags: ['support'],
    priority: 'medium',
    source: 'webchat',
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000)
  }
];

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: generateMockConversations(),
  selectedConversation: null,
  isLoading: false,
  searchQuery: '',
  filterStatus: '',
  filterChannel: '',
  sortBy: 'recent',

  loadConversations: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ 
      conversations: generateMockConversations(),
      isLoading: false 
    });
  },

  createConversation: async (data) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      contactId: data.contactId || Date.now().toString(),
      contactName: data.contactName || 'Unknown Contact',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      channel: data.channel || 'webchat',
      messages: data.messages || [],
      unreadCount: 0,
      lastMessageAt: new Date(),
      status: 'active',
      assignedTo: data.assignedTo,
      tags: data.tags || [],
      priority: data.priority || 'medium',
      source: data.source || 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      conversations: [newConversation, ...state.conversations]
    }));
    
    toast.success('Conversation created successfully');
  },

  updateConversation: async (id, updates) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === id 
          ? { ...conv, ...updates, updatedAt: new Date() }
          : conv
      ),
      selectedConversation: state.selectedConversation?.id === id
        ? { ...state.selectedConversation, ...updates, updatedAt: new Date() }
        : state.selectedConversation
    }));
    
    toast.success('Conversation updated');
  },

  deleteConversation: async (id) => {
    set(state => ({
      conversations: state.conversations.filter(conv => conv.id !== id),
      selectedConversation: state.selectedConversation?.id === id 
        ? null 
        : state.selectedConversation
    }));
    
    toast.success('Conversation deleted');
  },

  sendMessage: async (conversationId, messageData) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'sent',
      ...messageData
    };

    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageAt: new Date(),
              updatedAt: new Date(),
              unreadCount: messageData.sender === 'user' ? conv.unreadCount + 1 : conv.unreadCount
            }
          : conv
      ),
      selectedConversation: state.selectedConversation?.id === conversationId
        ? {
            ...state.selectedConversation,
            messages: [...state.selectedConversation.messages, newMessage],
            lastMessageAt: new Date(),
            updatedAt: new Date()
          }
        : state.selectedConversation
    }));

    // Simulate message delivery
    setTimeout(() => {
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === newMessage.id
                    ? { ...msg, status: 'delivered' }
                    : msg
                )
              }
            : conv
        )
      }));
    }, 1000);
  },

  updateMessage: async (conversationId, messageId, updates) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              )
            }
          : conv
      )
    }));
  },

  deleteMessage: async (conversationId, messageId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.filter(msg => msg.id !== messageId)
            }
          : conv
      )
    }));
    
    toast.success('Message deleted');
  },

  markAsRead: async (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterChannel: (channel) => set({ filterChannel: channel }),
  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredConversations: () => {
    const { conversations, searchQuery, filterStatus, filterChannel, sortBy } = get();
    
    let filtered = conversations.filter(conv => {
      if (searchQuery && !conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterStatus && conv.status !== filterStatus) {
        return false;
      }
      if (filterChannel && conv.channel !== filterChannel) {
        return false;
      }
      return true;
    });

    // Sort conversations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
        case 'oldest':
          return a.lastMessageAt.getTime() - b.lastMessageAt.getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'unread':
          return b.unreadCount - a.unreadCount;
        default:
          return 0;
      }
    });

    return filtered;
  },

  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation });
    if (conversation && conversation.unreadCount > 0) {
      get().markAsRead(conversation.id);
    }
  },

  bulkUpdateStatus: async (ids, status) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        ids.includes(conv.id)
          ? { ...conv, status, updatedAt: new Date() }
          : conv
      )
    }));
    
    toast.success(`${ids.length} conversations updated`);
  },

  bulkAssign: async (ids, agentId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        ids.includes(conv.id)
          ? { ...conv, assignedTo: agentId, updatedAt: new Date() }
          : conv
      )
    }));
    
    toast.success(`${ids.length} conversations assigned`);
  },

  bulkDelete: async (ids) => {
    set(state => ({
      conversations: state.conversations.filter(conv => !ids.includes(conv.id)),
      selectedConversation: ids.includes(state.selectedConversation?.id || '')
        ? null
        : state.selectedConversation
    }));
    
    toast.success(`${ids.length} conversations deleted`);
  },

  startTyping: (conversationId) => {
    // Real-time typing indicator logic
    console.log(`User started typing in conversation ${conversationId}`);
  },

  stopTyping: (conversationId) => {
    console.log(`User stopped typing in conversation ${conversationId}`);
  },

  updatePresence: (conversationId, isOnline) => {
    console.log(`Presence updated for conversation ${conversationId}: ${isOnline}`);
  }
}));
