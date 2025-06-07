
import { create } from 'zustand';

export interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate: Date;
  publishedDate?: Date;
  mediaUrls?: string[];
  analytics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    clicks: number;
  };
  createdAt: Date;
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  isConnected: boolean;
  followers: number;
  avatar?: string;
}

export interface SocialAnalytics {
  platform: string;
  period: string;
  metrics: {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
  };
}

interface SocialMediaStore {
  posts: SocialPost[];
  accounts: SocialAccount[];
  analytics: SocialAnalytics[];
  selectedPost: SocialPost | null;
  setSelectedPost: (post: SocialPost | null) => void;
  schedulePost: (post: Omit<SocialPost, 'id' | 'createdAt'>) => void;
  publishPost: (postId: string) => void;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  connectAccount: (account: Omit<SocialAccount, 'id'>) => void;
  disconnectAccount: (accountId: string) => void;
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Exciting news! We just launched our new feature that will help you boost your productivity by 50%. Check it out! #productivity #newfeature',
    platforms: ['facebook', 'twitter', 'linkedin'],
    status: 'published',
    scheduledDate: new Date('2025-01-05T10:00:00'),
    publishedDate: new Date('2025-01-05T10:00:00'),
    analytics: {
      likes: 142,
      comments: 23,
      shares: 18,
      reach: 3240,
      clicks: 156
    },
    createdAt: new Date('2025-01-05T09:30:00')
  },
  {
    id: '2',
    content: 'Behind the scenes: Our team working hard to bring you the best customer experience. We appreciate your feedback! 💪',
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    scheduledDate: new Date('2025-01-08T14:00:00'),
    createdAt: new Date('2025-01-06T11:00:00')
  },
  {
    id: '3',
    content: 'Monday motivation: Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill',
    platforms: ['linkedin', 'twitter'],
    status: 'draft',
    scheduledDate: new Date('2025-01-09T09:00:00'),
    createdAt: new Date('2025-01-06T16:00:00')
  }
];

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'facebook',
    username: 'company.page',
    displayName: 'Company Name',
    isConnected: true,
    followers: 12540
  },
  {
    id: '2',
    platform: 'instagram',
    username: 'company_official',
    displayName: 'Company Official',
    isConnected: true,
    followers: 8932
  },
  {
    id: '3',
    platform: 'twitter',
    username: 'company_inc',
    displayName: 'Company Inc',
    isConnected: true,
    followers: 5421
  },
  {
    id: '4',
    platform: 'linkedin',
    username: 'company-name',
    displayName: 'Company Name',
    isConnected: true,
    followers: 3876
  }
];

const mockAnalytics: SocialAnalytics[] = [
  {
    platform: 'facebook',
    period: 'last_30_days',
    metrics: {
      followers: 12540,
      engagement: 8.2,
      reach: 45000,
      impressions: 67000
    }
  },
  {
    platform: 'instagram',
    period: 'last_30_days',
    metrics: {
      followers: 8932,
      engagement: 12.5,
      reach: 32000,
      impressions: 48000
    }
  },
  {
    platform: 'twitter',
    period: 'last_30_days',
    metrics: {
      followers: 5421,
      engagement: 6.8,
      reach: 18000,
      impressions: 25000
    }
  },
  {
    platform: 'linkedin',
    period: 'last_30_days',
    metrics: {
      followers: 3876,
      engagement: 15.2,
      reach: 12000,
      impressions: 18000
    }
  }
];

export const useSocialMediaStore = create<SocialMediaStore>((set, get) => ({
  posts: mockPosts,
  accounts: mockAccounts,
  analytics: mockAnalytics,
  selectedPost: null,

  setSelectedPost: (post) => set({ selectedPost: post }),

  schedulePost: (post) => set((state) => ({
    posts: [...state.posts, {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date()
    }]
  })),

  publishPost: (postId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId 
        ? { ...post, status: 'published', publishedDate: new Date() }
        : post
    )
  })),

  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === id ? { ...post, ...updates } : post
    )
  })),

  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id)
  })),

  connectAccount: (account) => set((state) => ({
    accounts: [...state.accounts, {
      ...account,
      id: Date.now().toString()
    }]
  })),

  disconnectAccount: (accountId) => set((state) => ({
    accounts: state.accounts.map(account =>
      account.id === accountId 
        ? { ...account, isConnected: false }
        : account
    )
  }))
}));
