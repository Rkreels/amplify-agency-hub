
import { create } from 'zustand';
import { toast } from 'sonner';

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
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isLoading: boolean;
  
  // Actions
  createNewWorkflow: (data: Partial<Workflow>) => void;
  loadWorkflow: (workflowId: string) => void;
  saveWorkflow: () => void;
  deleteWorkflow: (workflowId: string) => void;
  
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
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  selectedNode: null,
  isLoading: false,

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
    // This would open a configuration modal for the node
    // For now, we'll just show a toast
    toast.info(`Configure ${node.data.label} - Feature coming soon`);
  }
}));
