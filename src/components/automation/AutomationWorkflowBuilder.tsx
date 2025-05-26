
import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  BarChart3
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'wait';
  position: { x: number; y: number };
  data: {
    label: string;
    icon: any;
    config?: any;
  };
  connections?: string[];
}

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
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [automationName, setAutomationName] = useState('New Workflow : 1644273575181');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedAction, setDraggedAction] = useState<ActionType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        icon: draggedAction.icon
      }
    };

    setNodes(prev => [...prev, newNode]);
    setIsDragging(false);
    setDraggedAction(null);
  };

  const addTrigger = () => {
    const newNode: WorkflowNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger',
      position: { x: 500, y: 200 },
      data: {
        label: 'Add New Workflow Trigger',
        icon: Plus
      }
    };
    setNodes(prev => [...prev, newNode]);
  };

  const addFirstAction = () => {
    setSidebarOpen(true);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const duplicateNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newNode: WorkflowNode = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: { x: node.position.x + 20, y: node.position.y + 20 }
    };
    setNodes(prev => [...prev, newNode]);
  };

  const renderNode = (node: WorkflowNode) => {
    const Icon = node.data.icon;
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all ${
          selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
        }}
        onClick={() => setSelectedNode(node.id)}
      >
        {node.type === 'trigger' ? (
          <div className="bg-white border-2 border-orange-400 rounded-lg p-6 min-w-[300px] text-center shadow-sm">
            <div className="text-gray-400 text-lg font-medium">{node.data.label}</div>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-3 min-w-[150px] max-w-[200px] shadow-sm">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium truncate">{node.data.label}</span>
            </div>
            
            <div className="absolute -bottom-1 -right-1 flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
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
                className="h-6 w-6 p-0"
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

  const hasTrigger = nodes.some(node => node.type === 'trigger');
  const hasActions = nodes.some(node => node.type === 'action');

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              className="bg-transparent border-none text-white text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-slate-600">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Activate
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <Tabs defaultValue="actions" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b-0 h-12">
              <TabsTrigger value="actions" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Actions
              </TabsTrigger>
              <TabsTrigger value="settings" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Settings
              </TabsTrigger>
              <TabsTrigger value="history" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                History
              </TabsTrigger>
              <TabsTrigger value="status" className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Status
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full overflow-auto bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Render Nodes */}
            {nodes.map(renderNode)}
            
            {/* Empty State */}
            {!hasTrigger && (
              <div className="flex flex-col items-center justify-center h-full">
                <div 
                  className="bg-white border-2 border-dashed border-orange-400 rounded-lg p-8 mb-8 cursor-pointer hover:border-orange-500 transition-colors"
                  onClick={addTrigger}
                >
                  <div className="text-gray-400 text-xl font-medium text-center">
                    Add New Workflow<br />Trigger
                  </div>
                </div>
                
                {/* Connection Line */}
                <div className="w-0.5 h-16 bg-gray-300 mb-4"></div>
                
                {/* Plus Button */}
                <div 
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors mb-4"
                  onClick={addFirstAction}
                >
                  <Plus className="h-6 w-6 text-white" />
                </div>
                
                {/* Dashed Line */}
                <div className="w-0.5 h-16 border-l-2 border-dashed border-gray-300 mb-8"></div>
                
                <div className="text-2xl font-semibold text-gray-700">
                  Add your first Action
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Right Sidebar */}
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
                  Actions
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {sidebarOpen && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Available Actions</h3>
                
                {Object.entries(groupedActions).map(([category, actions]) => (
                  <Collapsible key={category} defaultOpen={false}>
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
                            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move transition-colors border border-gray-200"
                          >
                            <div className="bg-gray-700 text-white p-2 rounded mr-3">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{action.label}</div>
                              <div className="text-xs text-gray-500">{action.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
