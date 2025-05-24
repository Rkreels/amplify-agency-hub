
import { create } from 'zustand';

export interface Opportunity {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  createdDate: Date;
  source: string;
  description: string;
  tags: string[];
  assignedTo: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

interface OpportunitiesStore {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  searchQuery: string;
  stageFilter: string;
  setSelectedOpportunity: (opportunity: Opportunity | null) => void;
  setSearchQuery: (query: string) => void;
  setStageFilter: (stage: string) => void;
  updateOpportunityStage: (id: string, stage: Opportunity['stage']) => void;
  addOpportunity: (opportunity: Omit<Opportunity, 'id'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  addActivity: (opportunityId: string, activity: Omit<Activity, 'id'>) => void;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    contactId: 'contact-1',
    contactName: 'Sarah Johnson',
    value: 15000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    source: 'Website',
    description: 'Complete website redesign and development',
    tags: ['Website', 'Design'],
    assignedTo: 'John Doe',
    activities: [
      {
        id: 'act-1',
        type: 'call',
        title: 'Initial consultation call',
        description: 'Discussed project requirements',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completed: true
      }
    ]
  },
  {
    id: '2',
    title: 'Marketing Campaign Setup',
    contactId: 'contact-2',
    contactName: 'Michael Brown',
    value: 8000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    source: 'Referral',
    description: 'Digital marketing campaign setup and management',
    tags: ['Marketing', 'Digital'],
    assignedTo: 'Jane Smith',
    activities: []
  }
];

export const useOpportunitiesStore = create<OpportunitiesStore>((set, get) => ({
  opportunities: mockOpportunities,
  selectedOpportunity: null,
  searchQuery: '',
  stageFilter: 'all',
  
  setSelectedOpportunity: (opportunity) => set({ selectedOpportunity: opportunity }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStageFilter: (stage) => set({ stageFilter: stage }),
  
  updateOpportunityStage: (id, stage) => set((state) => ({
    opportunities: state.opportunities.map(opp =>
      opp.id === id ? { ...opp, stage } : opp
    )
  })),
  
  addOpportunity: (opportunity) => set((state) => ({
    opportunities: [...state.opportunities, { ...opportunity, id: Date.now().toString() }]
  })),
  
  updateOpportunity: (id, updates) => set((state) => ({
    opportunities: state.opportunities.map(opp =>
      opp.id === id ? { ...opp, ...updates } : opp
    )
  })),
  
  deleteOpportunity: (id) => set((state) => ({
    opportunities: state.opportunities.filter(opp => opp.id !== id)
  })),
  
  addActivity: (opportunityId, activity) => set((state) => ({
    opportunities: state.opportunities.map(opp =>
      opp.id === opportunityId 
        ? {
            ...opp,
            activities: [...opp.activities, { ...activity, id: Date.now().toString() }]
          }
        : opp
    )
  }))
}));
