
import { create } from 'zustand';

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'ads';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  audience: string;
  subject?: string;
  content: string;
  scheduledDate?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface MarketingStore {
  campaigns: Campaign[];
  selectedCampaign: string | null;
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  duplicateCampaign: (id: string) => void;
  setSelectedCampaign: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string) => void;
  setStatusFilter: (status: string) => void;
  getFilteredCampaigns: () => Campaign[];
}

export const useMarketingStore = create<MarketingStore>((set, get) => ({
  campaigns: [
    {
      id: '1',
      name: 'Welcome Email Series',
      type: 'email',
      status: 'active',
      audience: 'New Subscribers',
      subject: 'Welcome to our community!',
      content: 'Thank you for joining us...',
      stats: {
        sent: 1250,
        delivered: 1230,
        opened: 450,
        clicked: 89,
        unsubscribed: 5
      },
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Holiday Promotion',
      type: 'sms',
      status: 'scheduled',
      audience: 'VIP Customers',
      content: '🎄 Special holiday offer just for you! 50% off...',
      scheduledDate: new Date('2024-12-25'),
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      },
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date()
    }
  ],
  selectedCampaign: null,
  searchQuery: '',
  typeFilter: '',
  statusFilter: '',
  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),
  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date() } : campaign
    )
  })),
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(campaign => campaign.id !== id)
  })),
  duplicateCampaign: (id) => set((state) => {
    const campaign = state.campaigns.find(c => c.id === id);
    if (!campaign) return state;
    return {
      campaigns: [...state.campaigns, {
        ...campaign,
        id: Date.now().toString(),
        name: `${campaign.name} (Copy)`,
        status: 'draft' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    };
  }),
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  getFilteredCampaigns: () => {
    const { campaigns, searchQuery, typeFilter, statusFilter } = get();
    return campaigns.filter(campaign => {
      if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (typeFilter && campaign.type !== typeFilter) return false;
      if (statusFilter && campaign.status !== statusFilter) return false;
      return true;
    });
  }
}));
