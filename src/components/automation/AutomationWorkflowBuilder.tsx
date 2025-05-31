import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Plus, 
  Mail, 
  Clock, 
  ArrowRight, 
  User, 
  UserMinus, 
  Tag, 
  TagIcon,
  FileText, 
  Calendar, 
  Bell, 
  MessageSquare,
  Phone,
  DollarSign,
  Target,
  Workflow,
  Users,
  Eye,
  Trash2,
  Copy,
  Settings,
  History,
  Save,
  Play,
  ChevronRight,
  ChevronDown,
  Edit,
  BarChart3,
  Zap,
  GitBranch,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { useWorkflowStore, WorkflowNode } from '@/store/useWorkflowStore';
import { TriggerConfigModal } from './TriggerConfigModal';
import { ActionConfigModal } from './ActionConfigModal';

interface ActionType {
  id: string;
  label: string;
  icon: any;
  category: string;
  description: string;
}

const actionTypes: ActionType[] = [
  { id: 'add-contact-tag', label: 'Add Contact Tag', icon: Tag, category: 'contact', description: 'Add a tag to the contact' },
  { id: 'remove-contact-tag', label: 'Remove Contact Tag', icon: TagIcon, category: 'contact', description: 'Remove a tag from the contact' },
  { id: 'create-opportunity', label: 'Create/Update Opportunity', icon: Target, category: 'sales', description: 'Create or update an opportunity' },
  { id: 'add-to-notes', label: 'Add To Notes', icon: FileText, category: 'contact', description: 'Add notes to the contact' },
  { id: 'assign-user', label: 'Assign To User', icon: User, category: 'contact', description: 'Assign contact to a user' },
  { id: 'remove-assigned-user', label: 'Remove Assigned User', icon: UserMinus, category: 'contact', description: 'Remove assigned user from contact' },
  { id: 'set-event-date', label: 'Set Event Start Date', icon: Calendar, category: 'scheduling', description: 'Set an event start date' },
  { id: 'add-to-workflow', label: 'Add To Workflow', icon: Workflow, category: 'automation', description: 'Add contact to another workflow' },
  { id: 'remove-from-workflow', label: 'Remove From Workflow', icon: Workflow, category: 'automation', description: 'Remove contact from workflow' },
  { id: 'remove-from-all-workflows', label: 'Remove From All Workflows', icon: Users, category: 'automation', description: 'Remove contact from all workflows' },
  { id: 'remove-opportunity', label: 'Remove Opportunity', icon: DollarSign, category: 'sales', description: 'Remove an opportunity' },
  { id: 'send-internal-notification', label: 'Send Internal Notification', icon: Bell, category: 'communication', description: 'Send notification to team members' },
  { id: 'set-contact-dnd', label: 'Set Contact DND', icon: Phone, category: 'contact', description: 'Set do not disturb for contact' },
  { id: 'edit-conversation', label: 'Edit Conversation', icon: MessageSquare, category: 'communication', description: 'Edit conversation details' },
  { id: 'send-review-request', label: 'Send Review Request', icon: Eye, category: 'communication', description: 'Send a review request' },
  { id: 'send-email', label: 'Email', icon: Mail, category: 'communication', description: 'Send an email' },
  { id: 'send-sms', label: 'SMS', icon: MessageSquare, category: 'communication', description: 'Send an SMS' },
  { id: 'wait', label: 'Wait', icon: Clock, category: 'flow', description: 'Add a delay in the workflow' },
  { id: 'go-to', label: 'Go To', icon: ArrowRight, category: 'flow', description: 'Jump to another part of the workflow' }
];

