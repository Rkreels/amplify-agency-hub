
import { create } from 'zustand';
import { toast } from 'sonner';

export interface TriggerConfig {
  id: string;
  type: string;
  name: string;
  conditions: Record<string, any>;
  isActive: boolean;
}

export interface ActionConfig {
  id: string;
  type: string;
  name: string;
  settings: Record<string, any>;
  delay?: { amount: number; unit: 'minutes' | 'hours' | 'days' };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  contactId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'goal';
  position: { x: number; y: number };
  data: {
    label: string;
    icon: string;
    config: Record<string, any>;
    isConfigured: boolean;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface WorkflowStats {
  triggered: number;
  completed: number;
  failed: number;
  conversionRate: number;
}

export interface WorkflowSettings {
  maxExecutionTime: number;
  retryAttempts: number;
  enableLogging: boolean;
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    email: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats: WorkflowStats;
  settings: WorkflowSettings;
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isLoading: boolean;
  
  // Modal state
  isConfigModalOpen: boolean;
  configModalNode: WorkflowNode | null;
  
  // Execution state
  isExecuting: boolean;
  executionLogs: WorkflowExecution[];
  
  // Actions
  createNewWorkflow: (data: Partial<Workflow>) => void;
  loadWorkflow: (workflowId: string) => void;
  saveWorkflow: () => void;
  deleteWorkflow: (workflowId: string) => void;
  updateWorkflowName: (name: string) => void;
  updateWorkflowSettings: (settings: Partial<WorkflowSettings>) => void;
  
  // Workflow management
  activateWorkflow: (workflowId: string) => void;
  deactivateWorkflow: (workflowId: string) => void;
  testWorkflow: (contactData: any) => Promise<void>;
  validateWorkflow: () => { isValid: boolean; errors: string[] };
  
  // Node actions
  addNode: (node: Omit<WorkflowNode, 'id'>) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  
  // Connection actions
  addConnection: (connection: Omit<WorkflowConnection, 'id'>) => void;
  deleteConnection: (connectionId: string) => void;
  
  // Modal actions
  openConfigModal: (node: WorkflowNode) => void;
  closeConfigModal: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  selectedNode: null,
  isLoading: false,
  isConfigModalOpen: false,
  configModalNode: null,
  isExecuting: false,
  executionLogs: [],

  createNewWorkflow: (data) => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: data.name || 'New Workflow',
      description: data.description || '',
      nodes: [],
      connections: [],
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        triggered: 0,
        completed: 0,
        failed: 0,
        conversionRate: 0
      },
      settings: {
        maxExecutionTime: 3600,
        retryAttempts: 3,
        enableLogging: true,
        notifications: {
          onSuccess: false,
          onFailure: true,
          email: ''
        }
      },
      ...data
    };

    set((state) => ({
      workflows: [...state.workflows, newWorkflow],
      currentWorkflow: newWorkflow
    }));

    toast.success('New workflow created');
  },

  loadWorkflow: (workflowId) => {
    const workflow = get().workflows.find(w => w.id === workflowId);
    if (workflow) {
      set({ currentWorkflow: workflow });
      toast.success('Workflow loaded');
    } else {
      toast.error('Workflow not found');
    }
  },

  saveWorkflow: () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      updatedAt: new Date()
    };

    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === currentWorkflow.id ? updatedWorkflow : w
      ),
      currentWorkflow: updatedWorkflow
    }));

    toast.success('Workflow saved');
  },

  deleteWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.filter(w => w.id !== workflowId),
      currentWorkflow: state.currentWorkflow?.id === workflowId ? null : state.currentWorkflow
    }));

    toast.success('Workflow deleted');
  },

  updateWorkflowName: (name) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = { ...currentWorkflow, name };
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === currentWorkflow.id ? updatedWorkflow : w
      ),
      currentWorkflow: updatedWorkflow
    }));
  },

  updateWorkflowSettings: (settings) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      settings: { ...currentWorkflow.settings, ...settings }
    };

    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === currentWorkflow.id ? updatedWorkflow : w
      ),
      currentWorkflow: updatedWorkflow
    }));

    toast.success('Workflow settings updated');
  },

  activateWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId ? { ...w, isActive: true } : w
      ),
      currentWorkflow: state.currentWorkflow?.id === workflowId 
        ? { ...state.currentWorkflow, isActive: true } 
        : state.currentWorkflow
    }));
  },

  deactivateWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId ? { ...w, isActive: false } : w
      ),
      currentWorkflow: state.currentWorkflow?.id === workflowId 
        ? { ...state.currentWorkflow, isActive: false } 
        : state.currentWorkflow
    }));
  },

  testWorkflow: async (contactData) => {
    set({ isExecuting: true });
    
    try {
      const { currentWorkflow } = get();
      if (!currentWorkflow) throw new Error('No workflow selected');

      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const execution: WorkflowExecution = {
        id: `exec-${Date.now()}`,
        workflowId: currentWorkflow.id,
        contactId: contactData.id,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        currentStep: currentWorkflow.nodes.length,
        logs: []
      };

      set((state) => ({
        executionLogs: [...state.executionLogs, execution]
      }));

      toast.success('Workflow test completed successfully');
    } catch (error) {
      toast.error('Workflow test failed');
    } finally {
      set({ isExecuting: false });
    }
  },

  validateWorkflow: () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) {
      return { isValid: false, errors: ['No workflow selected'] };
    }

    const errors: string[] = [];
    
    if (currentWorkflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    const unconfiguredNodes = currentWorkflow.nodes.filter(n => !n.data.isConfigured);
    if (unconfiguredNodes.length > 0) {
      errors.push(`${unconfiguredNodes.length} nodes are not configured`);
    }

    const triggers = currentWorkflow.nodes.filter(n => n.type === 'trigger');
    if (triggers.length === 0) {
      errors.push('Workflow must have at least one trigger');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  addNode: (nodeData) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      ...nodeData
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, newNode]
    };

    set({ currentWorkflow: updatedWorkflow });
  },

  updateNode: (nodeId, updates) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    };

    set({ currentWorkflow: updatedWorkflow });
  },

  deleteNode: (nodeId) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.filter(node => node.id !== nodeId),
      connections: currentWorkflow.connections.filter(conn =>
        conn.source !== nodeId && conn.target !== nodeId
      )
    };

    set({ 
      currentWorkflow: updatedWorkflow,
      selectedNode: null
    });

    toast.success('Node deleted');
  },

  duplicateNode: (nodeId) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const originalNode = currentWorkflow.nodes.find(n => n.id === nodeId);
    if (!originalNode) return;

    const duplicatedNode: WorkflowNode = {
      ...originalNode,
      id: `node-${Date.now()}`,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50
      }
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, duplicatedNode]
    };

    set({ currentWorkflow: updatedWorkflow });
    toast.success('Node duplicated');
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNode: nodeId });
  },

  addConnection: (connectionData) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const newConnection: WorkflowConnection = {
      id: `connection-${Date.now()}`,
      ...connectionData
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: [...currentWorkflow.connections, newConnection]
    };

    set({ currentWorkflow: updatedWorkflow });
    toast.success('Connection created');
  },

  deleteConnection: (connectionId) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: currentWorkflow.connections.filter(conn => conn.id !== connectionId)
    };

    set({ currentWorkflow: updatedWorkflow });
    toast.success('Connection deleted');
  },

  openConfigModal: (node) => {
    set({
      isConfigModalOpen: true,
      configModalNode: node
    });
  },

  closeConfigModal: () => {
    set({
      isConfigModalOpen: false,
      configModalNode: null
    });
  }
}));
