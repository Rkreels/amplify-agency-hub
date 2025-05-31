
import { create } from 'zustand';
import { LucideIcon } from 'lucide-react';

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

export interface ConditionConfig {
  id: string;
  type: 'if' | 'filter' | 'wait_until';
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  trueLabel?: string;
  falseLabel?: string;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'success' | 'failure' | 'condition';
  label?: string;
  conditions?: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'wait' | 'decision' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    icon: LucideIcon | React.ComponentType<any>;
    config?: TriggerConfig | ActionConfig | ConditionConfig;
    isConfigured?: boolean;
    handles?: {
      source: string[];
      target: string[];
    };
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  contactId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentNode: string;
  startedAt: Date;
  completedAt?: Date;
  logs: {
    nodeId: string;
    action: string;
    timestamp: Date;
    result: 'success' | 'failure';
    message: string;
  }[];
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
    active: number;
  };
  settings: {
    allowReentry: boolean;
    maxExecutionTime: number;
    errorHandling: 'stop' | 'continue' | 'retry';
  };
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  selectedConnection: string | null;
  isConfigModalOpen: boolean;
  configModalNode: WorkflowNode | null;
  isExecuting: boolean;
  executionLogs: WorkflowExecution[];
  draggedAction: any;
  
  // Basic workflow operations
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedConnection: (connectionId: string | null) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  
  // Connection operations
  addConnection: (connection: WorkflowConnection) => void;
  updateConnection: (connectionId: string, updates: Partial<WorkflowConnection>) => void;
  deleteConnection: (connectionId: string) => void;
  canConnect: (sourceId: string, targetId: string) => boolean;
  
  // Workflow management
  saveWorkflow: () => void;
  activateWorkflow: (workflowId: string) => void;
  deactivateWorkflow: (workflowId: string) => void;
  updateWorkflowName: (name: string) => void;
  updateWorkflowSettings: (settings: Partial<Workflow['settings']>) => void;
  
  // Modal management
  openConfigModal: (node: WorkflowNode) => void;
  closeConfigModal: () => void;
  
  // Execution and testing
  testWorkflow: (contactData?: any) => Promise<void>;
  executeWorkflow: (contactId: string) => Promise<void>;
  pauseExecution: (executionId: string) => void;
  resumeExecution: (executionId: string) => void;
  
  // Validation
  validateWorkflow: () => { isValid: boolean; errors: string[] };
  validateNode: (nodeId: string) => { isValid: boolean; errors: string[] };
  
  // Drag and drop
  setDraggedAction: (action: any) => void;
  
  // Templates
  loadTemplate: (templateId: string) => void;
  saveAsTemplate: (name: string) => void;
}

