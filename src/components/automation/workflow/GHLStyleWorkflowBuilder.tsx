import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  ConnectionMode,
  MarkerType,
  useReactFlow,
  Panel
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { 
  Play, 
  Pause, 
  Save, 
  Settings, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Users,
  Mail,
  Zap,
  Clock,
  AlertCircle
} from 'lucide-react';

import { triggerTypes, triggerCategories } from './AdvancedTriggerTypes';
import { actionTypes, actionCategories } from './AdvancedActionTypes';
import { NodeSettingsPanel } from './NodeSettingsPanel';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

// Custom Node Components
const TriggerNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  const triggerType = triggerTypes.find(t => t.id === data.triggerType);
  const Icon = triggerType?.icon || Zap;
  
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-lg ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${triggerType?.color || 'bg-gray-500'} text-white`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">TRIGGER</div>
          <div className="text-xs text-gray-600">{triggerType?.name || 'Select Trigger'}</div>
        </div>
      </div>
      
      {data.isConfigured && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
          ✓ Configured
        </div>
      )}
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
    </div>
  );
};

const ActionNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  const actionType = actionTypes.find(t => t.id === data.actionType);
  const Icon = actionType?.icon || Mail;
  
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-lg ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Input handle */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${actionType?.color || 'bg-gray-500'} text-white`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">ACTION</div>
          <div className="text-xs text-gray-600">{actionType?.name || 'Select Action'}</div>
        </div>
        {actionType?.isPremium && (
          <Badge variant="secondary" className="text-xs">PRO</Badge>
        )}
      </div>
      
      {data.config?.subject && (
        <div className="mt-2 text-xs text-gray-600 truncate">
          {data.config.subject}
        </div>
      )}
      
      {data.isConfigured && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
          ✓ Configured
        </div>
      )}
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
    </div>
  );
};

const ConditionNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-lg ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Input handle */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-yellow-500 text-white">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">CONDITION</div>
          <div className="text-xs text-gray-600">{data.condition || 'If/Else Logic'}</div>
        </div>
      </div>
      
      {/* Output handles for Yes/No */}
      <div className="flex justify-between mt-4">
        <div className="text-xs text-green-600 font-medium">YES</div>
        <div className="text-xs text-red-600 font-medium">NO</div>
      </div>
      
      {/* Output handles */}
      <div className="absolute -bottom-2 left-1/4 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      <div className="absolute -bottom-2 right-1/4 transform translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
    </div>
  );
};

const WaitNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-lg ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Input handle */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-purple-500 text-white">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">WAIT</div>
          <div className="text-xs text-gray-600">
            {data.duration ? `${data.duration} ${data.unit}` : 'Set duration'}
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  wait: WaitNode,
};

