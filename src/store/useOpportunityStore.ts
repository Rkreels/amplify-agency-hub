
import { create } from 'zustand';

export interface Opportunity {
  id: string;
  name: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: Date;
  source: string;
  assignedTo: string;
  tags: string[];
  notes: string;
  activities: OpportunityActivity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  completedBy?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  probability: number;
}

interface OpportunityStore {
  opportunities: Opportunity[];
  pipelines: Pipeline[];
  selectedPipeline: string;
  searchQuery: string;
  filters: {
    stage: string;
    assignedTo: string;
    source: string;
    valueRange: [number, number];
  };
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveOpportunity: (id: string, newStage: string) => void;
  addActivity: (opportunityId: string, activity: Omit<OpportunityActivity, 'id'>) => void;
  setSelectedPipeline: (pipelineId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<OpportunityStore['filters']>) => void;
  getOpportunitiesByStage: (stageId: string) => Opportunity[];
  getTotalValue: () => number;
}

export const useOpportunityStore = create<OpportunityStore>((set, get) => ({
  opportunities: [
    {
      id: '1',
      name: 'Website Redesign',
      company: 'ABC Corp',
      contactPerson: 'John Smith',
      email: 'john@abccorp.com',
      phone: '+1-555-0123',
      value: 12000,
      stage: 'qualification',
      probability: 25,
      expectedCloseDate: new Date('2025-02-15'),
      source: 'Website',
      assignedTo: 'Sarah Johnson',
      tags: ['Design', 'Development'],
      notes: 'Initial discussion about complete website overhaul',
      activities: [],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'SEO Campaign',
      company: 'XYZ Inc',
      contactPerson: 'Jane Doe',
      email: 'jane@xyzinc.com',
      phone: '+1-555-0124',
      value: 8500,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: new Date('2025-01-30'),
      source: 'Referral',
      assignedTo: 'Mike Wilson',
      tags: ['SEO', 'Marketing'],
      notes: 'Proposal sent, waiting for feedback',
      activities: [],
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date()
    }
  ],
  pipelines: [
    {
      id: 'main',
      name: 'Main Sales Pipeline',
      isDefault: true,
      stages: [
        { id: 'qualification', name: 'Qualification', color: '#3b82f6', order: 1, probability: 25 },
        { id: 'proposal', name: 'Proposal', color: '#f59e0b', order: 2, probability: 50 },
        { id: 'negotiation', name: 'Negotiation', color: '#8b5cf6', order: 3, probability: 75 },
        { id: 'closed-won', name: 'Closed Won', color: '#10b981', order: 4, probability: 100 },
        { id: 'closed-lost', name: 'Closed Lost', color: '#ef4444', order: 5, probability: 0 }
      ]
    }
  ],
  selectedPipeline: 'main',
  searchQuery: '',
  filters: {
    stage: '',
    assignedTo: '',
    source: '',
    valueRange: [0, 100000]
  },
  addOpportunity: (opportunity) => set((state) => ({
    opportunities: [...state.opportunities, {
      ...opportunity,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),
  updateOpportunity: (id, updates) => set((state) => ({
    opportunities: state.opportunities.map(opp => 
      opp.id === id ? { ...opp, ...updates, updatedAt: new Date() } : opp
    )
  })),
  deleteOpportunity: (id) => set((state) => ({
    opportunities: state.opportunities.filter(opp => opp.id !== id)
  })),
  moveOpportunity: (id, newStage) => set((state) => ({
    opportunities: state.opportunities.map(opp => 
      opp.id === id ? { ...opp, stage: newStage, updatedAt: new Date() } : opp
    )
  })),
  addActivity: (opportunityId, activity) => set((state) => ({
    opportunities: state.opportunities.map(opp => 
      opp.id === opportunityId ? {
        ...opp,
        activities: [...opp.activities, { ...activity, id: Date.now().toString() }],
        updatedAt: new Date()
      } : opp
    )
  })),
  setSelectedPipeline: (pipelineId) => set({ selectedPipeline: pipelineId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  getOpportunitiesByStage: (stageId) => {
    const { opportunities, searchQuery, filters } = get();
    return opportunities.filter(opp => {
      if (opp.stage !== stageId) return false;
      if (searchQuery && !opp.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !opp.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.assignedTo && opp.assignedTo !== filters.assignedTo) return false;
      if (filters.source && opp.source !== filters.source) return false;
      if (opp.value < filters.valueRange[0] || opp.value > filters.valueRange[1]) return false;
      return true;
    });
  },
  getTotalValue: () => {
    const { opportunities } = get();
    return opportunities.reduce((total, opp) => total + opp.value, 0);
  }
}));
