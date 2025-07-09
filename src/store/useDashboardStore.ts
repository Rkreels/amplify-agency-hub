
import { create } from 'zustand';

export interface DashboardMetrics {
  totalRevenue: number;
  totalContacts: number;
  activeCampaigns: number;
  appointments: number;
  conversionRate: number;
  responseTime: number;
  emailOpenRate: number;
  leadConversion: number;
}

export interface DashboardActivity {
  id: string;
  type: 'contact' | 'opportunity' | 'campaign' | 'appointment' | 'call';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

interface DashboardStore {
  metrics: DashboardMetrics;
  activities: DashboardActivity[];
  isLoading: boolean;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
  addActivity: (activity: Omit<DashboardActivity, 'id'>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  metrics: {
    totalRevenue: 125000,
    totalContacts: 2847,
    activeCampaigns: 12,
    appointments: 34,
    conversionRate: 23.4,
    responseTime: 2.3,
    emailOpenRate: 68.4,
    leadConversion: 15.7
  },
  activities: [
    {
      id: '1',
      type: 'contact',
      title: 'New Contact Added',
      description: 'John Smith added to CRM',
      timestamp: new Date(),
      status: 'success'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Deal Moved to Proposal',
      description: 'Website Redesign - $12,000',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success'
    }
  ],
  isLoading: false,
  updateMetrics: (newMetrics) => set((state) => ({
    metrics: { ...state.metrics, ...newMetrics }
  })),
  addActivity: (activity) => set((state) => ({
    activities: [
      {
        ...activity,
        id: Date.now().toString()
      },
      ...state.activities
    ].slice(0, 50)
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  refreshData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  }
}));