export function GHLStyleWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    createNewWorkflow,
    saveWorkflow,
    updateWorkflowName,
    activateWorkflow,
    deactivateWorkflow,
    testWorkflow,
    validateWorkflow,
    addNode,
    setSelectedNode,
    openConfigModal,
    updateNodeConfig
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarTab, setSidebarTab] = useState('triggers');
  const [showNodeSettings, setShowNodeSettings] = useState(false);
  const [selectedNodeForSettings, setSelectedNodeForSettings] = useState<any>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { getViewport, setViewport, fitView } = useReactFlow();

  // Initialize workflow
  useEffect(() => {
    if (!currentWorkflow) {
      createNewWorkflow({
        name: 'New Workflow',
        description: 'Created from GHL-style builder'
      });
    }
  }, [currentWorkflow, createNewWorkflow]);

  // Sync nodes and edges with workflow store
  useEffect(() => {
    if (currentWorkflow) {
      const flowNodes = currentWorkflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      }));
      
      const flowEdges = currentWorkflow.connections.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#3b82f6', strokeWidth: 2 }
      }));
      
      setNodes(flowNodes);
      setEdges(flowEdges);
      setWorkflowName(currentWorkflow.name);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setSelectedNodeForSettings(node);
    setShowNodeSettings(true);
  }, [setSelectedNode]);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (currentWorkflow) {
      const workflowNode = currentWorkflow.nodes.find(n => n.id === node.id);
      if (workflowNode) {
        openConfigModal(workflowNode);
      }
    }
  }, [currentWorkflow, openConfigModal]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const type = event.dataTransfer.getData('application/reactflow');
    const subtype = event.dataTransfer.getData('application/subtype');

    const position = {
      x: event.clientX - reactFlowBounds.left - 100,
      y: event.clientY - reactFlowBounds.top - 50,
    };

    const nodeData = {
      label: type === 'trigger' ? 'New Trigger' : type === 'action' ? 'New Action' : type === 'condition' ? 'New Condition' : 'New Wait',
      icon: type,
      config: {},
      isConfigured: false,
      ...(type === 'trigger' && { triggerType: subtype }),
      ...(type === 'action' && { actionType: subtype }),
    };

    addNode({
      type: type as any,
      position,
      data: nodeData
    });
  }, [addNode]);

  const handleSave = () => {
    if (currentWorkflow) {
      updateWorkflowName(workflowName);
      saveWorkflow();
    }
  };

  const handleTest = async () => {
    if (!currentWorkflow) return;
    
    const validation = validateWorkflow();
    if (!validation.isValid) {
      toast.error(`Cannot test workflow: ${validation.errors.join(', ')}`);
      return;
    }

    await testWorkflow({ id: 'test-contact', name: 'Test Contact', email: 'test@example.com' });
  };

  const handleToggleActive = () => {
    if (!currentWorkflow) return;
    
    if (currentWorkflow.isActive) {
      deactivateWorkflow(currentWorkflow.id);
      toast.success('Workflow deactivated');
    } else {
      const validation = validateWorkflow();
      if (!validation.isValid) {
        toast.error(`Cannot activate workflow: ${validation.errors.join(', ')}`);
        return;
      }
      
      activateWorkflow(currentWorkflow.id);
      toast.success('Workflow activated');
    }
  };

  const filteredTriggers = triggerTypes.filter(trigger => {
    const matchesSearch = trigger.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trigger.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = actionTypes.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNodeConfigSave = useCallback((nodeId: string, config: any) => {
    if (currentWorkflow && updateNodeConfig) {
      updateNodeConfig(nodeId, config);
    }
  }, [currentWorkflow, updateNodeConfig]);

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Loading Workflow Builder...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="font-semibold text-lg border-none p-0 focus-visible:ring-0 bg-transparent"
              placeholder="Workflow Name"
            />
            <Badge variant={currentWorkflow?.isActive ? 'default' : 'secondary'}>
              {currentWorkflow?.isActive ? 'Active' : 'Draft'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="h-4 w-4 mr-1" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button 
              size="sm" 
              onClick={handleToggleActive}
              variant={currentWorkflow?.isActive ? 'destructive' : 'default'}
            >
              {currentWorkflow?.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMiniMap(!showMiniMap)}>
              {showMiniMap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-background"
          >
            <Background />
            <Controls />
            {showMiniMap && (
              <MiniMap 
                nodeStrokeColor="#374151"
                nodeColor="#f3f4f6"
                nodeBorderRadius={8}
                className="bg-background border border-border"
              />
            )}
            
            <Panel position="top-left" className="bg-white/80 backdrop-blur rounded-lg p-2 m-2">
              <div className="text-xs text-gray-600">
                Nodes: {nodes.length} | Connections: {edges.length}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Workflow Elements */}
      <div className="w-80 bg-background border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg mb-3">Workflow Elements</h2>
          
          <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="logic">Logic</TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="triggers" className="mt-4">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {triggerCategories.map((category) => {
                    const categoryTriggers = getTriggersByCategory(category.id, filteredTriggers);
                    if (categoryTriggers.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                        {categoryTriggers.map((trigger) => (
                          <div
                            key={trigger.id}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-grab hover:bg-accent transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/reactflow', 'trigger');
                              e.dataTransfer.setData('application/subtype', trigger.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                          >
                            <div className={`p-2 rounded-lg ${trigger.color} text-white`}>
                              <trigger.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{trigger.name}</div>
                              <div className="text-xs text-muted-foreground">{trigger.description}</div>
                            </div>
                          </div>
                        ))}
                        <Separator className="my-3" />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="actions" className="mt-4">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {actionCategories.map((category) => {
                    const categoryActions = getActionsByCategory(category.id, filteredActions);
                    if (categoryActions.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                        {categoryActions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-grab hover:bg-accent transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/reactflow', 'action');
                              e.dataTransfer.setData('application/subtype', action.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                          >
                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{action.name}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                            {action.isPremium && (
                              <Badge variant="secondary" className="text-xs">PRO</Badge>
                            )}
                          </div>
                        ))}
                        <Separator className="my-3" />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="logic" className="mt-4">
              <div className="space-y-2">
                <div
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-grab hover:bg-accent transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', 'condition');
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className="p-2 rounded-lg bg-yellow-500 text-white">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">If/Else Condition</div>
                    <div className="text-xs text-muted-foreground">Branch workflow based on conditions</div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-grab hover:bg-accent transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', 'wait');
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className="p-2 rounded-lg bg-purple-500 text-white">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Wait</div>
                    <div className="text-xs text-muted-foreground">Add delays between actions</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Node Settings Panel */}
      <NodeSettingsPanel
        isOpen={showNodeSettings}
        onClose={() => {
          setShowNodeSettings(false);
          setSelectedNodeForSettings(null);
        }}
        node={selectedNodeForSettings}
        onSave={handleNodeConfigSave}
      />
    </div>
  );
}

// Helper functions
function getTriggersByCategory(categoryId: string, triggers: typeof triggerTypes) {
  return triggers.filter(trigger => trigger.category === categoryId);
}

function getActionsByCategory(categoryId: string, actions: typeof actionTypes) {
  return actions.filter(action => action.category === categoryId);
}