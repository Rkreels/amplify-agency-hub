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
  
  // Advanced node operations
  moveWorkflowNodes: (updates: Array<{ id: string; position: { x: number; y: number } }>) => void;
  alignNodes: (nodeIds: string[], alignment: 'horizontal' | 'vertical') => void;
  distributeNodes: (nodeIds: string[], direction: 'horizontal' | 'vertical') => void;
  
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
  
  moveWorkflowNodes: (updates) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: state.currentWorkflow.nodes.map(node => {
        const update = updates.find(u => u.id === node.id);
        if (update) {
          return {
            ...node,
            position: update.position
          };
        }
        return node;
      }),
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  alignNodes: (nodeIds, alignment) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    // Get positions of all selected nodes
    const selectedNodes = state.currentWorkflow.nodes.filter(n => nodeIds.includes(n.id));
    if (selectedNodes.length < 2) return state;
    
    // Calculate target position
    let targetValue = 0;
    if (alignment === 'horizontal') {
      // Align to the average Y position
      targetValue = selectedNodes.reduce((sum, node) => sum + node.position.y, 0) / selectedNodes.length;
    } else {
      // Align to the average X position
      targetValue = selectedNodes.reduce((sum, node) => sum + node.position.x, 0) / selectedNodes.length;
    }
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: state.currentWorkflow.nodes.map(node => {
        if (nodeIds.includes(node.id)) {
          return {
            ...node,
            position: {
              ...node.position,
              ...(alignment === 'horizontal' ? { y: targetValue } : { x: targetValue })
            }
          };
        }
        return node;
      }),
      updatedAt: new Date()
    };
    
    return {
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    };
  }),
  
  distributeNodes: (nodeIds, direction) => set((state) => {
    if (!state.currentWorkflow) return state;
    
    // Get positions of all selected nodes
    const selectedNodes = state.currentWorkflow.nodes.filter(n => nodeIds.includes(n.id));
    if (selectedNodes.length < 3) return state; // Need at least 3 nodes to distribute
    
    // Sort nodes by position
    selectedNodes.sort((a, b) => {
      return direction === 'horizontal' 
        ? a.position.x - b.position.x 
        : a.position.y - b.position.y;
    });
    
    // Find start and end positions
    const firstNode = selectedNodes[0];
    const lastNode = selectedNodes[selectedNodes.length - 1];
    
    const startPos = direction === 'horizontal' ? firstNode.position.x : firstNode.position.y;
    const endPos = direction === 'horizontal' ? lastNode.position.x : lastNode.position.y;
    const totalSpace = endPos - startPos;
    
    // Calculate spacing
    const spacing = totalSpace / (selectedNodes.length - 1);
    
    const updatedWorkflow = {
      ...state.currentWorkflow,
      nodes: state.currentWorkflow.nodes.map(node => {
        const index = selectedNodes.findIndex(n => n.id === node.id);
        if (index !== -1) {
          const targetPos = startPos + (spacing * index);
          return {
            ...node,
            position: {
              ...node.position,
              ...(direction === 'horizontal' ? { x: targetPos } : { y: targetPos })
            }
          };
        }
        return node;
      }),
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
      id: `${node.id.split('-')[0]}-${Date.now()}`,
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
      conn => conn.source === connection.source && conn.target === connection.target && conn.sourceHandle === connection.sourceHandle
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
      ),
      selectedConnection: state.selectedConnection === connectionId ? null : state.selectedConnection
    };
  }),
  
  canConnect: (sourceId, targetId) => {
    const state = get();
    if (!state.currentWorkflow) return false;
    
    // Don't allow self-connections
    if (sourceId === targetId) return false;
    
    // Check for cycles using DFS
    const visited = new Set<string>();
    const stack = new Set<string>();
    
    const hasCycle = (nodeId: string): boolean => {
      if (nodeId === sourceId) return true; // Would create a cycle
      if (stack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      stack.add(nodeId);
      
      const outgoingConnections = state.currentWorkflow!.connections.filter(c => c.source === nodeId);
      for (const conn of outgoingConnections) {
        if (hasCycle(conn.target)) return true;
      }
      
      stack.delete(nodeId);
      return false;
    };
    
    // If adding this connection would create a cycle
    return !hasCycle(targetId);
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
        contactId: contactData.id || 'test-contact',
        status: 'running',
        currentNode: state.currentWorkflow.nodes.find(n => n.type === 'trigger')?.id || '',
        startedAt: new Date(),
        logs: [{
          nodeId: 'system',
          action: 'start',
          timestamp: new Date(),
          result: 'success',
          message: 'Workflow execution started with test data'
        }]
      };
      
      // Add execution to logs
      set((state) => ({
        executionLogs: [execution, ...state.executionLogs.slice(0, 99)]
      }));
      
      // Simulate execution of each node in sequence
      const nodes = state.currentWorkflow.nodes;
      const connections = state.currentWorkflow.connections;
      
      // Find trigger node
      const triggerNode = nodes.find(n => n.type === 'trigger');
      if (!triggerNode) throw new Error('No trigger node found');
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add log for trigger execution
      execution.logs.push({
        nodeId: triggerNode.id,
        action: 'execute',
        timestamp: new Date(),
        result: 'success',
        message: 'Trigger conditions matched'
      });
      
      // Update execution logs
      set((state) => ({
        executionLogs: state.executionLogs.map(log => 
          log.id === execution.id ? execution : log
        )
      }));
      
      // Follow the connections to simulate execution flow
      let currentNodeId = triggerNode.id;
      let executionPath: string[] = [currentNodeId];
      
      // Simple BFS traversal of the workflow
      while (executionPath.length > 0) {
        const nodeId = executionPath.shift()!;
        currentNodeId = nodeId;
        execution.currentNode = nodeId;
        
        // Find node
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;
        
        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Add log for node execution
        execution.logs.push({
          nodeId: node.id,
          action: 'execute',
          timestamp: new Date(),
          result: 'success',
          message: `Executed ${node.data.label}`
        });
        
        // Update execution logs
        set((state) => ({
          executionLogs: state.executionLogs.map(log => 
            log.id === execution.id ? execution : log
          )
        }));
        
        // Find outgoing connections
        const outgoing = connections.filter(c => c.source === nodeId);
        
        // Add target nodes to execution path
        for (const conn of outgoing) {
          const targetExists = nodes.some(n => n.id === conn.target);
          if (targetExists) {
            executionPath.push(conn.target);
            
            // Add log for following connection
            execution.logs.push({
              nodeId: conn.id,
              action: 'follow',
              timestamp: new Date(),
              result: 'success',
              message: `Following connection to ${conn.target}`
            });
            
            // Update execution logs
            set((state) => ({
              executionLogs: state.executionLogs.map(log => 
                log.id === execution.id ? execution : log
              )
            }));
            
            // Simulate execution delay
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }
      
      // Complete execution
      execution.status = 'completed';
      execution.completedAt = new Date();
      
      execution.logs.push({
        nodeId: 'system',
        action: 'complete',
        timestamp: new Date(),
        result: 'success',
        message: 'Workflow execution completed successfully'
      });
      
      // Update execution logs
      set((state) => ({
        executionLogs: state.executionLogs.map(log => 
          log.id === execution.id ? execution : log
        )
      }));
      
      // Update workflow stats
      const updatedWorkflow = {
        ...state.currentWorkflow,
        stats: {
          ...state.currentWorkflow.stats,
          triggered: state.currentWorkflow.stats.triggered + 1,
          completed: state.currentWorkflow.stats.completed + 1
        }
      };
      
      set({
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(w => 
          w.id === updatedWorkflow.id ? updatedWorkflow : w
        )
      });
      
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
    
    if (triggers.length > 1) {
      errors.push('Workflow cannot have multiple triggers');
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
    
    // Check for nodes without any outgoing connections
    const nodesWithoutOutgoing = state.currentWorkflow.nodes.filter(
      node => node.type !== 'end' && 
        !state.currentWorkflow!.connections.some(conn => conn.source === node.id)
    );
    
    if (nodesWithoutOutgoing.length > 0) {
      errors.push(`${nodesWithoutOutgoing.length} nodes have no outgoing connections`);
    }
    
    // Check for condition nodes with missing branches
    const conditionNodes = state.currentWorkflow.nodes.filter(n => n.type === 'condition');
    
    conditionNodes.forEach(node => {
      const outgoingTrue = state.currentWorkflow!.connections.some(
        conn => conn.source === node.id && conn.sourceHandle === 'true'
      );
      
      const outgoingFalse = state.currentWorkflow!.connections.some(
        conn => conn.source === node.id && conn.sourceHandle === 'false'
      );
      
      if (!outgoingTrue && !outgoingFalse) {
        errors.push(`Condition '${node.data.label}' is missing both Yes and No branches`);
      } else if (!outgoingTrue) {
        errors.push(`Condition '${node.data.label}' is missing Yes branch`);
      } else if (!outgoingFalse) {
        errors.push(`Condition '${node.data.label}' is missing No branch`);
      }
    });
    
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
    
    // Check for specific node type validation
    if (node.type === 'condition') {
      const outgoingTrue = state.currentWorkflow.connections.some(
        conn => conn.source === node.id && conn.sourceHandle === 'true'
      );
      
      const outgoingFalse = state.currentWorkflow.connections.some(
        conn => conn.source === node.id && conn.sourceHandle === 'false'
      );
      
      if (!outgoingTrue && !outgoingFalse) {
        errors.push('Condition is missing both Yes and No branches');
      } else if (!outgoingTrue) {
        errors.push('Condition is missing Yes branch');
      } else if (!outgoingFalse) {
        errors.push('Condition is missing No branch');
      }
    } else if (node.type !== 'end' && node.type !== 'wait') {
      // Other nodes except 'end' and 'wait' should have at least one outgoing connection
      const hasOutgoing = state.currentWorkflow.connections.some(
        conn => conn.source === node.id
      );
      
      if (!hasOutgoing) {
        errors.push('Node has no outgoing connections');
      }
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
