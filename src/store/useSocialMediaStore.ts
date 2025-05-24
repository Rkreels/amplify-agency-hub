
import { create } from 'zustand';

export interface SocialPost {
  id: string;
  content: string;
  media: {
    type: 'image' | 'video' | 'carousel';
    urls: string[];
    alt?: string;
  }[];
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok')[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: Date;
  publishedAt?: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    clicks: number;
  };
  hashtags: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface SocialCalendar {
  date: string;
  posts: SocialPost[];
}

export interface SocialAnalytics {
  platform: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    followers: { current: number; change: number };
    engagement: { current: number; change: number };
    reach: { current: number; change: number };
    impressions: { current: number; change: number };
    clicks: { current: number; change: number };
  };
  topPosts: SocialPost[];
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
}

interface SocialMediaStore {
  posts: SocialPost[];
  accounts: SocialAccount[];
  calendar: SocialCalendar[];
  analytics: SocialAnalytics[];
  selectedPost: SocialPost | null;
  contentQueue: SocialPost[];
  setSelectedPost: (post: SocialPost | null) => void;
  addPost: (post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  schedulePost: (id: string, scheduledAt: Date) => void;
  publishPost: (id: string) => void;
  duplicatePost: (id: string) => void;
  addAccount: (account: Omit<SocialAccount, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<SocialAccount>) => void;
  disconnectAccount: (id: string) => void;
  bulkSchedule: (postIds: string[], dates: Date[]) => void;
  getPostsByPlatform: (platform: string) => SocialPost[];
  getScheduledPosts: () => SocialPost[];
}

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'facebook',
    username: 'company.page',
    displayName: 'Company Page',
    avatar: '/placeholder.svg',
    followers: 12450,
    isConnected: true,
  },
  {
    id: '2',
    platform: 'instagram',
    username: 'company_official',
    displayName: 'Company Official',
    avatar: '/placeholder.svg',
    followers: 8932,
    isConnected: true,
  },
  {
    id: '3',
    platform: 'twitter',
    username: 'company',
    displayName: 'Company',
    avatar: '/placeholder.svg',
    followers: 5621,
    isConnected: true,
  },
  {
    id: '4',
    platform: 'linkedin',
    username: 'company',
    displayName: 'Company',
    avatar: '/placeholder.svg',
    followers: 3487,
    isConnected: false,
  }
];

const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Excited to announce our new product launch! 🚀 #innovation #tech',
    media: [
      {
        type: 'image',
        urls: ['/placeholder.svg']
      }
    ],
    platforms: ['facebook', 'instagram', 'twitter'],
    status: 'published',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    engagement: {
      likes: 234,
      comments: 45,
      shares: 67,
      views: 2890,
      clicks: 123
    },
    hashtags: ['innovation', 'tech'],
    mentions: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    content: 'Behind the scenes at our office! Check out our amazing team working on the next big thing.',
    media: [
      {
        type: 'video',
        urls: ['/placeholder.svg']
      }
    ],
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      clicks: 0
    },
    hashtags: ['behindthescenes', 'team'],
    mentions: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  }
];

const mockAnalytics: SocialAnalytics[] = [
  {
    platform: 'facebook',
    period: 'month',
    metrics: {
      followers: { current: 12450, change: 234 },
      engagement: { current: 4.2, change: 0.3 },
      reach: { current: 45678, change: 2341 },
      impressions: { current: 123456, change: 5678 },
      clicks: { current: 2345, change: 123 }
    },
    topPosts: [mockPosts[0]],
    demographics: {
      age: { '18-24': 25, '25-34': 35, '35-44': 22, '45+': 18 },
      gender: { 'male': 52, 'female': 48 },
      location: { 'US': 60, 'UK': 15, 'Canada': 10, 'Other': 15 }
    }
  }
];

export const useSocialMediaStore = create<SocialMediaStore>((set, get) => ({
  posts: mockPosts,
  accounts: mockAccounts,
  calendar: [],
  analytics: mockAnalytics,
  selectedPost: null,
  contentQueue: [],

  setSelectedPost: (post) => set({ selectedPost: post }),

  addPost: (post) => set((state) => ({
    posts: [...state.posts, {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
    )
  })),

  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id)
  })),

  schedulePost: (id, scheduledAt) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === id 
        ? { ...post, status: 'scheduled', scheduledAt, updatedAt: new Date() }
        : post
    )
  })),

  publishPost: (id) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === id 
        ? { ...post, status: 'published', publishedAt: new Date(), updatedAt: new Date() }
        : post
    )
  })),

  duplicatePost: (id) => set((state) => {
    const post = state.posts.find(p => p.id === id);
    if (!post) return state;

    const duplicated = {
      ...post,
      id: Date.now().toString(),
      content: `${post.content} (Copy)`,
      status: 'draft' as const,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        clicks: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      posts: [...state.posts, duplicated]
    };
  }),

  addAccount: (account) => set((state) => ({
    accounts: [...state.accounts, { ...account, id: Date.now().toString() }]
  })),

  updateAccount: (id, updates) => set((state) => ({
    accounts: state.accounts.map(account =>
      account.id === id ? { ...account, ...updates } : account
    )
  })),

  disconnectAccount: (id) => set((state) => ({
    accounts: state.accounts.map(account =>
      account.id === id ? { ...account, isConnected: false } : account
    )
  })),

  bulkSchedule: (postIds, dates) => set((state) => ({
    posts: state.posts.map(post => {
      const index = postIds.indexOf(post.id);
      if (index !== -1 && dates[index]) {
        return {
          ...post,
          status: 'scheduled',
          scheduledAt: dates[index],
          updatedAt: new Date()
        };
      }
      return post;
    })
  })),

  getPostsByPlatform: (platform) => {
    const { posts } = get();
    return posts.filter(post => post.platforms.includes(platform as any));
  },

  getScheduledPosts: () => {
    const { posts } = get();
    return posts.filter(post => post.status === 'scheduled');
  }
}));
