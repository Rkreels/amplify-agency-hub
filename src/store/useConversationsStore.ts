
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
