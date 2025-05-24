
import { create } from 'zustand';

export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video' | 'location' | 'contact' | 'template';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type ConversationChannel = 'sms' | 'email' | 'facebook' | 'instagram' | 'whatsapp' | 'webchat' | 'phone';
export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'spam';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  isFromContact: boolean;
  timestamp: Date;
  attachments?: {
    url: string;
    type: string;
    name: string;
    size: number;
  }[];
  metadata?: {
    location?: { lat: number; lng: number; address: string };
    contact?: { name: string; phone: string };
    template?: { name: string; variables: Record<string, string> };
  };
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: Date;
  }[];
  editedAt?: Date;
  deletedAt?: Date;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactPhone?: string;
  contactEmail?: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  assignedAt?: Date;
  tags: string[];
  lastMessage: Message | null;
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    source?: string;
    campaign?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  };
  customFields?: Record<string, any>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  language?: string;
  timezone?: string;
}

export interface ConversationTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: 'greeting' | 'follow-up' | 'closing' | 'support' | 'sales';
  channel: ConversationChannel[];
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutoReply {
  id: string;
  name: string;
  trigger: {
    type: 'keyword' | 'time_based' | 'first_message' | 'business_hours';
    keywords?: string[];
    timeDelay?: number;
    businessHours?: {
      enabled: boolean;
      timezone: string;
      schedule: Record<string, { start: string; end: string; enabled: boolean }>;
    };
  };
  response: {
    type: 'text' | 'template';
    content: string;
    templateId?: string;
  };
  channels: ConversationChannel[];
  isActive: boolean;
  conditions?: {
    tags?: string[];
    assignedAgent?: string;
    conversationStatus?: ConversationStatus[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationAnalytics {
  period: 'today' | 'week' | 'month' | 'quarter';
  metrics: {
    totalConversations: number;
    averageResponseTime: number;
    resolutionRate: number;
    customerSatisfaction: number;
    messageVolume: number;
    activeAgents: number;
  };
  channelBreakdown: Record<ConversationChannel, number>;
  responseTimeBreakdown: {
    under1min: number;
    under5min: number;
    under15min: number;
    under1hour: number;
    over1hour: number;
  };
  satisfactionBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface ConversationsStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  templates: ConversationTemplate[];
  autoReplies: AutoReply[];
  analytics: ConversationAnalytics;
  selectedConversation: Conversation | null;
  searchQuery: string;
  statusFilter: ConversationStatus | 'all';
  channelFilter: ConversationChannel | 'all';
  assigneeFilter: string;
  unreadOnly: boolean;
  
  // Conversation actions
  setSelectedConversation: (conversation: Conversation | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ConversationStatus | 'all') => void;
  setChannelFilter: (channel: ConversationChannel | 'all') => void;
  setAssigneeFilter: (assignee: string) => void;
  setUnreadOnly: (unreadOnly: boolean) => void;
  
  // Message actions
  sendMessage: (conversationId: string, content: string, type?: MessageType) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  markAsRead: (conversationId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  
  // Conversation management
  updateConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  assignConversation: (conversationId: string, assignee: string) => void;
  addConversationTag: (conversationId: string, tag: string) => void;
  removeConversationTag: (conversationId: string, tag: string) => void;
  archiveConversation: (conversationId: string) => void;
  muteConversation: (conversationId: string) => void;
  
  // Template management
  addTemplate: (template: Omit<ConversationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  updateTemplate: (id: string, updates: Partial<ConversationTemplate>) => void;
  deleteTemplate: (id: string) => void;
  useTemplate: (templateId: string, variables: Record<string, string>) => string;
  
  // Auto-reply management
  addAutoReply: (autoReply: Omit<AutoReply, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAutoReply: (id: string, updates: Partial<AutoReply>) => void;
  deleteAutoReply: (id: string) => void;
  
  // Bulk actions
  bulkAssign: (conversationIds: string[], assignee: string) => void;
  bulkUpdateStatus: (conversationIds: string[], status: ConversationStatus) => void;
  bulkArchive: (conversationIds: string[]) => void;
  
  // Analytics
  getAnalytics: (period: ConversationAnalytics['period']) => ConversationAnalytics;
  getAgentPerformance: (agentId: string, period: string) => any;
}

// Enhanced mock data
const mockTemplates: ConversationTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message',
    content: 'Hi {{name}}! Welcome to {{company}}. How can I help you today?',
    variables: ['name', 'company'],
    category: 'greeting',
    channel: ['sms', 'webchat', 'whatsapp'],
    isActive: true,
    usageCount: 156,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    content: 'Hi {{name}}, just following up on our conversation. Did you have any other questions?',
    variables: ['name'],
    category: 'follow-up',
    channel: ['sms', 'email'],
    isActive: true,
    usageCount: 89,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  }
];

const mockAutoReplies: AutoReply[] = [
  {
    id: '1',
    name: 'Business Hours Auto-Reply',
    trigger: {
      type: 'business_hours',
      businessHours: {
        enabled: true,
        timezone: 'America/Los_Angeles',
        schedule: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '09:00', end: '17:00', enabled: false },
          sunday: { start: '09:00', end: '17:00', enabled: false }
        }
      }
    },
    response: {
      type: 'text',
      content: 'Thanks for reaching out! We\'re currently outside business hours but will get back to you soon.'
    },
    channels: ['sms', 'webchat'],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  }
];

const mockAnalytics: ConversationAnalytics = {
  period: 'month',
  metrics: {
    totalConversations: 1247,
    averageResponseTime: 4.2,
    resolutionRate: 87.5,
    customerSatisfaction: 4.6,
    messageVolume: 5678,
    activeAgents: 8
  },
  channelBreakdown: {
    sms: 456,
    email: 234,
    facebook: 189,
    instagram: 123,
    whatsapp: 167,
    webchat: 78,
    phone: 0
  },
  responseTimeBreakdown: {
    under1min: 45,
    under5min: 32,
    under15min: 15,
    under1hour: 6,
    over1hour: 2
  },
  satisfactionBreakdown: {
    positive: 78,
    neutral: 18,
    negative: 4
  }
};

// Enhanced mock conversations with more data
const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'Sarah Johnson',
    contactAvatar: '/placeholder.svg',
    contactPhone: '+1-555-0123',
    contactEmail: 'sarah@example.com',
    channel: 'sms',
    status: 'open',
    priority: 'high',
    assignedTo: 'John Doe',
    assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['lead', 'vip'],
    lastMessage: null,
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
    isArchived: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    metadata: {
      source: 'website_form',
      campaign: 'spring_sale_2024',
      referrer: 'google.com'
    },
    sentiment: 'positive',
    language: 'en',
    timezone: 'America/Los_Angeles'
  },
  // ... more conversations
];

