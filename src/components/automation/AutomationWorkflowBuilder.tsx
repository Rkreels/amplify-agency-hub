
import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Play
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
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 400, y: 50 },
      data: {
        label: 'If Contact Has Tag "clickfunnels buyer list"',
        icon: Tag,
        config: { tag: 'clickfunnels buyer list' }
      }
    }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [automationName, setAutomationName] = useState('New Automation');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedAction, setDraggedAction] = useState<ActionType | null>(null);
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

  const addCondition = () => {
    const newNode: WorkflowNode = {
      id: `condition-${Date.now()}`,
      type: 'condition',
      position: { x: 300, y: 200 },
      data: {
        label: 'If Contact Has Tag',
        icon: Tag
      }
    };
    setNodes(prev => [...prev, newNode]);
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
        className={`absolute bg-white border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
          selectedNode === node.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
        } ${node.type === 'condition' ? 'bg-blue-50' : node.type === 'trigger' ? 'bg-green-50' : 'bg-white'}`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          minWidth: '150px',
          maxWidth: '200px'
        }}
        onClick={() => setSelectedNode(node.id)}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium truncate">{node.data.label}</span>
        </div>
        
        {node.type === 'condition' && (
          <div className="flex space-x-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs bg-blue-500 text-white">
              Yes
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-red-500 text-white">
              No
            </Button>
          </div>
        )}

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
    );
  };

  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionType[]>);

  return (
    <div className="h-screen flex">
      {/* Main Canvas */}
      <div className="flex-1 bg-gray-50 relative overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              className="font-semibold text-lg border-none p-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Activate
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-full overflow-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Render Nodes */}
          {nodes.map(renderNode)}
          
          {/* Add Condition Button */}
          <Button
            className="absolute top-20 left-4"
            variant="outline"
            onClick={addCondition}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l">
        <Tabs defaultValue="actions" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions" className="h-full p-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Available Actions</h3>
                
                {Object.entries(groupedActions).map(([category, actions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h4>
                    <div className="space-y-1">
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
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Automation Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="automation-name">Automation Name</Label>
                <Input
                  id="automation-name"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select defaultValue="tag-applied">
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tag-applied">Tag Applied</SelectItem>
                    <SelectItem value="form-submitted">Form Submitted</SelectItem>
                    <SelectItem value="appointment-booked">Appointment Booked</SelectItem>
                    <SelectItem value="contact-created">Contact Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedNode && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Node Settings</h4>
                  <p className="text-sm text-gray-600">Configure the selected workflow element</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Automation History</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">Automation created</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">Trigger condition updated</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