export function AutomationWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    isConfigModalOpen,
    configModalNode,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    saveWorkflow,
    activateWorkflow,
    deactivateWorkflow,
    openConfigModal,
    closeConfigModal,
    updateWorkflowName,
    testWorkflow
  } = useWorkflowStore();

  const [isDragging, setIsDragging] = useState(false);
  const [draggedAction, setDraggedAction] = useState<ActionType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (action: ActionType) => {
    setDraggedAction(action);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedAction || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: WorkflowNode = {
      id: `${draggedAction.id}-${Date.now()}`,
      type: 'action',
      position: { x: x - 75, y: y - 25 },
      data: {
        label: draggedAction.label,
        icon: draggedAction.icon,
        isConfigured: false
      }
    };

    addNode(newNode);
    setIsDragging(false);
    setDraggedAction(null);
    
    // Auto-open config modal for new nodes
    setTimeout(() => openConfigModal(newNode), 100);
  };

  const addTrigger = () => {
    const newNode: WorkflowNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger',
      position: { x: 500, y: 200 },
      data: {
        label: 'Add New Workflow Trigger',
        icon: Zap,
        isConfigured: false
      }
    };
    addNode(newNode);
    setTimeout(() => openConfigModal(newNode), 100);
  };

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node.id);
    if (!node.data.isConfigured) {
      openConfigModal(node);
    }
  };

  const handleNodeDoubleClick = (node: WorkflowNode) => {
    openConfigModal(node);
  };

  const renderConnectionLines = () => {
    if (!currentWorkflow?.connections) return null;
    
    return currentWorkflow.connections.map((connection) => {
      const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
      const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const x1 = sourceNode.position.x + 75; // Center of source node
      const y1 = sourceNode.position.y + 25;
      const x2 = targetNode.position.x + 75; // Center of target node
      const y2 = targetNode.position.y + 25;
      
      return (
        <svg 
          key={connection.id}
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, width: '100%', height: '100%' }}
        >
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#94a3b8"
              />
            </marker>
          </defs>
        </svg>
      );
    });
  };

  const renderNode = (node: WorkflowNode) => {
    const Icon = node.data.icon;
    const isSelected = selectedNode === node.id;
    const isConfigured = node.data.isConfigured;
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all group ${
          isSelected ? 'ring-2 ring-blue-500 z-10' : 'z-0'
        }`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
        }}
        onClick={() => handleNodeClick(node)}
        onDoubleClick={() => handleNodeDoubleClick(node)}
      >
        {node.type === 'trigger' ? (
          <div className={`bg-white border-2 rounded-lg p-6 min-w-[300px] text-center shadow-lg ${
            isConfigured ? 'border-green-400' : 'border-orange-400'
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Icon className="h-5 w-5" />
              {!isConfigured && <AlertCircle className="h-4 w-4 text-orange-500" />}
            </div>
            <div className={`font-medium ${isConfigured ? 'text-gray-700' : 'text-gray-400'}`}>
              {node.data.label}
            </div>
            {isConfigured && (
              <Badge variant="secondary" className="mt-2">Configured</Badge>
            )}
          </div>
        ) : (
          <div className={`bg-white border-2 rounded-lg p-3 min-w-[180px] max-w-[220px] shadow-lg ${
            isConfigured ? 'border-green-300' : 'border-gray-300'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded ${isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Icon className={`h-4 w-4 ${isConfigured ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <span className="text-sm font-medium truncate flex-1">{node.data.label}</span>
              {!isConfigured && <AlertCircle className="h-3 w-3 text-orange-500 flex-shrink-0" />}
            </div>
            
            {isConfigured && (
              <Badge variant="outline" className="text-xs">
                Ready
              </Badge>
            )}
            
            <div className="absolute -bottom-1 -right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNode(node.id);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionType[]>);

  const hasTrigger = currentWorkflow?.nodes.some(node => node.type === 'trigger');
  const hasActions = currentWorkflow?.nodes.some(node => node.type === 'action');

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={currentWorkflow?.name || ''}
              onChange={(e) => updateWorkflowName(e.target.value)}
              className="bg-transparent border-none text-white text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[300px]"
            />
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
              <Edit className="h-4 w-4" />
            </Button>
            {currentWorkflow?.isActive && (
              <Badge className="bg-green-600">Active</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-white text-white hover:bg-slate-600"
              onClick={testWorkflow}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-white text-white hover:bg-slate-600"
              onClick={saveWorkflow}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              className={currentWorkflow?.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              onClick={() => {
                if (currentWorkflow?.isActive) {
                  deactivateWorkflow(currentWorkflow.id);
                  toast.success('Workflow deactivated');
                } else if (currentWorkflow) {
                  activateWorkflow(currentWorkflow.id);
                  toast.success('Workflow activated');
                }
              }}
            >
              {currentWorkflow?.isActive ? (
                <>
                  <Play className="h-4 w-4 mr-2 rotate-180" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b-0 h-12">
              <TabsTrigger value="builder" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Builder
              </TabsTrigger>
              <TabsTrigger value="settings" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="history" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full overflow-auto bg-gray-50 relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Connection Lines */}
            {renderConnectionLines()}
            
            {/* Render Nodes */}
            {currentWorkflow?.nodes.map(renderNode)}
            
            {/* Empty State */}
            {!hasTrigger && (
              <div className="flex flex-col items-center justify-center h-full">
                <div 
                  className="bg-white border-2 border-dashed border-orange-400 rounded-lg p-8 mb-8 cursor-pointer hover:border-orange-500 transition-colors hover:shadow-lg"
                  onClick={addTrigger}
                >
                  <div className="text-center">
                    <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <div className="text-gray-600 text-xl font-medium">
                      Add Workflow Trigger
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      Click to start building your automation
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl font-semibold text-gray-700 mt-8">
                  Start by adding a trigger
                </div>
                <div className="text-gray-500 mt-2">
                  Triggers define when your workflow should run
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Right Sidebar */}
      <div className={`bg-white border-l transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
        <div className="h-full flex flex-col">
          {/* Collapse/Expand Button */}
          <div className="p-3 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full justify-start"
            >
              {sidebarOpen ? (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Actions & Tools
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {sidebarOpen && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addTrigger}
                      className="h-auto flex-col gap-1 p-3"
                    >
                      <Zap className="h-4 w-4" />
                      <span className="text-xs">Add Trigger</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto flex-col gap-1 p-3"
                      onClick={() => toast.info('Drag an action from below to the canvas')}
                    >
                      <GitBranch className="h-4 w-4" />
                      <span className="text-xs">Add Action</span>
                    </Button>
                  </div>
                </div>

                {/* Workflow Stats */}
                {currentWorkflow && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Workflow Stats</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-lg font-bold text-blue-600">{currentWorkflow.nodes.length}</div>
                        <div className="text-xs text-blue-600">Nodes</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-lg font-bold text-green-600">{currentWorkflow.stats.triggered}</div>
                        <div className="text-xs text-green-600">Triggered</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-lg font-bold text-purple-600">{currentWorkflow.stats.completed}</div>
                        <div className="text-xs text-purple-600">Completed</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Available Actions</h3>
                  
                  {Object.entries(groupedActions).map(([category, actions]) => (
                    <Collapsible key={category} defaultOpen={category === 'communication'}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                        <h4 className="font-medium text-sm uppercase tracking-wide">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-2">
                        {actions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <div
                              key={action.id}
                              draggable
                              onDragStart={() => handleDragStart(action)}
                              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move transition-all border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            >
                              <div className="bg-gray-700 text-white p-2 rounded mr-3">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{action.label}</div>
                                <div className="text-xs text-gray-500 truncate">{action.description}</div>
                              </div>
                            </div>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Configuration Modals */}
      {configModalNode?.type === 'trigger' && (
        <TriggerConfigModal
          isOpen={isConfigModalOpen}
          onClose={closeConfigModal}
          node={configModalNode}
        />
      )}
      
      {configModalNode?.type === 'action' && (
        <ActionConfigModal
          isOpen={isConfigModalOpen}
          onClose={closeConfigModal}
          node={configModalNode}
        />
      )}
    </div>
  );
}