// Enhanced mock messages
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      content: 'Hi! I\'m interested in your pricing plans.',
      type: 'text',
      status: 'read',
      isFromContact: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      conversationId: '1',
      content: 'Hi Sarah! I\'d be happy to help you with pricing information. What type of plan are you looking for?',
      type: 'text',
      status: 'read',
      isFromContact: false,
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
    },
    {
      id: '3',
      conversationId: '1',
      content: 'I need something for a team of about 20 people.',
      type: 'text',
      status: 'delivered',
      isFromContact: true,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    }
  ]
};

export const useConversationsStore = create<ConversationsStore>((set, get) => ({
  conversations: mockConversations,
  messages: mockMessages,
  templates: mockTemplates,
  autoReplies: mockAutoReplies,
  analytics: mockAnalytics,
  selectedConversation: null,
  searchQuery: '',
  statusFilter: 'all',
  channelFilter: 'all',
  assigneeFilter: '',
  unreadOnly: false,

  // Conversation actions
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setChannelFilter: (channel) => set({ channelFilter: channel }),
  setAssigneeFilter: (assignee) => set({ assigneeFilter: assignee }),
  setUnreadOnly: (unreadOnly) => set({ unreadOnly }),

  // Message actions
  sendMessage: (conversationId, content, type = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      type,
      status: 'sent',
      isFromContact: false,
      timestamp: new Date()
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage]
      },
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage, lastMessageAt: new Date(), updatedAt: new Date() }
          : conv
      )
    }));
  },

  editMessage: (messageId, content) => set((state) => {
    const updatedMessages = { ...state.messages };
    Object.keys(updatedMessages).forEach(conversationId => {
      updatedMessages[conversationId] = updatedMessages[conversationId].map(message =>
        message.id === messageId 
          ? { ...message, content, editedAt: new Date() }
          : message
      );
    });
    return { messages: updatedMessages };
  }),

  deleteMessage: (messageId) => set((state) => {
    const updatedMessages = { ...state.messages };
    Object.keys(updatedMessages).forEach(conversationId => {
      updatedMessages[conversationId] = updatedMessages[conversationId].map(message =>
        message.id === messageId 
          ? { ...message, deletedAt: new Date() }
          : message
      );
    });
    return { messages: updatedMessages };
  }),

  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    )
  })),

  addReaction: (messageId, emoji, userId) => set((state) => {
    const updatedMessages = { ...state.messages };
    Object.keys(updatedMessages).forEach(conversationId => {
      updatedMessages[conversationId] = updatedMessages[conversationId].map(message =>
        message.id === messageId 
          ? { 
              ...message, 
              reactions: [
                ...(message.reactions || []),
                { userId, emoji, timestamp: new Date() }
              ]
            }
          : message
      );
    });
    return { messages: updatedMessages };
  }),

  // Conversation management
  updateConversationStatus: (conversationId, status) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, status, updatedAt: new Date() } : conv
    )
  })),

  assignConversation: (conversationId, assignee) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId 
        ? { ...conv, assignedTo: assignee, assignedAt: new Date(), updatedAt: new Date() }
        : conv
    )
  })),

  addConversationTag: (conversationId, tag) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId 
        ? { ...conv, tags: [...conv.tags, tag], updatedAt: new Date() }
        : conv
    )
  })),

  removeConversationTag: (conversationId, tag) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId 
        ? { ...conv, tags: conv.tags.filter(t => t !== tag), updatedAt: new Date() }
        : conv
    )
  })),

  archiveConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, isArchived: true, updatedAt: new Date() } : conv
    )
  })),

  muteConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, isMuted: !conv.isMuted, updatedAt: new Date() } : conv
    )
  })),

  // Template management
  addTemplate: (template) => set((state) => ({
    templates: [...state.templates, {
      ...template,
      id: Date.now().toString(),
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map(template =>
      template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
    )
  })),

  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(template => template.id !== id)
  })),

  useTemplate: (templateId, variables) => {
    const { templates } = get();
    const template = templates.find(t => t.id === templateId);
    if (!template) return '';

    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Increment usage count
    set((state) => ({
      templates: state.templates.map(t =>
        t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
      )
    }));

    return content;
  },

  // Auto-reply management
  addAutoReply: (autoReply) => set((state) => ({
    autoReplies: [...state.autoReplies, {
      ...autoReply,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateAutoReply: (id, updates) => set((state) => ({
    autoReplies: state.autoReplies.map(autoReply =>
      autoReply.id === id ? { ...autoReply, ...updates, updatedAt: new Date() } : autoReply
    )
  })),

  deleteAutoReply: (id) => set((state) => ({
    autoReplies: state.autoReplies.filter(autoReply => autoReply.id !== id)
  })),

  // Bulk actions
  bulkAssign: (conversationIds, assignee) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conversationIds.includes(conv.id)
        ? { ...conv, assignedTo: assignee, assignedAt: new Date(), updatedAt: new Date() }
        : conv
    )
  })),

  bulkUpdateStatus: (conversationIds, status) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conversationIds.includes(conv.id)
        ? { ...conv, status, updatedAt: new Date() }
        : conv
    )
  })),

  bulkArchive: (conversationIds) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conversationIds.includes(conv.id)
        ? { ...conv, isArchived: true, updatedAt: new Date() }
        : conv
    )
  })),

  // Analytics
  getAnalytics: (period) => {
    // Implementation would calculate real analytics based on conversation data
    return mockAnalytics;
  },

  getAgentPerformance: (agentId, period) => {
    const { conversations } = get();
    const agentConversations = conversations.filter(conv => conv.assignedTo === agentId);
    
    return {
      totalConversations: agentConversations.length,
      averageResponseTime: 3.2,
      resolutionRate: 92.1,
      customerSatisfaction: 4.7
    };
  }
}));
