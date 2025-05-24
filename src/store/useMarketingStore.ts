
import { create } from 'zustand';

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'ads';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  target: {
    audience: string;
    demographics: string[];
    interests: string[];
  };
  content: {
    subject?: string;
    message: string;
    images: string[];
  };
  metrics: {
    openRate?: number;
    clickRate: number;
    conversionRate: number;
    roi: number;
  };
}

interface MarketingStore {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;
  resumeCampaign: (id: string) => void;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Email Campaign',
    type: 'email',
    status: 'active',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    budget: 5000,
    spent: 1250,
    impressions: 45000,
    clicks: 2250,
    conversions: 180,
    target: {
      audience: 'Existing Customers',
      demographics: ['25-45', 'Urban'],
      interests: ['Shopping', 'Technology']
    },
    content: {
      subject: 'Don\'t Miss Our Summer Sale - 50% Off!',
      message: 'Get amazing deals on all our products...',
      images: []
    },
    metrics: {
      openRate: 25.5,
      clickRate: 5.0,
      conversionRate: 8.0,
      roi: 320
    }
  },
  {
    id: '2',
    name: 'New Product Launch SMS',
    type: 'sms',
    status: 'scheduled',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: 2000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    target: {
      audience: 'VIP Customers',
      demographics: ['30-55'],
      interests: ['Premium Products']
    },
    content: {
      message: 'Be the first to try our new product! Early access for VIP customers.',
      images: []
    },
    metrics: {
      clickRate: 0,
      conversionRate: 0,
      roi: 0
    }
  }
];

export const useMarketingStore = create<MarketingStore>((set, get) => ({
  campaigns: mockCampaigns,
  selectedCampaign: null,
  searchQuery: '',
  statusFilter: 'all',
  typeFilter: 'all',
  
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  
  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, { ...campaign, id: Date.now().toString() }]
  })),
  
  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates } : campaign
    )
  })),
  
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(campaign => campaign.id !== id)
  })),
  
  pauseCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, status: 'paused' } : campaign
    )
  })),
  
  resumeCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, status: 'active' } : campaign
    )
  }))
}));
