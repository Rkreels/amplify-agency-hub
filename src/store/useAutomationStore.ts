
import { create } from 'zustand';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config: Record<string, any>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  stats: {
    triggered: number;
    completed: number;
    failed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AutomationStore {
  workflows: Workflow[];
  selectedWorkflow: string | null;
  isEditing: boolean;
  searchQuery: string;
  statusFilter: string;
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => void;
  toggleWorkflowStatus: (id: string) => void;
  setSelectedWorkflow: (id: string | null) => void;
  setEditing: (editing: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  getFilteredWorkflows: () => Workflow[];
}

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  workflows: [
    {
      id: '1',
      name: 'Welcome Email Sequence',
      description: 'Send welcome emails to new leads',
      status: 'active',
      trigger: 'contact_created',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: {
            label: 'New Contact Created',
            config: { event: 'contact_created' }
          }
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 300, y: 100 },
          data: {
            label: 'Send Welcome Email',
            config: { template: 'welcome_email' }
          }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1'
        }
      ],
      stats: {
        triggered: 156,
        completed: 142,
        failed: 14
      },
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Follow-up SMS Campaign',
      description: 'Send follow-up SMS after 3 days of no response',
      status: 'active',
      trigger: 'no_response',
      nodes: [],
      edges: [],
      stats: {
        triggered: 89,
        completed: 76,
        failed: 13
      },
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date()
    }
  ],
  selectedWorkflow: null,
  isEditing: false,
  searchQuery: '',
  statusFilter: '',
  addWorkflow: (workflow) => set((state) => ({
    workflows: [...state.workflows, {
      ...workflow,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),
  updateWorkflow: (id, updates) => set((state) => ({
    workflows: state.workflows.map(workflow => 
      workflow.id === id ? { ...workflow, ...updates, updatedAt: new Date() } : workflow
    )
  })),
  deleteWorkflow: (id) => set((state) => ({
    workflows: state.workflows.filter(workflow => workflow.id !== id)
  })),
  duplicateWorkflow: (id) => set((state) => {
    const workflow = state.workflows.find(w => w.id === id);
    if (!workflow) return state;
    return {
      workflows: [...state.workflows, {
        ...workflow,
        id: Date.now().toString(),
        name: `${workflow.name} (Copy)`,
        status: 'draft' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    };
  }),
  toggleWorkflowStatus: (id) => set((state) => ({
    workflows: state.workflows.map(workflow => 
      workflow.id === id ? {
        ...workflow,
        status: workflow.status === 'active' ? 'inactive' : 'active',
        updatedAt: new Date()
      } : workflow
    )
  })),
  setSelectedWorkflow: (id) => set({ selectedWorkflow: id }),
  setEditing: (editing) => set({ isEditing: editing }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  getFilteredWorkflows: () => {
    const { workflows, searchQuery, statusFilter } = get();
    return workflows.filter(workflow => {
      if (searchQuery && !workflow.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter && workflow.status !== statusFilter) return false;
      return true;
    });
  }
}));
