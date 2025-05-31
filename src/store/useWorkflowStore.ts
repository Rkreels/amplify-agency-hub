
import { create } from 'zustand';

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
  delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days';
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  conditions?: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'wait' | 'decision';
  position: { x: number; y: number };
  data: {
    label: string;
    icon: any;
    config?: TriggerConfig | ActionConfig;
    isConfigured?: boolean;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  stats: {
    triggered: number;
    completed: number;
    failed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isConfigModalOpen: boolean;
  configModalNode: WorkflowNode | null;
  
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  setSelectedNode: (nodeId: string | null) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  addConnection: (connection: WorkflowConnection) => void;
  deleteConnection: (connectionId: string) => void;
  duplicateNode: (nodeId: string) => void;
  saveWorkflow: () => void;
  activateWorkflow: (workflowId: string) => void;
  deactivateWorkflow: (workflowId: string) => void;
  openConfigModal: (node: WorkflowNode) => void;
  closeConfigModal: () => void;
  updateWorkflowName: (name: string) => void;
  testWorkflow: () => void;
}

const defaultWorkflow: Workflow = {
  id: 'default-workflow',
  name: 'New Workflow : 1644273575181',
  description: 'New automation workflow',
  isActive: false,
  nodes: [],
  connections: [],
  stats: {
    triggered: 0,
    completed: 0,
    failed: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [defaultWorkflow],
  currentWorkflow: defaultWorkflow,
  selectedNode: null,
  isConfigModalOpen: false,
  configModalNode: null,

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),
  
  addNode: (node) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: [...state.currentWorkflow.nodes, node],
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  updateNode: (nodeId, updates) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: state.currentWorkflow.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  deleteNode: (nodeId) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: state.currentWorkflow.nodes.filter(node => node.id !== nodeId),
      connections: state.currentWorkflow.connections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      ),
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
      selectedNode: state.selectedNode === nodeId ? null : state.selectedNode
    };
  }),
  
  addConnection: (connection) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      connections: [...state.currentWorkflow.connections, connection],
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  deleteConnection: (connectionId) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      connections: state.currentWorkflow.connections.filter(
        conn => conn.id !== connectionId
      ),
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  duplicateNode: (nodeId) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const node = state.currentWorkflow.nodes.find(n => n.id === nodeId);
    if (!node) return state;
    
    const duplicatedNode = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20
      }
    };
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: [...state.currentWorkflow.nodes, duplicatedNode],
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  saveWorkflow: () => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  activateWorkflow: (workflowId) => set((state) => ({
    workflows: state.workflows.map(w => 
      w.id === workflowId ? { ...w, isActive: true, updatedAt: new Date() } : w
    ),
    currentWorkflow: state.currentWorkflow?.id === workflowId 
      ? { ...state.currentWorkflow, isActive: true, updatedAt: new Date() }
      : state.currentWorkflow
  })),
  
  deactivateWorkflow: (workflowId) => set((state) => ({
    workflows: state.workflows.map(w => 
      w.id === workflowId ? { ...w, isActive: false, updatedAt: new Date() } : w
    ),
    currentWorkflow: state.currentWorkflow?.id === workflowId 
      ? { ...state.currentWorkflow, isActive: false, updatedAt: new Date() }
      : state.currentWorkflow
  })),
  
  openConfigModal: (node) => set({ 
    isConfigModalOpen: true, 
    configModalNode: node 
  }),
  
  closeConfigModal: () => set({ 
    isConfigModalOpen: false, 
    configModalNode: null 
  }),
  
  updateWorkflowName: (name) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      name,
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  testWorkflow: () => {
    // Simulate workflow test
    console.log('Testing workflow...');
  }
}));