const defaultWorkflow: Workflow = {
  id: 'default-workflow',
  name: 'New Workflow',
  description: 'New automation workflow',
  isActive: false,
  nodes: [],
  connections: [],
  stats: {
    triggered: 0,
    completed: 0,
    failed: 0,
    active: 0
  },
  settings: {
    allowReentry: false,
    maxExecutionTime: 3600, // 1 hour
    errorHandling: 'stop'
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [defaultWorkflow],
  currentWorkflow: defaultWorkflow,
  selectedNode: null,
  selectedConnection: null,
  isConfigModalOpen: false,
  configModalNode: null,
  isExecuting: false,
  executionLogs: [],
  draggedAction: null,

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId, selectedConnection: null }),
  
  setSelectedConnection: (connectionId) => set({ selectedConnection: connectionId, selectedNode: null }),
  
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
  
  duplicateNode: (nodeId) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const node = state.currentWorkflow.nodes.find(n => n.id === nodeId);
    if (!node) return state;
    
    const duplicatedNode = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      },
      data: {
        ...node.data,
        isConfigured: false
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
  
  addConnection: (connection) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    // Check if connection already exists
    const exists = state.currentWorkflow.connections.some(
      conn => conn.source === connection.source && conn.target === connection.target
    );
    
    if (exists) return state;
    
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
  
  updateConnection: (connectionId, updates) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      connections: state.currentWorkflow.connections.map(conn =>
        conn.id === connectionId ? { ...conn, ...updates } : conn
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
  
  canConnect: (sourceId, targetId) => {
    const state = get();
    if (!state.currentWorkflow) return false;
    
    // Check for cycles
    const visited = new Set<string>();
    const checkCycle = (nodeId: string): boolean => {
      if (visited.has(nodeId)) return true;
      visited.add(nodeId);
      
      const connections = state.currentWorkflow!.connections.filter(c => c.source === nodeId);
      return connections.some(c => checkCycle(c.target));
    };
    
    return !checkCycle(targetId);
  },
  
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
  
  updateWorkflowSettings: (settings) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      settings: { ...state.currentWorkflow.settings, ...settings },
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  openConfigModal: (node) => set({ 
    isConfigModalOpen: true, 
    configModalNode: node 
  }),
  
  closeConfigModal: () => set({ 
    isConfigModalOpen: false, 
    configModalNode: null 
  }),
  
  testWorkflow: async (contactData = {}) => {
    const state = get();
    if (!state.currentWorkflow) return;
    
    set({ isExecuting: true });
    
    try {
      console.log('Testing workflow:', state.currentWorkflow.name);
      console.log('Contact data:', contactData);
      
      // Simulate workflow execution
      const execution: WorkflowExecution = {
        id: `test-${Date.now()}`,
        workflowId: state.currentWorkflow.id,
        contactId: 'test-contact',
        status: 'running',
        currentNode: state.currentWorkflow.nodes[0]?.id || '',
        startedAt: new Date(),
        logs: []
      };
      
      // Add execution to logs
      set((state) => ({
        executionLogs: [execution, ...state.executionLogs.slice(0, 99)]
      }));
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      execution.status = 'completed';
      execution.completedAt = new Date();
      
      console.log('Workflow test completed');
    } catch (error) {
      console.error('Workflow test failed:', error);
    } finally {
      set({ isExecuting: false });
    }
  },
  
  executeWorkflow: async (contactId) => {
    console.log('Executing workflow for contact:', contactId);
  },
  
  pauseExecution: (executionId) => {
    console.log('Pausing execution:', executionId);
  },
  
  resumeExecution: (executionId) => {
    console.log('Resuming execution:', executionId);
  },
  
  validateWorkflow: () => {
    const state = get();
    if (!state.currentWorkflow) return { isValid: false, errors: ['No workflow selected'] };
    
    const errors: string[] = [];
    
    // Check for trigger
    const triggers = state.currentWorkflow.nodes.filter(n => n.type === 'trigger');
    if (triggers.length === 0) {
      errors.push('Workflow must have at least one trigger');
    }
    
    // Check for orphaned nodes
    const connectedNodes = new Set<string>();
    state.currentWorkflow.connections.forEach(conn => {
      connectedNodes.add(conn.source);
      connectedNodes.add(conn.target);
    });
    
    const orphanedNodes = state.currentWorkflow.nodes.filter(
      node => node.type !== 'trigger' && !connectedNodes.has(node.id)
    );
    
    if (orphanedNodes.length > 0) {
      errors.push(`${orphanedNodes.length} nodes are not connected to the workflow`);
    }
    
    // Check for unconfigured nodes
    const unconfiguredNodes = state.currentWorkflow.nodes.filter(
      node => !node.data.isConfigured
    );
    
    if (unconfiguredNodes.length > 0) {
      errors.push(`${unconfiguredNodes.length} nodes are not configured`);
    }
    
    return { isValid: errors.length === 0, errors };
  },
  
  validateNode: (nodeId) => {
    const state = get();
    if (!state.currentWorkflow) return { isValid: false, errors: ['No workflow selected'] };
    
    const node = state.currentWorkflow.nodes.find(n => n.id === nodeId);
    if (!node) return { isValid: false, errors: ['Node not found'] };
    
    const errors: string[] = [];
    
    if (!node.data.isConfigured) {
      errors.push('Node is not configured');
    }
    
    return { isValid: errors.length === 0, errors };
  },
  
  setDraggedAction: (action) => set({ draggedAction: action }),
  
  loadTemplate: (templateId) => {
    console.log('Loading template:', templateId);
  },
  
  saveAsTemplate: (name) => {
    console.log('Saving as template:', name);
  }
}));
